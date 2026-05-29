import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api/apiClient'
import { useAuth } from '../contexts/AuthContext'
import socket from '../api/socket'
import { UtensilsCrossed, Clock, CheckCircle, XCircle, ChevronRight, RefreshCw, WifiOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useMutationQueue } from '../hooks/useMutationQueue'
import { printKOT, type Order } from '../utils/printKOT'

// ── Types ──────────────────────────────────────────────────────────────────
interface Table {
  id: string
  table_number: string
  is_active: boolean
}


const ACTIVE_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Assigned']

const STATUS_COLOR: Record<string, string> = {
  Pending:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Confirmed: 'text-sky-400  bg-sky-400/10  border-sky-400/20',
  Preparing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  Ready:     'text-green-400 bg-green-400/10 border-green-400/20',
  Assigned:  'text-sky-400  bg-sky-400/10  border-sky-400/20',
  Delivered: 'text-zinc-400 bg-zinc-800 border-zinc-700',
  Cancelled: 'text-red-400  bg-red-400/10  border-red-400/20',
}

const NEXT_STATUS: Record<string, string> = {
  Pending:   'Confirmed',
  Confirmed: 'Preparing',
  Preparing: 'Ready',
  Ready:     'Delivered',
}

// ── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diff < 1) return 'Just now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff / 60)}h ${diff % 60}m ago`
}

