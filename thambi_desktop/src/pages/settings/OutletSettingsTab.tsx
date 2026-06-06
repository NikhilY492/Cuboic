import { useState, useEffect } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { MapPin, Edit2 } from 'lucide-react'

export default function OutletSettingsTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  const [outlets, setOutlets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOutlet, setEditingOutlet] = useState<any | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNumber: '',
    managerId: '',
    is_active: true
  })

  useEffect(() => {
    loadOutlets()
  }, [restaurantId])

  const loadOutlets = async () => {
    if (!restaurantId) return
    try {
      setLoading(true)
      const res = await apiClient.get(`/settings/restaurant/${restaurantId}/outlets`)
      setOutlets(res.data)
    } catch (e) {
      toast.error('Failed to load outlets')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (outlet: any) => {
    setEditingOutlet(outlet)
    setFormData({
      name: outlet.name || '',
      address: outlet.address || '',
      contactNumber: outlet.contactNumber || '',
      managerId: outlet.managerId || '',
      is_active: outlet.is_active ?? true
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.patch(`/settings/outlet/${editingOutlet.id}`, formData)
      toast.success('Outlet updated')
      setEditingOutlet(null)
      loadOutlets()
    } catch (e) {
      toast.error('Failed to update outlet')
    }
  }

  if (loading) return <div className="py-10 text-center text-zinc-500">Loading outlets...</div>

  if (editingOutlet) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Edit Outlet</h2>
          <p className="text-sm text-zinc-500">{editingOutlet.name}</p>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-500">Outlet Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-500">Contact Number</label>
              <input type="text" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-500">Address</label>
            <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} rows={3} className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white resize-none" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 accent-accent" />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer text-zinc-900 dark:text-white">Outlet is Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <button type="button" onClick={() => setEditingOutlet(null)} className="px-6 py-2.5 font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:opacity-90 transition-opacity">Save Changes</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Outlets</h2>
        <p className="text-sm text-zinc-500">Manage your restaurant branches and locations.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {outlets.map(outlet => (
          <div key={outlet.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-accent/50 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                    {outlet.name}
                    {!outlet.is_active && <span className="text-[10px] uppercase px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-bold">Inactive</span>}
                  </h3>
                  <p className="text-sm text-zinc-500">{outlet.address || 'No address provided'}</p>
                </div>
              </div>
              <button onClick={() => handleEdit(outlet)} className="p-2 text-zinc-400 hover:text-accent transition-colors bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <Edit2 size={16} />
              </button>
            </div>
            
            <div className="space-y-2 mt-4 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                <span className="text-zinc-500">Contact</span>
                <span className="font-medium text-zinc-900 dark:text-white">{outlet.contactNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/50">
                <span className="text-zinc-500">Status</span>
                <span className="font-medium text-zinc-900 dark:text-white">{outlet.is_active ? 'Operating' : 'Closed'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
