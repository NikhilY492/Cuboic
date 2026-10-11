import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Printer as PrinterIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Settings2, 
  RefreshCw,
  FileText,
  UtensilsCrossed
} from 'lucide-react'
import toast from 'react-hot-toast'
import { printTestReceipt } from '../../utils/printReceipt'
import { printKOT, type Order } from '../../utils/printKOT'

export default function PrinterSettingsTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  // Local Desktop Printers state
  const [localPrinters, setLocalPrinters] = useState<{ name: string; isDefault: boolean }[]>([])
  const [selectedReceiptPrinter, setSelectedReceiptPrinter] = useState<string>('')
  const [selectedKotPrinter, setSelectedKotPrinter] = useState<string>('')
  const [autoPrintEnabled, setAutoPrintEnabled] = useState<boolean>(true)
  const [autoPrintMode, setAutoPrintMode] = useState<string>('receipt') // 'receipt' | 'kot' | 'both'
  const [paperWidth, setPaperWidth] = useState<'80mm' | '58mm'>('80mm')
  const [testingReceipt, setTestingReceipt] = useState(false)
  const [testingKot, setTestingKot] = useState(false)

  // Network / LAN Printers state
  const [networkPrinters, setNetworkPrinters] = useState<any[]>([])
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

  // Load local desktop printers via Electron
  const loadLocalPrinters = useCallback(async () => {
    if (window.ipcRenderer) {
      try {
        const printersList = await window.ipcRenderer.invoke('print:get-printers')
        setLocalPrinters(printersList)

        // Read saved preferences
        const savedReceipt = localStorage.getItem('onomex_receipt_printer')
        const savedKot = localStorage.getItem('onomex_kot_printer')
        const savedAuto = localStorage.getItem('onomex_auto_print_enabled')
        const savedMode = localStorage.getItem('onomex_auto_print_mode')
        const savedWidth = localStorage.getItem('onomex_paper_width') as '80mm' | '58mm'

        if (savedAuto !== null) setAutoPrintEnabled(savedAuto === 'true')
        if (savedMode) setAutoPrintMode(savedMode)
        if (savedWidth) setPaperWidth(savedWidth)

        // Find detected POS / Thermal printer
        const posPrinter = printersList.find((p: any) => /pos|kpc|caysn|thermal|receipt/i.test(p.name))
        const defaultPrinter = printersList.find((p: any) => p.isDefault)

        // Set Receipt printer
        if (savedReceipt && printersList.some((p: any) => p.name === savedReceipt)) {
          setSelectedReceiptPrinter(savedReceipt)
        } else if (posPrinter) {
          setSelectedReceiptPrinter(posPrinter.name)
          localStorage.setItem('onomex_receipt_printer', posPrinter.name)
        } else if (defaultPrinter) {
          setSelectedReceiptPrinter(defaultPrinter.name)
        } else if (printersList.length > 0) {
          setSelectedReceiptPrinter(printersList[0].name)
        }

        // Set KOT printer
        if (savedKot && printersList.some((p: any) => p.name === savedKot)) {
          setSelectedKotPrinter(savedKot)
        } else if (posPrinter) {
          setSelectedKotPrinter(posPrinter.name)
          localStorage.setItem('onomex_kot_printer', posPrinter.name)
        } else if (defaultPrinter) {
          setSelectedKotPrinter(defaultPrinter.name)
        } else if (printersList.length > 0) {
          setSelectedKotPrinter(printersList[0].name)
        }
      } catch (err) {
        console.error('Failed to load local printers:', err)
      }
    }
  }, [])

  // Load backend LAN printers
  const loadNetworkPrinters = useCallback(async () => {
    if (!restaurantId) return
    try {
      setLoading(true)
      const res = await apiClient.get('/printers', { params: { restaurantId } })
      setNetworkPrinters(res.data)
    } catch {
      toast.error('Failed to load network printers')
    } finally {
      setLoading(false)
    }
  }, [restaurantId])

  useEffect(() => {
    loadLocalPrinters()
    loadNetworkPrinters()
  }, [loadLocalPrinters, loadNetworkPrinters])

  // Save Local Desktop Preferences
  const handleReceiptPrinterChange = (name: string) => {
    setSelectedReceiptPrinter(name)
    localStorage.setItem('onomex_receipt_printer', name)
    toast.success(`Receipt printer set to ${name}`)
  }

  const handleKotPrinterChange = (name: string) => {
    setSelectedKotPrinter(name)
    localStorage.setItem('onomex_kot_printer', name)
    toast.success(`KOT printer set to ${name}`)
  }

  const handleAutoPrintToggle = (enabled: boolean) => {
    setAutoPrintEnabled(enabled)
    localStorage.setItem('onomex_auto_print_enabled', enabled ? 'true' : 'false')
    localStorage.setItem('onomex_auto_print_kot', enabled ? 'true' : 'false')
    toast.success(enabled ? 'Auto-print on new order enabled' : 'Auto-print disabled')
  }

  const handleModeChange = (mode: string) => {
    setAutoPrintMode(mode)
    localStorage.setItem('onomex_auto_print_mode', mode)
    toast.success(`Auto-print set to: ${mode === 'both' ? 'Receipt + KOT' : mode.toUpperCase()}`)
  }

  const handleWidthChange = (width: '80mm' | '58mm') => {
    setPaperWidth(width)
    localStorage.setItem('onomex_paper_width', width)
    toast.success(`Paper width set to ${width}`)
  }

  // Local Test Prints
  const handleTestLocalReceipt = async () => {
    if (!selectedReceiptPrinter) {
      toast.error('Please select a receipt printer first.')
      return
    }
    try {
      setTestingReceipt(true)
      toast.loading('Sending test receipt to printer...', { id: 'test-local-receipt' })
      await printTestReceipt(selectedReceiptPrinter, paperWidth)
      toast.success('Test receipt printed successfully!', { id: 'test-local-receipt' })
    } catch (e: any) {
      toast.error(e.message || 'Failed to print test receipt', { id: 'test-local-receipt' })
    } finally {
      setTestingReceipt(false)
    }
  }

  const handleTestLocalKot = async () => {
    if (!selectedKotPrinter) {
      toast.error('Please select a KOT printer first.')
      return
    }
    try {
      setTestingKot(true)
      toast.loading('Sending test KOT to printer...', { id: 'test-local-kot' })
      const sampleOrder: Order = {
        id: 'kot' + Math.floor(100000 + Math.random() * 900000),
        orderType: 'DineIn',
        table: { id: 't1', table_number: '1' },
        items: [
          { name: 'Special Chicken Biryani', quantity: 2, unitPrice: 280 },
          { name: 'Butter Naan', quantity: 4, unitPrice: 45 }
        ],
        subtotal: 740,
        tax: 0,
        total: 740,
        status: 'Preparing',
        notes: 'Less spicy',
        createdAt: new Date().toISOString()
      }
      await printKOT(sampleOrder, selectedKotPrinter, { paperWidth })
      toast.success('Test KOT printed successfully!', { id: 'test-local-kot' })
    } catch (e: any) {
      toast.error(e.message || 'Failed to print test KOT', { id: 'test-local-kot' })
    } finally {
      setTestingKot(false)
    }
  }

  // Network printer modal handlers
  const handleSaveNetwork = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = { ...formData, restaurantId, port: Number(formData.port) }
      if (editingPrinter) {
        await apiClient.patch(`/printers/${editingPrinter.id}`, payload)
        toast.success('Network printer updated')
      } else {
        await apiClient.post('/printers', payload)
        toast.success('Network printer added')
      }
      setShowModal(false)
      loadNetworkPrinters()
    } catch {
      toast.error('Failed to save network printer')
    }
  }

  const handleDeleteNetwork = async (id: string) => {
    if (!confirm('Are you sure you want to delete this network printer?')) return
    try {
      await apiClient.delete(`/printers/${id}`)
      toast.success('Network printer deleted')
      loadNetworkPrinters()
    } catch {
      toast.error('Failed to delete network printer')
    }
  }

  const handleTestNetworkPrint = async (id: string) => {
    try {
      toast.loading('Sending test print over LAN...', { id: 'test-network-print' })
      await apiClient.post(`/printers/${id}/test`)
      toast.success('LAN test print sent!', { id: 'test-network-print' })
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'LAN test print failed', { id: 'test-network-print' })
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
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
          <PrinterIcon className="text-accent" size={24} />
          Printer Settings & Auto-Printing
        </h2>
        <p className="text-sm text-zinc-500">
          Configure your USB / thermal receipt printer (e.g. Caysn KPC307-UEWB / POS80) and manage network printers.
        </p>
      </div>

      {/* ── Section 1: Local Thermal Printer (USB / POS80) ── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <Settings2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Counter Thermal Printer (USB / Local)</h3>
              <p className="text-xs text-zinc-500">Direct instant printing via Windows spooler to your ESC/POS thermal printer.</p>
            </div>
          </div>
          <button
            onClick={loadLocalPrinters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={14} /> Refresh Printers
          </button>
        </div>

        {localPrinters.length === 0 ? (
          <div className="py-8 text-center text-zinc-400">
            No local printers detected. Please ensure your thermal printer is turned on and connected via USB.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Auto-print banner */}
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  Auto-Print As Soon As Order Is Received
                </span>
                <p className="text-xs text-zinc-500 mt-0.5">
                  When a customer places an order or it arrives at the restaurant, automatically print to the selected printer without clicking.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPrintEnabled}
                    onChange={(e) => handleAutoPrintToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 min-w-[50px]">
                  {autoPrintEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
            </div>

            {/* Printer Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receipt Printer Selection */}
              <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                  <FileText size={14} className="text-accent" />
                  Customer Receipt (Bill) Printer
                </label>
                <select
                  value={selectedReceiptPrinter}
                  onChange={(e) => handleReceiptPrinterChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white font-medium outline-none focus:border-accent"
                >
                  {localPrinters.map((p) => {
                    const isDetectedPOS = /pos|kpc|caysn|thermal|receipt/i.test(p.name)
                    return (
                      <option key={p.name} value={p.name}>
                        {p.name} {isDetectedPOS ? '★ (POS Thermal)' : ''} {p.isDefault ? '(Default)' : ''}
                      </option>
                    )
                  })}
                </select>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[11px] text-zinc-400">Prints formatted itemized bill with tax & total</span>
                  <button
                    onClick={handleTestLocalReceipt}
                    disabled={testingReceipt || !selectedReceiptPrinter}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                  >
                    <Play size={12} /> {testingReceipt ? 'Printing...' : 'Test Print Receipt'}
                  </button>
                </div>
              </div>

              {/* KOT Printer Selection */}
              <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/50">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                  <UtensilsCrossed size={14} className="text-accent" />
                  Kitchen Ticket (KOT) Printer
                </label>
                <select
                  value={selectedKotPrinter}
                  onChange={(e) => handleKotPrinterChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white font-medium outline-none focus:border-accent"
                >
                  {localPrinters.map((p) => {
                    const isDetectedPOS = /pos|kpc|caysn|thermal|receipt/i.test(p.name)
                    return (
                      <option key={p.name} value={p.name}>
                        {p.name} {isDetectedPOS ? '★ (POS Thermal)' : ''} {p.isDefault ? '(Default)' : ''}
                      </option>
                    )
                  })}
                </select>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[11px] text-zinc-400">Prints kitchen cooking order ticket</span>
                  <button
                    onClick={handleTestLocalKot}
                    disabled={testingKot || !selectedKotPrinter}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 transition-all"
                  >
                    <Play size={12} /> {testingKot ? 'Printing...' : 'Test Print KOT'}
                  </button>
                </div>
              </div>
            </div>

            {/* Printing Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Auto-Print What On New Order?
                </label>
                <select
                  value={autoPrintMode}
                  onChange={(e) => handleModeChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white font-medium outline-none focus:border-accent"
                >
                  <option value="receipt">Customer Receipt (Bill)</option>
                  <option value="kot">Kitchen Ticket (KOT)</option>
                  <option value="both">Both (Receipt + Kitchen Ticket)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Thermal Paper Width
                </label>
                <select
                  value={paperWidth}
                  onChange={(e) => handleWidthChange(e.target.value as '80mm' | '58mm')}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-white font-medium outline-none focus:border-accent"
                >
                  <option value="80mm">80mm (Standard POS-80 / KPC307-UEWB)</option>
                  <option value="58mm">58mm (Small 2-inch roll)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 2: Network / LAN Printers ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <PrinterIcon size={20} className="text-zinc-400" />
              Network (LAN / Ethernet) Printers
            </h3>
            <p className="text-xs text-zinc-500">
              For printers connected directly to the restaurant router/Wi-Fi via IP address (Port 9100).
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity self-start sm:self-auto text-sm"
          >
            <Plus size={16} />
            Add LAN Printer
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-zinc-500">Loading network printers...</div>
        ) : networkPrinters.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-sm">
            No LAN printers configured. If your KPC307-UEWB is connected via USB, use the Counter Thermal Printer section above.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {networkPrinters.map((p) => (
              <div
                key={p.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-accent/50 transition-colors bg-white dark:bg-zinc-900 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-base flex items-center gap-2">
                      {p.name}
                      {p.isEnabled ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                    </h4>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">
                      {p.type} • {p.connectionType}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal(p)}
                      className="p-1.5 text-zinc-400 hover:text-accent transition-colors"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteNetwork(p.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {p.connectionType === 'LAN' && (
                    <div className="text-xs flex justify-between bg-zinc-50 dark:bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-500">IP Address</span>
                      <span className="font-mono font-bold">
                        {p.ipAddress}:{p.port}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleTestNetworkPrint(p.id)}
                  disabled={!p.isEnabled}
                  className="w-full flex items-center justify-center gap-2 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={13} />
                  Test Print Over LAN
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LAN Printer Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold">{editingPrinter ? 'Edit Network Printer' : 'Add Network Printer'}</h2>
            </div>
            <form onSubmit={handleSaveNetwork} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-500">Printer Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent"
                  placeholder="e.g. Kitchen Printer 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-500">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent text-zinc-900 dark:text-white"
                  >
                    <option value="KITCHEN">Kitchen</option>
                    <option value="BILL">Bill / Receipt</option>
                    <option value="BAR">Bar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-500">Connection</label>
                  <select
                    value={formData.connectionType}
                    onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent text-zinc-900 dark:text-white"
                  >
                    <option value="LAN">LAN (TCP/IP)</option>
                    <option value="USB">USB (Local)</option>
                  </select>
                </div>
              </div>

              {formData.connectionType === 'LAN' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-zinc-500">IP Address</label>
                    <input
                      required
                      type="text"
                      value={formData.ipAddress}
                      onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent font-mono"
                      placeholder="192.168.1.100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-zinc-500">Port</label>
                    <input
                      required
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:border-accent font-mono"
                      placeholder="9100"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isEnabled"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="w-4 h-4 accent-accent"
                />
                <label htmlFor="isEnabled" className="text-sm font-medium cursor-pointer text-zinc-900 dark:text-white">
                  Printer is active and enabled
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Save Printer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
