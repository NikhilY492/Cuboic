import { useState, useEffect } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Loader2, Save } from 'lucide-react'

export default function RestaurantSettingsTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    gstNumber: '',
    address: '',
    contactNumber: '',
    email: '',
    currency: 'INR',
    paymentStrategy: 'PayPerOrder'
  })

  useEffect(() => {
    if (!restaurantId) return
    apiClient.get(`/settings/restaurant/${restaurantId}`)
      .then(res => {
        const data = res.data
        setFormData({
          name: data.name || '',
          gstNumber: data.gstNumber || '',
          address: data.address || '',
          contactNumber: data.contactNumber || '',
          email: data.email || '',
          currency: data.currency || 'INR',
          paymentStrategy: data.paymentStrategy || 'PayPerOrder'
        })
      })
      .catch(() => toast.error('Failed to load restaurant settings'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.patch(`/settings/restaurant/${restaurantId}`, {
        basic: formData
      })
      toast.success('Restaurant settings saved')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-10 text-center text-zinc-500">Loading settings...</div>
  }

  return (
    <div>
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Restaurant Details</h2>
        <p className="text-sm text-zinc-500">Update your primary restaurant information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-500">Restaurant Name</label>
            <input 
              required 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white transition-colors" 
              placeholder="Restaurant Name" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-500">GST Number</label>
            <input 
              type="text" 
              value={formData.gstNumber} 
              onChange={e => setFormData({...formData, gstNumber: e.target.value})} 
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white uppercase transition-colors" 
              placeholder="22AAAAA0000A1Z5" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-500">Address</label>
          <textarea 
            rows={3}
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})} 
            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white resize-none transition-colors" 
            placeholder="Complete address details" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-500">Contact Number</label>
            <input 
              type="text" 
              value={formData.contactNumber} 
              onChange={e => setFormData({...formData, contactNumber: e.target.value})} 
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white transition-colors" 
              placeholder="+91 9876543210" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-500">Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white transition-colors" 
              placeholder="contact@restaurant.com" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-500">Base Currency</label>
            <select 
              value={formData.currency} 
              onChange={e => setFormData({...formData, currency: e.target.value})} 
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white transition-colors"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-500">Payment Strategy</label>
            <select 
              value={formData.paymentStrategy} 
              onChange={e => setFormData({...formData, paymentStrategy: e.target.value})} 
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white transition-colors"
            >
              <option value="PayPerOrder">Pay Per Order (QSR)</option>
              <option value="PayAtEnd">Pay At End (Dine-in)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
