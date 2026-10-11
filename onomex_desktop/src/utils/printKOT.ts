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
  restaurant?: {
    name?: string
    address?: string
    contactNumber?: string
  } | null
}

export const printKOT = async (order: Order, printerName: string, options?: { paperWidth?: '80mm' | '58mm' }) => {
  if (!window.ipcRenderer) {
    throw new Error('Printing is only available in the desktop app.')
  }
  if (!printerName) {
    throw new Error('No printer selected.')
  }

  const width = options?.paperWidth || '80mm'

  const printData: any[] = [
    { type: 'text', value: 'KITCHEN ORDER TICKET', style: { fontWeight: '800', textAlign: 'center', fontSize: '20px', fontFamily: 'monospace' } },
    { type: 'text', value: `Order ID: #${order.id.slice(-8).toUpperCase()}`, style: { textAlign: 'center', fontSize: '13px', fontFamily: 'monospace' } },
    { type: 'text', value: `Date: ${new Date(order.createdAt).toLocaleString()}`, style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace' } },
    { type: 'text', value: order.orderType === 'Takeaway' ? 'TYPE: TAKEAWAY' : `TABLE: ${order.table?.table_number || 'COUNTER'}`, style: { fontWeight: '800', textAlign: 'center', fontSize: '18px', marginBottom: '8px', marginTop: '4px', fontFamily: 'monospace' } },
    { type: 'text', value: '========================================', style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace' } }
  ]

  order.items.forEach(item => {
    printData.push({
      type: 'text',
      value: `<div style="display:flex; justify-content:space-between; font-family:monospace; font-size:15px; font-weight:bold; padding:4px 0;"><span>${item.quantity} x ${item.name}</span></div>`,
      style: { width: '100%' }
    })
  })

  if (order.notes) {
    printData.push(
      { type: 'text', value: '----------------------------------------', style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace' } },
      { type: 'text', value: `SPECIAL INSTRUCTIONS:\n${order.notes}`, style: { fontWeight: '700', fontSize: '13px', fontFamily: 'monospace' } }
    )
  }

  printData.push(
    { type: 'text', value: '========================================', style: { textAlign: 'center', fontSize: '12px', fontFamily: 'monospace' } },
    { type: 'text', value: '&nbsp;', style: { height: '35px', margin: '20px 0' } }
  )

  const result = await window.ipcRenderer.invoke('print:kot', printerName, printData, { width })
  if (!result.success) {
    throw new Error(result.error || 'Failed to print KOT')
  }
  return result
}
