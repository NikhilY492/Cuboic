import { useState, useEffect } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Save, Loader2 } from 'lucide-react'

export default function PaymentSettingsTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    acceptCash: true,
    acceptCard: true,
    acceptUPI: true,
    stripePublicKey: '',
    stripeSecretKey: '',
  })

  useEffect(() => {
    if (!restaurantId) return
    apiClient.get(`/settings/restaurant/${restaurantId}`)
      .then(res => {
        if (res.data.settings?.paymentSettings) {
          setSettings({ ...settings, ...res.data.settings.paymentSettings })
        }
      })
      .catch(() => toast.error('Failed to load payment settings'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.patch(`/settings/restaurant/${restaurantId}`, {
        config: { paymentSettings: settings }
      })
      toast.success('Payment settings saved')
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
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Payment Options</h2>
        <p className="text-sm text-zinc-500">Configure supported payment methods and API keys.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
            <span className="font-bold text-zinc-900 dark:text-white">Cash</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.acceptCash} onChange={e => setSettings({...settings, acceptCash: e.target.checked})} />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
            <span className="font-bold text-zinc-900 dark:text-white">Cards (Stripe)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.acceptCard} onChange={e => setSettings({...settings, acceptCard: e.target.checked})} />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
            <span className="font-bold text-zinc-900 dark:text-white">UPI / Local Apps</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.acceptUPI} onChange={e => setSettings({...settings, acceptUPI: e.target.checked})} />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>

        {settings.acceptCard && (
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Stripe Configuration</h3>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-500">Publishable Key</label>
              <input 
                type="text" 
                value={settings.stripePublicKey} 
                onChange={e => setSettings({...settings, stripePublicKey: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white font-mono" 
                placeholder="pk_test_..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-500">Secret Key</label>
              <input 
                type="password" 
                value={settings.stripeSecretKey} 
                onChange={e => setSettings({...settings, stripeSecretKey: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white font-mono" 
                placeholder="sk_test_..." 
              />
            </div>
          </div>
        )}

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
