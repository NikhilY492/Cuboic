import { useState, useEffect } from 'react'
import { apiClient } from '../api/apiClient'
import { useAuth } from '../contexts/AuthContext'

type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery'
type MenuItem = { id: string; name: string; price: number; categoryId: string; is_available: boolean }
type Category = { id: string; name: string }

export default function POSPage() {
  const { user } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  const [orderType, setOrderType] = useState<OrderType>('Dine-In')
  const [tableNo, setTableNo] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState('All')
  const [cart, setCart] = useState<{item: MenuItem, qty: number}[]>([])

  const fetchData = async () => {
    if (!user?.restaurantId) return
    try {
      const [menuRes, catsRes] = await Promise.all([
        apiClient.get(`/menu?restaurantId=${user.restaurantId}`),
        apiClient.get(`/categories?restaurantId=${user.restaurantId}`)
      ])
      setMenuItems(menuRes.data)
      setCategories(catsRes.data)
    } catch (e) {
      console.error("Failed to fetch POS data", e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const filteredMenu = menuItems.filter(item => 
    activeCategoryId === 'All' || item.categoryId === activeCategoryId
  )

  const addToCart = (item: MenuItem) => {
    if (!item.is_available) return
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      }
      return [...prev, { item, qty: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.item.id === id) {
        const newQty = Math.max(0, c.qty + delta)
        return { ...c, qty: newQty }
      }
      return c
    }).filter(c => c.qty > 0))
  }

  const subtotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0)
  const gst = subtotal * 0.05
  const total = subtotal + gst

  const handleCreateOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty")
    if (orderType === 'Dine-In' && !tableNo) return alert("Select a table number for Dine-In")
    
    try {
      const payload = {
        restaurantId: user?.restaurantId,
        outletId: user?.outletId,
        tableId: tableNo || null, // in realistic scenario, this is the table UUID
        orderType: orderType,
        items: cart.map(c => ({ itemId: c.item.id, quantity: c.qty }))
      }

      const { data } = await apiClient.post('/orders', payload)
      
      // Trigger KOT print in electron
      if (window.ipcRenderer) {
         window.ipcRenderer.invoke('print:kot', 'Default_Printer', [
           { type: 'text', value: `KOT Order: #${data.id}`, style: 'font-weight: bold; text-align: center;' }
         ])
      }

      alert(`Order Created! ₹${total.toFixed(2)}\nKOT sent to printer.`)
      setCart([])
      setTableNo('')
    } catch (e: any) {
      console.error("Order completion failed", e)
      alert(e.response?.data?.message || "Order Failed")
    }
  }

  return (
    <div className="flex h-full bg-zinc-950 text-white overflow-hidden">
      
      {/* LEFT PANE: Menu & Categories */}
      <div className="flex-1 flex flex-col border-r border-zinc-900">
        
        {/* Header: Order Type & Meta */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shadow-sm z-10">
          <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
            {['Dine-In', 'Takeaway', 'Delivery'].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type as OrderType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  orderType === type 
                    ? 'bg-blue-600 shadow-lg text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {orderType === 'Dine-In' && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-400">Table:</span>
              <select 
                value={tableNo} 
                onChange={(e) => setTableNo(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select Table</option>
                {[1,2,3,4,5,6].map(t => <option key={t} value={`T${t}`}>T{t}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-32 bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
            <button
              onClick={() => setActiveCategoryId('All')}
              className={`w-full text-left px-4 py-4 text-xs font-semibold uppercase tracking-tighter transition-all border-l-4 ${
                activeCategoryId === 'All' 
                  ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`w-full text-left px-4 py-4 text-xs font-semibold uppercase tracking-tighter transition-all border-l-4 ${
                  activeCategoryId === cat.id 
                    ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-zinc-950">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenu.map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={!item.is_available}
                  className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                    item.is_available 
                      ? 'border-zinc-800 bg-zinc-900 hover:border-blue-500 hover:bg-zinc-800 cursor-pointer active:scale-95' 
                      : 'border-zinc-900 bg-zinc-950/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="font-semibold text-zinc-100 dark:text-zinc-100 line-clamp-2 min-h-[2.5rem]">
                    {item.name}
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between w-full">
                    <span className="text-blue-400 font-medium">₹{item.price}</span>
                    {!item.is_available && <span className="text-xs text-red-500 font-medium bg-red-500/10 px-2 py-1 rounded">Out of Stock</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Cart & Checkout */}
      <div className="w-96 bg-zinc-900 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)] z-20 relative">
        <div className="p-4 border-b border-zinc-800 bg-zinc-900 shadow-sm z-10">
          <h2 className="text-lg font-bold">Current Order</h2>
          <p className="text-xs text-zinc-400">{orderType} {tableNo ? `• ${tableNo}` : ''}</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
              <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(c => (
              <div key={c.item.id} className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{c.item.name}</h4>
                  <p className="text-zinc-400 text-xs mt-0.5">₹{c.item.price} x {c.qty}</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                  <button onClick={() => updateQty(c.item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">-</button>
                  <span className="w-4 text-center text-sm font-medium">{c.qty}</span>
                  <button onClick={() => updateQty(c.item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-500 text-white">+</button>
                </div>
                <div className="w-16 text-right font-medium text-sm">
                  ₹{c.item.price * c.qty}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 mt-auto">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-400">
              <span>GST (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-zinc-800 border-dashed">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCreateOrder}
            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Pay & Print KOT
          </button>
        </div>

      </div>

    </div>
  )
}
