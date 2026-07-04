import { useEffect } from 'react'
import socket from '../api/socket'
import { useAuth } from '../contexts/AuthContext'
import { printKOT, type Order } from '../utils/printKOT'
import toast from 'react-hot-toast'

export function useAutoPrint() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.restaurantId) return
    const rId = user.restaurantId

    const handlePrintKOTEvent = async (order: Order) => {
      const autoPrintEnabled = localStorage.getItem('onomex_auto_print_kot') === 'true'
      const printerName = localStorage.getItem('onomex_kot_printer')

      if (autoPrintEnabled && printerName) {
        try {
          await printKOT(order, printerName)
          toast.success('Auto-printed KOT for order #' + order.id.slice(-8).toUpperCase())
        } catch (e: any) {
          console.error('Auto-print KOT failed:', e)
          toast.error(`Auto-print failed: ${e.message}`)
        }
      }
    }

    socket.on(`order:print_kot:${rId}`, handlePrintKOTEvent)

    return () => {
      socket.off(`order:print_kot:${rId}`, handlePrintKOTEvent)
    }
  }, [user?.restaurantId])
}