// ── Components ────────────────────────────────────────────────────────────
function AllOrdersList({ orders, searchQuery, onPrintKOT, onSelectOrder }: any) {
  const filtered = orders.filter((o: any) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return o.id.toLowerCase().includes(q) || 
           o.customer?.name.toLowerCase().includes(q) || 
           o.customer?.phone.toLowerCase().includes(q)
  })

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-950">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-sm">
            <th className="pb-3 font-medium">Order ID</th>
            <th className="pb-3 font-medium">Type / Table</th>
            <th className="pb-3 font-medium">Date & Time</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Total</th>
            <th className="pb-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {sorted.map((order: any) => (
            <tr key={order.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
              <td className="py-3 font-mono">#{order.id.slice(-8).toUpperCase()}</td>
              <td className="py-3">{order.orderType === 'Takeaway' ? 'Takeaway' : `Table ${order.table?.table_number || '?'}`}</td>
              <td className="py-3 text-zinc-500">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="py-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLOR[order.status] || 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200'}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 font-medium">₹{order.total.toFixed(2)}</td>
              <td className="py-3 text-right">
                <button onClick={() => onPrintKOT(order)} className="text-accent hover:underline mr-4 text-xs font-medium">Print KOT</button>
                <button onClick={() => onSelectOrder(order)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-xs font-medium">Inspect</button>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-zinc-500">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { user } = useAuth()
  const [tables, setTables]           = useState<Table[]>([])
  const [orders, setOrders]           = useState<Order[]>([])
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [filter, setFilter]           = useState<'all' | 'free' | 'occupied'>('all')
  const [searchQuery, setSearchQuery]    = useState('')
  const [loading, setLoading]         = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const loadData = useCallback(async () => {
    if (!user?.restaurantId) return
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        apiClient.get<Table[]>(`/restaurants/${user.restaurantId}/tables`),
        apiClient.get<Order[]>('/orders', {
          params: { restaurantId: user.restaurantId }
        })
      ])
      
      const filteredTables = tablesRes.data.filter(t => t.is_active !== false);
      setTables(filteredTables)
      setOrders(ordersRes.data)
      setLastRefresh(new Date())
    } catch (e: any) {
      console.error('❌ Failed to load orders/tables:', e.response?.data || e.message)
    } finally {
      setLoading(false)
    }
  }, [user?.restaurantId])

  const { enqueue, drain, isOnline, queue } = useMutationQueue(loadData)

  const load = useCallback(async () => {
      await loadData()
  }, [loadData])

  const [viewMode, setViewMode] = useState<'floor' | 'list'>('floor')
  const [printers, setPrinters] = useState<{ name: string, isDefault: boolean }[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<string>('')
  const [autoPrint, setAutoPrint] = useState<boolean>(
    localStorage.getItem('thambi_auto_print_kot') === 'true'
  )

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.invoke('print:get-printers').then(printersList => {
        setPrinters(printersList)
        const saved = localStorage.getItem('thambi_kot_printer')
        const defaultPrinter = printersList.find((p: any) => p.isDefault)
        if (saved && printersList.some((p: any) => p.name === saved)) {
          setSelectedPrinter(saved)
        } else if (defaultPrinter) {
          setSelectedPrinter(defaultPrinter.name)
        } else if (printersList.length > 0) {
          setSelectedPrinter(printersList[0].name)
        }
      })
    }
  }, [])



  useEffect(() => { load() }, [load])

  // ── Real-time Socket ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.restaurantId) return
    const rId = user.restaurantId
    const handleOrderNew     = () => load()
    const handleOrderUpdated = () => load()
    socket.on(`order:new:${rId}`,     handleOrderNew)
    socket.on(`order:updated:${rId}`, handleOrderUpdated)
    return () => {
      socket.off(`order:new:${rId}`,     handleOrderNew)
      socket.off(`order:updated:${rId}`, handleOrderUpdated)
    }
  }, [user?.restaurantId, load])

  // ── Computed Values ─────────────────────────────────────────────────────
  // Map table_id → its most recent active order
  const activeOrderByTableId = new Map<string, Order>()
  orders.forEach(o => {
    if (ACTIVE_STATUSES.includes(o.status) && o.tableId) {
      const existing = activeOrderByTableId.get(o.tableId)
      if (!existing || new Date(o.createdAt) > new Date(existing.createdAt)) {
        activeOrderByTableId.set(o.tableId, o)
      }
    }
  })

  const selectedOrder = selectedOrderId
    ? orders.find(o => o.id === selectedOrderId) ?? null
    : (selectedTable ? activeOrderByTableId.get(selectedTable.id) ?? null : null)

  // ── Actions ─────────────────────────────────────────────────────────────
  const advanceStatus = async (order: Order) => {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o))
    enqueue('UPDATE_STATUS', { orderId: order.id, status: next }, (order as any).version)
    
    if (isOnline) drain(loadData)
  }

  const cancelOrder = async (order: Order) => {
    if (!confirm('Cancel this order?')) return
    
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Cancelled' } : o))
    setSelectedTable(null)
    setSelectedOrderId(null)
    
    enqueue('UPDATE_STATUS', { orderId: order.id, status: 'Cancelled' }, (order as any).version)
    
    if (isOnline) drain(loadData)
  }

  const settleTable = async (_tableId: string, orderIds: string[]) => {
    if (!confirm('Settle all unpaid orders for this table?')) return
    
    setOrders(prev => prev.map(o => {
        if (orderIds.includes(o.id)) {
            return { ...o, payment: { ...o.payment, status: 'Paid' as any, method: o.payment?.method || '' } }
        }
        return o
    }))
    
    enqueue('MARK_PAID_BULK', { orderIds, restaurantId: user?.restaurantId })
    
    if (isOnline) drain(loadData)
  }

  const handlePrintKOT = async (order: Order) => {
    try {
      setActionLoading(true)
      await printKOT(order, selectedPrinter)
      toast.success('Ticket sent to printer!')
    } catch (e: any) {
      toast.error(e.message || 'Failed to print')
    } finally {
      setActionLoading(false)
    }
  }

  // ── Summary Stats ────────────────────────────────────────────────────────
  const occupiedCount = activeOrderByTableId.size
  const pendingCount  = orders.filter(o => o.status === 'Pending').length
  const readyCount    = orders.filter(o => o.status === 'Ready').length

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-4 text-zinc-500 dark:text-zinc-400">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading floor plan…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">

      {/* ── LEFT: Table Grid ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 transition-colors duration-300">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight">Orders</h1>
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('floor')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'floor' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >Floor Plan</button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >All Orders</button>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Updated {timeAgo(lastRefresh.toISOString())}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Sync Status indicator */}
            {!isOnline ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full animate-pulse">
                    <WifiOff size={14} /> Offline ({queue.length} pending)
                </div>
            ) : queue.length > 0 ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full animate-pulse">
                    <RefreshCw size={14} className="animate-spin" /> Syncing {queue.length}...
                </div>
            ) : null}

            {/* Quick-stat pills */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors duration-300">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                {occupiedCount} Occupied
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full text-xs font-medium text-amber-600 dark:text-amber-400 transition-colors duration-300">
                <Clock size={12} />
                {pendingCount} Pending
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full text-xs font-medium text-green-600 dark:text-green-400 transition-colors duration-300">
                <CheckCircle size={12} />
                {readyCount} Ready
              </div>
            </div>
            
            {viewMode === 'floor' && (
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 transition-colors duration-300">
                {(['all', 'free', 'occupied'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      filter === f ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            )}
            
            {printers.length > 0 && (
              <div className="flex items-center gap-2">
                <select 
                  value={selectedPrinter} 
                  onChange={e => {
                    setSelectedPrinter(e.target.value)
                    localStorage.setItem('thambi_kot_printer', e.target.value)
                  }}
                  className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-2 py-1 text-xs text-zinc-600 dark:text-zinc-300 focus:ring-1 focus:ring-accent max-w-[120px]"
                >
                  {printers.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={autoPrint}
                    onChange={(e) => {
                      setAutoPrint(e.target.checked)
                      localStorage.setItem('thambi_auto_print_kot', e.target.checked ? 'true' : 'false')
                    }}
                    className="rounded border-zinc-300 text-accent focus:ring-accent w-3 h-3"
                  />
                  Auto-print
                </label>
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                placeholder="Search phone / table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:ring-1 focus:ring-accent w-48 transition-colors duration-300"
              />
            </div>
            
            <button onClick={load} className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {viewMode === 'floor' ? (
          <>
            {/* Legend */}
            <div className="px-6 py-2 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center gap-6 text-xs text-zinc-500 flex-shrink-0 transition-colors duration-300">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-accent bg-accent/10 inline-block"></span> Occupied</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 inline-block"></span> Free</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-green-500 bg-green-500/10 inline-block"></span> Order Ready</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2 border-amber-500 bg-amber-500/10 inline-block"></span> Pending</span>
            </div>

            {/* Table Grid */}
            <div className="flex-1 overflow-y-auto p-6">
          {tables.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
              <UtensilsCrossed size={48} className="mb-4 opacity-30" />
              <p className="font-medium">No tables found</p>
              <p className="text-sm mt-1">Check restaurant configuration</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tables
                .filter(table => {
                  const activeOrder = activeOrderByTableId.get(table.id)
                  const allTableOrders = orders.filter(o => o.tableId === table.id)
                  
                  // Status filter
                  const isOccupied = !!activeOrder
                  if (filter === 'free' && isOccupied) return false
                  if (filter === 'occupied' && !isOccupied) return false

                  // Search filter
                  if (searchQuery) {
                    const q = searchQuery.toLowerCase()
                    const matchesTable = table.table_number.toLowerCase().includes(q)
                    const matchesOrder = allTableOrders.some(o => 
                      o.customer?.name.toLowerCase().includes(q) || 
                      o.customer?.phone.toLowerCase().includes(q) ||
                      o.id.toLowerCase().includes(q)
                    )
                    if (!matchesTable && !matchesOrder) return false
                  }
                  
                  return true
                })
                .map(table => {
                const activeOrder = activeOrderByTableId.get(table.id)
                const isSelected  = selectedTable?.id === table.id
                const isReady     = activeOrder?.status === 'Ready'
                const isPending   = activeOrder?.status === 'Pending'
                const isOccupied  = !!activeOrder

                let borderClass = 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500'
                let bgClass     = 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                let dotColor    = 'bg-zinc-200 dark:bg-zinc-600'
                let labelColor  = 'text-zinc-500 dark:text-zinc-400'

                if (isOccupied) {
                  if (isReady) {
                    borderClass = 'border-green-500/60 hover:border-green-400'
                    bgClass     = 'bg-green-500/5 hover:bg-green-500/10'
                    dotColor    = 'bg-green-500 animate-pulse'
                    labelColor  = 'text-green-400'
                  } else if (isPending) {
                    borderClass = 'border-amber-500/60 hover:border-amber-400'
                    bgClass     = 'bg-amber-500/5 hover:bg-amber-500/10'
                    dotColor    = 'bg-amber-400 animate-pulse'
                    labelColor  = 'text-amber-400'
                  } else {
                    borderClass = 'border-accent/60 hover:border-accent'
                    bgClass     = 'bg-accent/5 hover:bg-accent/10'
                    dotColor    = 'bg-accent'
                    labelColor  = 'text-accent'
                  }
                }

                if (isSelected) {
                  borderClass = borderClass.replace('hover:', '') + ' ring-2 ring-zinc-900/20 dark:ring-white/20'
                }

                return (
                  <button
                    key={table.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTable(null)
                        setSelectedOrderId(null)
                      } else {
                        setSelectedTable(table)
                        setSelectedOrderId(activeOrder ? activeOrder.id : null)
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center aspect-square rounded-2xl border-2 transition-all cursor-pointer ${borderClass} ${bgClass}`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full mb-2 ${dotColor}`} />
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">{table.table_number}</span>
                    {isOccupied && (
                      <>
                        <span className={`text-[10px] font-semibold ${labelColor} mt-1`}>
                          {activeOrder?.status}
                        </span>
                        <span className="text-[9px] text-zinc-500 mt-0.5">
                          {timeAgo(activeOrder!.createdAt)}
                        </span>
                      </>
                    )}
                    {!isOccupied && (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">Free</span>
                    )}
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-full">
                        <ChevronRight size={14} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </>
        ) : (
          <AllOrdersList 
            orders={orders} 
            searchQuery={searchQuery} 
            onPrintKOT={handlePrintKOT}
            onSelectOrder={(o: any) => {
              if (o.tableId) {
                const table = tables.find(t => t.id === o.tableId)
                if (table) {
                  setSelectedTable(table)
                  setSelectedOrderId(o.id)
                  setViewMode('floor')
                }
              }
            }}
          />
        )}
      </div>

      {/* ── RIGHT: Inspector Panel (ONLY RENDER IF SELECTED) ───────────────── */}
      {selectedTable && (
        <div className="w-96 flex flex-col border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-in slide-in-from-right duration-300 transition-colors">
          {/* Panel Header */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold">Table {selectedTable.table_number}</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {selectedOrder ? 'Active order in progress' : 'No active orders'}
              </p>
            </div>
            <button
              onClick={() => setSelectedTable(null)}
              className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <XCircle size={18} />
            </button>
          </div>

          {/* Panel Body */}
          {!selectedOrder ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-600">
              <UtensilsCrossed size={48} className="mb-4 opacity-30" />
              <p className="font-medium">Table is free</p>
              <p className="text-sm mt-1 text-center">No active dine-in order for this table</p>
            </div>
          ) : (
            <>
              {/* Order Meta */}
              <div className="p-5 border-b border-zinc-800 space-y-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Order ID</span>
                  <span className="text-xs font-mono text-zinc-300">#{selectedOrder.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Placed</span>
                  <span className="text-xs text-zinc-300">{new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {timeAgo(selectedOrder.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Status</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[selectedOrder.status] ?? 'text-zinc-400 bg-zinc-800 border-zinc-700'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Payment</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${selectedOrder.payment?.status === 'Paid' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'}`}>
                    {selectedOrder.payment?.status === 'Paid' ? 'PAID' : 'UNPAID'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="flex-1 overflow-y-auto p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-800">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">₹{item.unitPrice} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm text-zinc-900 dark:text-white ml-4">₹{(item.unitPrice * item.quantity).toFixed(0)}</p>
                    </div>
                  ))}
                </div>

                {selectedOrder.notes && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs font-semibold text-amber-400 mb-1">Notes</p>
                    <p className="text-sm text-amber-200">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Totals & Actions */}
              <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                    <span>Tax</span>
                    <span>₹{selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-zinc-900 dark:text-white pt-1.5 border-t border-zinc-200 dark:border-zinc-800 border-dashed">
                    <span>Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {NEXT_STATUS[selectedOrder.status] && selectedOrder.orderType === 'Takeaway' && (NEXT_STATUS[selectedOrder.status] !== 'Ready' || user?.role === 'Kitchen') && (
                    <button
                      onClick={() => advanceStatus(selectedOrder)}
                      disabled={actionLoading}
                      className="w-full bg-accent hover:bg-accent-dark text-zinc-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {actionLoading ? (
                        <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Mark as {NEXT_STATUS[selectedOrder.status]}
                        </>
                      )}
                    </button>
                  )}
                  
                  {selectedOrder && (
                    <button
                      onClick={() => handlePrintKOT(selectedOrder)}
                      disabled={actionLoading}
                      className="w-full bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      Print KOT
                    </button>
                  )}
                  
                  {(() => {
                    const unpaidOrders = orders.filter(o => o.tableId === selectedTable.id && o.payment?.status !== 'Paid' && o.status !== 'Cancelled')
                    const unpaidTotal = unpaidOrders.reduce((sum, o) => sum + o.total, 0)
                    
                    if (unpaidOrders.length > 0) {
                      return (
                        <button
                          onClick={() => settleTable(selectedTable.id, unpaidOrders.map(o => o.id))}
                          disabled={actionLoading}
                          className="w-full bg-green-500 hover:bg-green-600 text-zinc-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-lg shadow-green-500/20"
                        >
                          <UtensilsCrossed size={18} />
                          Settle Table (₹{unpaidTotal.toFixed(0)})
                        </button>
                      )
                    }
                    return null
                  })()}

                  {!['Delivered', 'Cancelled'].includes(selectedOrder.status) && (
                    <button
                      onClick={() => cancelOrder(selectedOrder)}
                      disabled={actionLoading}
                      className="w-full bg-zinc-800 hover:bg-red-500/20 hover:border-red-500/40 border border-zinc-700 text-zinc-300 hover:text-red-400 font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      <XCircle size={16} />
                      Cancel Order
                    </button>
                  )}
                  {selectedOrder.status === 'Delivered' && (
                    <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-medium py-2">
                      <CheckCircle size={16} />
                      Order Completed
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  )
}
