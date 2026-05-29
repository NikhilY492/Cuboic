export interface OrderItem {
  name: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  tableId?: string
  table?: { id: string; table_number: string } | null
  customer?: { name: string; phone: string } | null
  orderType: string
  items: OrderItem[]
  notes?: string
  subtotal: number
  tax: number
  total: number
  status: string
  payment?: {
    status: string
    method: string
  } | null
  createdAt: string
}

export const printKOT = async (order: Order, printerName: string) => {
  if (!window.ipcRenderer) {
    throw new Error('Printing is only available in the desktop app.')
  }
  if (!printerName) {
    throw new Error('No printer selected.')
  }

  const printData = [
    { type: 'text', value: 'KITCHEN ORDER TICKET', style: 'font-weight: 700; text-align: center; font-size: 22px;' },
    { type: 'text', value: `Order ID: #${order.id.slice(-8).toUpperCase()}`, style: 'text-align: center; font-size: 14px;' },
    { type: 'text', value: `Date: ${new Date(order.createdAt).toLocaleString()}`, style: 'text-align: center; font-size: 14px;' },
    { type: 'text', value: order.orderType === 'Takeaway' ? 'Type: TAKEAWAY' : `Table: ${order.table?.table_number || 'N/A'}`, style: 'font-weight: 700; text-align: center; font-size: 18px; margin-bottom: 10px; margin-top: 5px;' },
    { type: 'text', value: '--------------------------------', style: 'text-align: center;' }
  ]

  order.items.forEach(item => {
    printData.push({
      type: 'text',
      value: `${item.quantity} x ${item.name}`,
      style: 'font-weight: 700; font-size: 16px;'
    })
  })

  if (order.notes) {
    printData.push({ type: 'text', value: '--------------------------------', style: 'text-align: center;' })
    printData.push({ type: 'text', value: `NOTES: ${order.notes}`, style: 'font-weight: 700; font-size: 14px;' })
  }

  printData.push({ type: 'text', value: '--------------------------------', style: 'text-align: center;' })
  printData.push({ type: 'text', value: ' ', style: 'margin-bottom: 20px;' })

  const result = await window.ipcRenderer.invoke('print:kot', printerName, printData)
  if (!result.success) {
    throw new Error(result.error || 'Failed to print KOT')
  }
  return result
}
