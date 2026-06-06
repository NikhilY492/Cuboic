import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { OnEvent } from '@nestjs/event-emitter';
import * as net from 'net';

@Injectable()
export class PrintersService {
  private readonly logger = new Logger(PrintersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createPrinterDto: CreatePrinterDto) {
    return this.prisma.printer.create({
      data: createPrinterDto,
    });
  }

  async findAll(restaurantId: string) {
    if (!restaurantId) throw new BadRequestException('restaurantId is required');
    return this.prisma.printer.findMany({
      where: { restaurantId },
    });
  }

  async findOne(id: string) {
    const printer = await this.prisma.printer.findUnique({ where: { id } });
    if (!printer) throw new NotFoundException('Printer not found');
    return printer;
  }

  async update(id: string, updatePrinterDto: UpdatePrinterDto) {
    return this.prisma.printer.update({
      where: { id },
      data: updatePrinterDto,
    });
  }

  async remove(id: string) {
    return this.prisma.printer.delete({
      where: { id },
    });
  }

  async testPrint(id: string) {
    const printer = await this.findOne(id);
    if (!printer.isEnabled) throw new BadRequestException('Printer is disabled');
    if (printer.connectionType !== 'LAN' || !printer.ipAddress) {
      throw new BadRequestException('Only LAN printers with IP address are supported for direct printing right now.');
    }

    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: printer.restaurantId } });

    const commands = [
      '\x1b\x40', // Initialize
      '\x1b\x61\x01', // Center
      '\x1d\x21\x11', // Double width/height
      restaurant?.name || 'Restaurant', '\n',
      '\x1d\x21\x00', // Normal size
      '\x1b\x45\x01', // Bold on
      'TEST PRINT', '\n',
      '\x1b\x45\x00', // Bold off
      'Printer: ', printer.name, '\n',
      'Time: ', new Date().toLocaleString(), '\n\n\n\n',
      '\x1d\x56\x00', // Cut paper
    ].join('');

    return this.sendToPrinter(printer, commands, 'TEST');
  }

  @OnEvent('order.preparing', { async: true })
  async handleOrderPreparing(order: any) {
    this.logger.log(`Handling order.preparing event for order ${order.id}`);
    
    // Check if already printed
    if (order.kotPrinted) {
      this.logger.log(`KOT already printed for order ${order.id}`);
      return;
    }

    await this.printKotCommand(order, false);
  }

  async reprintKot(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { table: true, restaurant: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.printKotCommand(order, true);
  }

  private async printKotCommand(order: any, isReprint: boolean) {
    const printers = await this.prisma.printer.findMany({
      where: {
        restaurantId: order.restaurantId,
        type: 'KITCHEN',
        isEnabled: true,
        connectionType: 'LAN',
        ipAddress: { not: null },
      },
    });

    if (printers.length === 0) {
      this.logger.warn(`No active KOT printers found for restaurant ${order.restaurantId}`);
      return;
    }

    const restaurant = order.restaurant || await this.prisma.restaurant.findUnique({ where: { id: order.restaurantId } });
    
    let tableStr = 'Takeaway';
    if (order.tableId) {
       const table = order.table || await this.prisma.table.findUnique({ where: { id: order.tableId } });
       if (table) tableStr = table.table_number;
    }

    const orderNumber = order.id.slice(-8).toUpperCase();

    const header = [
      '\x1b\x40', // Init
      '\x1b\x61\x01', // Center
      '\x1d\x21\x11', // Double width/height
      isReprint ? '** REPRINT KOT **\n' : '** KOT **\n',
      '\x1d\x21\x00', // Normal size
      '\x1b\x45\x01', // Bold on
      restaurant?.name || 'Restaurant', '\n',
      '\x1b\x45\x00', // Bold off
      '\x1b\x61\x00', // Left
      '--------------------------------\n',
      `Order: #${orderNumber}\n`,
      `Table: ${tableStr}\n`,
      `Time:  ${new Date().toLocaleString()}\n`,
      '--------------------------------\n',
      '\x1b\x45\x01', // Bold on
      'Qty  Item\n',
      '\x1b\x45\x00', // Bold off
      '--------------------------------\n',
    ].join('');

    let itemsStr = '';
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items as any[]) {
       itemsStr += `${item.quantity.toString().padEnd(4)} ${(item.name as string).substring(0, 27)}\n`;
    }

    let notesStr = '';
    if (order.notes) {
       notesStr = `\nNotes:\n${order.notes}\n`;
    }

    const footer = [
      '--------------------------------\n\n\n\n',
      '\x1d\x56\x00', // Cut
    ].join('');

    const template = header + itemsStr + notesStr + footer;

    let allSuccess = true;
    for (const printer of printers) {
      try {
        await this.sendToPrinter(printer, template, 'KOT', order.id);
      } catch (e: any) {
        allSuccess = false;
        this.logger.error(`Failed to print KOT on printer ${printer.name}: ${e.message}`);
      }
    }

    if (allSuccess && !isReprint) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { kotPrinted: true, kotPrintedAt: new Date() },
      });
    }

    return { success: allSuccess };
  }

  private sendToPrinter(printer: any, data: string, printType: string, orderId?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      client.setTimeout(5000); // 5 sec timeout

      const logAttempt = async (success: boolean, errorMsg?: string) => {
        try {
          await this.prisma.printLog.create({
            data: {
              restaurantId: printer.restaurantId,
              printerId: printer.id,
              orderId,
              printType,
              success,
              errorMessage: errorMsg,
            }
          });
        } catch (dbErr: any) {
          this.logger.error(`Failed to create PrintLog: ${dbErr.message}`);
        }
      };

      client.connect(printer.port || 9100, printer.ipAddress, () => {
        client.write(Buffer.from(data, 'binary'), async (err) => {
          if (err) {
            await logAttempt(false, err.message);
            client.destroy();
            return reject(err);
          }
          await logAttempt(true);
          client.end(); // close connection gracefully
          resolve({ success: true, message: 'Print command sent successfully' });
        });
      });

      client.on('error', async (err) => {
        await logAttempt(false, err.message);
        client.destroy();
        reject(err);
      });

      client.on('timeout', async () => {
        await logAttempt(false, 'Connection timeout');
        client.destroy();
        reject(new Error('Printer connection timeout'));
      });
    });
  }
}
