import { useState, useEffect } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Save, Loader2 } from 'lucide-react'

export default function OrderSettingsTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    autoAcceptOrders: false,
    requireOrderPin: false,
    kotPrintDelay: 0,
    allowGuestCheckout: true
  })

  useEffect(() => {
    if (!restaurantId) return
    apiClient.get(`/settings/restaurant/${restaurantId}`)
      .then(res => {
        if (res.data.settings?.orderSettings) {
          setSettings({ ...settings, ...res.data.settings.orderSettings })
        }
      })
      .catch(() => toast.error('Failed to load order settings'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.patch(`/settings/restaurant/${restaurantId}`, {
        config: { orderSettings: settings }
      })
      toast.success('Order settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-10 text-center text-zinc-500">Loading settings...</div>

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Order Settings</h2>
        <p className="text-sm text-zinc-500">Configure how orders are processed and handled.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">Auto-Accept Orders</h3>
              <p className="text-sm text-zinc-500">Automatically confirm new orders without manual approval</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.autoAcceptOrders} onChange={e => setSettings({...settings, autoAcceptOrders: e.target.checked})} />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">Require Order PIN</h3>
              <p className="text-sm text-zinc-500">Staff must enter PIN to modify or cancel orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.requireOrderPin} onChange={e => setSettings({...settings, requireOrderPin: e.target.checked})} />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-accent"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white">Allow Guest Checkout</h3>
              <p className="text-sm text-zinc-500">Customers can order via QR code without creating an account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.allowGuestCheckout} onChange={e => setSettings({...settings, allowGuestCheckout: e.target.checked})} />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-2">KOT Print Delay (seconds)</h3>
            <p className="text-sm text-zinc-500 mb-3">Delay before sending order to kitchen printer</p>
            <input 
              type="number" 
              value={settings.kotPrintDelay} 
              onChange={e => setSettings({...settings, kotPrintDelay: Number(e.target.value)})} 
              className="w-full md:w-1/3 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white" 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
