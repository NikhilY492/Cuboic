import { useState } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Download, FileText, Database } from 'lucide-react'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export default function BackupDataTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  const [exporting, setExporting] = useState(false)

  const exportData = async (type: 'staff' | 'outlets', format: 'excel' | 'pdf') => {
    try {
      setExporting(true)
      toast.loading(`Exporting ${type}...`, { id: 'export' })
      
      const endpoint = type === 'staff' ? '/users' : `/settings/restaurant/${restaurantId}/outlets`
      const res = await apiClient.get(endpoint)
      const data = res.data

      if (!data || data.length === 0) {
        toast.error('No data to export', { id: 'export' })
        return
      }

      if (format === 'excel') {
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, type)
        XLSX.writeFile(wb, `${type}-export.xlsx`)
      } else {
        const doc = new jsPDF()
        doc.text(`${type.toUpperCase()} Export`, 14, 15)
        
        const headers = Object.keys(data[0] || {}).filter(k => typeof data[0][k] !== 'object')
        const rows = data.map((item: any) => headers.map(h => String(item[h] || '')))
        
        // @ts-ignore
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 20
        })
        
        doc.save(`${type}-export.pdf`)
      }
      toast.success('Export complete', { id: 'export' })
    } catch (e) {
      toast.error('Failed to export data', { id: 'export' })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Backup & Data Export</h2>
        <p className="text-sm text-zinc-500">Download your restaurant data for backup and analysis.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">Staff & Roles</h3>
                <p className="text-xs text-zinc-500">Export employee list and permissions</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => exportData('staff', 'excel')}
                disabled={exporting}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                <Download size={14} /> Excel
              </button>
              <button 
                onClick={() => exportData('staff', 'pdf')}
                disabled={exporting}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                <FileText size={14} /> PDF
              </button>
            </div>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">Outlets</h3>
                <p className="text-xs text-zinc-500">Export branch locations and details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => exportData('outlets', 'excel')}
                disabled={exporting}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                <Download size={14} /> Excel
              </button>
              <button 
                onClick={() => exportData('outlets', 'pdf')}
                disabled={exporting}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                <FileText size={14} /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
