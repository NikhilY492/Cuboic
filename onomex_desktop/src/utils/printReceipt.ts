import { type Order } from './printKOT'

export interface ReceiptPrintOptions {
  restaurantName?: string
  restaurantAddress?: string
  restaurantPhone?: string
  currencySymbol?: string
  paperWidth?: '80mm' | '58mm'
}

export const printReceipt = async (
  order: Order,
  printerName: string,
  options?: ReceiptPrintOptions
) => {
  if (!window.ipcRenderer) {
    throw new Error('Printing is only available in the desktop app.')
  }
  if (!printerName) {
    throw new Error('No printer selected.')
  }

  const restaurantName = options?.restaurantName || order.restaurant?.name || 'RESTAURANT RECEIPT'
  const restaurantAddress = options?.restaurantAddress || order.restaurant?.address || ''
  const restaurantPhone = options?.restaurantPhone || order.restaurant?.contactNumber || ''
  const currency = options?.currencySymbol || '₹'
  const width = options?.paperWidth || '80mm'

  const printData: any[] = [
    // Header
    {
      type: 'text',
      value: restaurantName.toUpperCase(),
      style: { fontWeight: '800', textAlign: 'center', fontSize: '20px', fontFamily: 'monospace', letterSpacing: '1px' }
    }
  ]

  if (restaurantAddress) {
    printData.push({
      type: 'text',
      value: restaurantAddress,
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', color: '#333' }
    })
  }

  if (restaurantPhone) {
    printData.push({
      type: 'text',
      value: `Tel: ${restaurantPhone}`,
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', color: '#333' }
    })
  }

  printData.push(
    {
      type: 'text',
      value: '========================================',
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', margin: '4px 0' }
    },
    {
      type: 'text',
      value: 'TAX INVOICE / CASH RECEIPT',
      style: { textAlign: 'center', fontWeight: '700', fontSize: '13px', fontFamily: 'monospace' }
    },
    {
      type: 'text',
      value: '----------------------------------------',
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', margin: '2px 0' }
    },
    // Order Meta Info
    {
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px;"><span>Order: #${order.id.slice(-8).toUpperCase()}</span><span>${new Date(order.createdAt).toLocaleDateString()}</span></div>`,
      style: { width: '100%' }
    },
    {
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px;"><span>Time: ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><span>Type: ${order.orderType === 'Takeaway' ? 'TAKEAWAY' : (order.table?.table_number ? `TABLE ${order.table.table_number}` : 'COUNTER')}</span></div>`,
      style: { width: '100%' }
    }
  )

  if (order.customer?.name || order.customer?.phone) {
    printData.push({
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px;"><span>Customer: ${order.customer.name || 'Guest'}</span><span>${order.customer.phone || ''}</span></div>`,
      style: { width: '100%' }
    })
  }

  printData.push(
    {
      type: 'text',
      value: '----------------------------------------',
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', margin: '3px 0' }
    },
    // Column Headers
    {
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px; font-weight:bold; border-bottom:1px solid #000; padding-bottom:3px;">
        <span style="flex:2; text-align:left;">ITEM</span>
        <span style="flex:1; text-align:center;">QTY</span>
        <span style="flex:1; text-align:right;">RATE</span>
        <span style="flex:1; text-align:right;">AMOUNT</span>
      </div>`,
      style: { width: '100%' }
    }
  )

  // Items
  order.items.forEach(item => {
    const itemTotal = (item.quantity * item.unitPrice).toFixed(2)
    printData.push({
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px; padding:3px 0;">
        <span style="flex:2; text-align:left; word-break:break-word;">${item.name}</span>
        <span style="flex:1; text-align:center;">${item.quantity}</span>
        <span style="flex:1; text-align:right;">${item.unitPrice.toFixed(2)}</span>
        <span style="flex:1; text-align:right;">${itemTotal}</span>
      </div>`,
      style: { width: '100%' }
    })
  })

  // Calculations / Totals
  printData.push(
    {
      type: 'text',
      value: '----------------------------------------',
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', margin: '3px 0' }
    },
    {
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px; padding:2px 0;"><span>Subtotal:</span><span>${currency}${order.subtotal.toFixed(2)}</span></div>`,
      style: { width: '100%' }
    }
  )

  if (order.tax && order.tax > 0) {
    printData.push({
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px; padding:2px 0;"><span>Taxes / GST:</span><span>${currency}${order.tax.toFixed(2)}</span></div>`,
      style: { width: '100%' }
    })
  }

  printData.push(
    {
      type: 'text',
      value: '========================================',
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', margin: '3px 0' }
    },
    // Grand Total (Big & Bold)
    {
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:16px; font-weight:800; padding:4px 0;"><span>GRAND TOTAL:</span><span>${currency}${order.total.toFixed(2)}</span></div>`,
      style: { width: '100%' }
    },
    {
      type: 'text',
      value: '========================================',
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', margin: '3px 0' }
    }
  )

  // Payment status & mode
  const paymentMethod = order.payment?.method || 'Counter'
  const paymentStatus = order.payment?.status || 'Pending'
  printData.push({
    type: 'text',
    value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:12px; font-weight:bold; margin-top:2px;"><span>Payment Mode: ${paymentMethod}</span><span>[${paymentStatus.toUpperCase()}]</span></div>`,
    style: { width: '100%' }
  })

  if (order.notes) {
    printData.push({
      type: 'text',
      value: `<div style="font-family:monospace; font-size:11px; margin-top:4px;">Notes: ${order.notes}</div>`,
      style: { width: '100%' }
    })
  }

  // Footer & Feed
  printData.push(
    {
      type: 'text',
      value: '----------------------------------------',
      style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace', margin: '6px 0' }
    },
    {
      type: 'text',
      value: '*** THANK YOU FOR DINING WITH US! ***',
      style: { textAlign: 'center', fontWeight: '700', fontSize: '12px', fontFamily: 'monospace' }
    },
    {
      type: 'text',
      value: 'Please visit us again!',
      style: { textAlign: 'center', fontSize: '11px', fontFamily: 'monospace', color: '#555' }
    },
    // Feed space before cutter
    {
      type: 'text',
      value: '&nbsp;',
      style: { height: '35px', margin: '20px 0' }
    }
  )

  const result = await window.ipcRenderer.invoke('print:receipt', printerName, printData, { width })
  if (!result.success) {
    throw new Error(result.error || 'Failed to print receipt')
  }
  return result
}

// Function to print a test receipt to verify printer connection and alignment
export const printTestReceipt = async (printerName: string, paperWidth: '80mm' | '58mm' = '80mm') => {
  const mockOrder: Order = {
    id: 'test' + Math.floor(100000 + Math.random() * 900000),
    orderType: 'DineIn',
    table: { id: 't1', table_number: '1' },
    items: [
      { name: 'Special Chicken Biryani', quantity: 1, unitPrice: 280 },
      { name: 'Butter Naan', quantity: 2, unitPrice: 45 },
      { name: 'Fresh Lime Soda', quantity: 1, unitPrice: 70 }
    ],
    subtotal: 440,
    tax: 22,
    total: 462,
    status: 'Confirmed',
    payment: {
      method: 'Cash',
      status: 'Paid'
    },
    notes: 'Extra spicy, well done',
    createdAt: new Date().toISOString()
  }

  return printReceipt(mockOrder, printerName, {
    restaurantName: 'TEST PRINT RECEIPT',
    restaurantAddress: '123 Food Street, Downtown',
    restaurantPhone: '+91 98765 43210',
    paperWidth
  })
}
