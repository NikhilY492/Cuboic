import { useEffect, useRef } from 'react'
import socket from '../api/socket'
import { useAuth } from '../contexts/AuthContext'
import { printKOT, type Order } from '../utils/printKOT'
import { printReceipt } from '../utils/printReceipt'
import toast from 'react-hot-toast'

export function useAutoPrint() {
  const { user } = useAuth()
  const printedOrdersRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!user?.restaurantId) return
    const rId = user.restaurantId

    // Helper to get active printer name
    const getTargetPrinter = async (type: 'receipt' | 'kot') => {
      const explicit = type === 'receipt' 
        ? localStorage.getItem('onomex_receipt_printer') 
        : localStorage.getItem('onomex_kot_printer')
      
      if (explicit) return explicit

      const general = localStorage.getItem('onomex_kot_printer') || localStorage.getItem('onomex_receipt_printer')
      if (general) return general

      // Auto-detect printer from system if not yet configured
      if (window.ipcRenderer) {
        try {
          const printers = await window.ipcRenderer.invoke('print:get-printers')
          const posPrinter = printers.find((p: any) => 
            /pos|kpc|caysn|thermal|receipt/i.test(p.name)
          )
          if (posPrinter) {
            localStorage.setItem('onomex_receipt_printer', posPrinter.name)
            localStorage.setItem('onomex_kot_printer', posPrinter.name)
            return posPrinter.name
          }
          const defaultPrinter = printers.find((p: any) => p.isDefault)
          if (defaultPrinter) return defaultPrinter.name
          if (printers.length > 0) return printers[0].name
        } catch {
          // ignore error
        }
      }
      return null
    }

    // Handle new order received
    const handleNewOrder = async (order: Order) => {
      console.log('[DEBUG] AutoPrint: order:new received for order:', order.id)
      
      const isAutoPrintEnabled = 
        localStorage.getItem('onomex_auto_print_enabled') !== 'false' &&
        localStorage.getItem('onomex_auto_print_kot') !== 'false'
      
      if (!isAutoPrintEnabled) {
        console.log('[DEBUG] AutoPrint: Disabled in settings')
        return
      }

      const dedupeKey = `new:${order.id}`
      if (printedOrdersRef.current.has(dedupeKey)) {
        console.log('[DEBUG] AutoPrint: Order already printed:', order.id)
        return
      }
      printedOrdersRef.current.add(dedupeKey)

      const mode = localStorage.getItem('onomex_auto_print_mode') || 'receipt' // 'receipt' | 'kot' | 'both'
      const paperWidth = (localStorage.getItem('onomex_paper_width') || '80mm') as '80mm' | '58mm'
      const shortId = order.id.slice(-8).toUpperCase()

      try {
        if (mode === 'receipt' || mode === 'both') {
          const printerName = await getTargetPrinter('receipt')
          if (printerName) {
            await printReceipt(order, printerName, { paperWidth })
            toast.success(`Receipt printed for Order #${shortId}`)
          } else {
            toast.error('No printer selected for receipt auto-printing.')
          }
        }

        if (mode === 'kot' || mode === 'both') {
          const kotPrinterName = await getTargetPrinter('kot')
          if (kotPrinterName) {
            await printKOT(order, kotPrinterName, { paperWidth })
            if (mode !== 'both') {
              toast.success(`KOT printed for Order #${shortId}`)
            }
          }
        }
      } catch (err: any) {
        console.error('[DEBUG] AutoPrint error:', err)
        toast.error(`Auto-print failed: ${err.message || err.toString()}`)
      }
    }

    // Handle explicit KOT print event
    const handlePrintKOTEvent = async (order: Order) => {
      const dedupeKey = `kot:${order.id}`
      if (printedOrdersRef.current.has(dedupeKey)) return
      printedOrdersRef.current.add(dedupeKey)

      try {
        const printerName = await getTargetPrinter('kot')
        if (printerName) {
          const paperWidth = (localStorage.getItem('onomex_paper_width') || '80mm') as '80mm' | '58mm'
          await printKOT(order, printerName, { paperWidth })
          toast.success(`KOT printed for Order #${order.id.slice(-8).toUpperCase()}`)
        }
      } catch (err: any) {
        console.error('KOT Print failed:', err)
        toast.error(`Print failed: ${err.message}`)
      }
    }

    socket.on(`order:new:${rId}`, handleNewOrder)
    socket.on(`order:print_kot:${rId}`, handlePrintKOTEvent)

    return () => {
      socket.off(`order:new:${rId}`, handleNewOrder)
      socket.off(`order:print_kot:${rId}`, handlePrintKOTEvent)
    }
  }, [user?.restaurantId])
}
