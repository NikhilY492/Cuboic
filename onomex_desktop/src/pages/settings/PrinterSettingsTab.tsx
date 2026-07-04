import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import { Printer as PrinterIcon, Plus, Trash2, Edit2, Play, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PrinterSettingsTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  const [printers, setPrinters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPrinter, setEditingPrinter] = useState<any | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: 'KITCHEN',
    connectionType: 'LAN',
    ipAddress: '',
    port: 9100,
    isEnabled: true
  })

  const loadPrinters = useCallback(async () => {
    if (!restaurantId) return
    try {
      setLoading(true)
      const res = await apiClient.get('/printers', { params: { restaurantId } })
      setPrinters(res.data)
    } catch (e: any) {
      toast.error('Failed to load printers')
    } finally {
      setLoading(false)
    }
  }, [restaurantId])

  useEffect(() => {
    loadPrinters()
  }, [loadPrinters])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { ...formData, restaurantId, port: Number(formData.port) }
      if (editingPrinter) {
        await apiClient.patch(`/printers/${editingPrinter.id}`, payload)
        toast.success('Printer updated')
      } else {
        await apiClient.post('/printers', payload)
        toast.success('Printer added')
      }
      setShowModal(false)
      loadPrinters()
    } catch (e: any) {
      toast.error('Failed to save printer')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this printer?')) return
    try {
      await apiClient.delete(`/printers/${id}`)
      toast.success('Printer deleted')
      loadPrinters()
    } catch (e) {
      toast.error('Failed to delete printer')
    }
  }

  const handleTestPrint = async (id: string) => {
    try {
      toast.loading('Sending test print...', { id: 'test-print' })
      await apiClient.post(`/printers/${id}/test`)
      toast.success('Test print sent!', { id: 'test-print' })
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Test print failed', { id: 'test-print' })
    }
  }

  const openModal = (printer?: any) => {
    if (printer) {
      setEditingPrinter(printer)
      setFormData({
        name: printer.name,
        type: printer.type,
        connectionType: printer.connectionType,
        ipAddress: printer.ipAddress || '',
        port: printer.port || 9100,
        isEnabled: printer.isEnabled
      })
    } else {
      setEditingPrinter(null)
      setFormData({
        name: '',
        type: 'KITCHEN',
        connectionType: 'LAN',
        ipAddress: '',
        port: 9100,
        isEnabled: true
      })
    }
    setShowModal(true)
  }

  return (
    <div>
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Printers</h2>
        <p className="text-sm text-zinc-500">Configure receipt and KOT printers for your network.</p>
      </div>

      <div className="flex justify-end mb-4">
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Printer
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-zinc-500">Loading printers...</div>
      ) : printers.length === 0 ? (
        <div className="py-10 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
          No printers configured. Add a printer to start printing KOTs.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {printers.map(p => (
            <div key={p.id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-accent/50 transition-colors bg-white dark:bg-zinc-900 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {p.name}
                    {p.isEnabled ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                  </h3>
                  <p className="text-sm text-zinc-500 uppercase tracking-wider font-semibold mt-1">{p.type} • {p.connectionType}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openModal(p)} className="p-2 text-zinc-400 hover:text-accent transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                {p.connectionType === 'LAN' && (
                  <div className="text-sm flex justify-between bg-zinc-50 dark:bg-zinc-950 px-3 py-2 rounded-md border border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500">IP Address</span>
                    <span className="font-mono">{p.ipAddress}:{p.port}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleTestPrint(p.id)}
                disabled={!p.isEnabled}
                className="w-full flex items-center justify-center gap-2 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={14} />
                Test Print
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold">{editingPrinter ? 'Edit Printer' : 'Add Printer'}</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-500">Printer Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent" placeholder="e.g. Kitchen Printer 1" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-500">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent text-zinc-900 dark:text-white">
                    <option value="KITCHEN">Kitchen</option>
                    <option value="BILL">Bill</option>
                    <option value="BAR">Bar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-500">Connection</label>
                  <select value={formData.connectionType} onChange={e => setFormData({...formData, connectionType: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent text-zinc-900 dark:text-white">
                    <option value="LAN">LAN (TCP/IP)</option>
                    <option value="USB">USB (Local)</option>
                  </select>
                </div>
              </div>

              {formData.connectionType === 'LAN' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-zinc-500">IP Address</label>
                    <input required type="text" value={formData.ipAddress} onChange={e => setFormData({...formData, ipAddress: e.target.value})} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent font-mono" placeholder="192.168.1.100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-500">Port</label>
                    <input required type="number" value={formData.port} onChange={e => setFormData({...formData, port: Number(e.target.value)})} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent font-mono" placeholder="9100" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isEnabled" checked={formData.isEnabled} onChange={e => setFormData({...formData, isEnabled: e.target.checked})} className="w-4 h-4 accent-accent" />
                <label htmlFor="isEnabled" className="text-sm font-medium cursor-pointer text-zinc-900 dark:text-white">Printer is active and enabled</label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity">Save Printer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
