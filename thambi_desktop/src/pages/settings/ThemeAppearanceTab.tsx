import { useState, useEffect } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Save, Loader2, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeAppearanceTab() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const restaurantId = user?.restaurantId ?? ''

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>({
    accentColor: '#3b82f6',
    borderRadius: 'medium',
  })

  useEffect(() => {
    if (!restaurantId) return
    apiClient.get(`/settings/restaurant/${restaurantId}`)
      .then(res => {
        if (res.data.settings?.themeSettings) {
          setSettings({ ...settings, ...res.data.settings.themeSettings })
        }
      })
      .catch(() => toast.error('Failed to load theme settings'))
      .finally(() => setLoading(false))
  }, [restaurantId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.patch(`/settings/restaurant/${restaurantId}`, {
        config: { themeSettings: settings }
      })
      toast.success('Theme settings saved')
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
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Theme & Appearance</h2>
        <p className="text-sm text-zinc-500">Customize the look and feel of your POS system.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Color Mode</h3>
          <div className="grid grid-cols-3 gap-4">
            <button 
              type="button" 
              onClick={() => setTheme('light')} 
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-accent bg-accent/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50'}`}
            >
              <Sun size={24} className={theme === 'light' ? 'text-accent' : 'text-zinc-500'} />
              <span className="mt-2 font-medium">Light</span>
            </button>
            <button 
              type="button" 
              onClick={() => setTheme('dark')} 
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-accent bg-accent/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50'}`}
            >
              <Moon size={24} className={theme === 'dark' ? 'text-accent' : 'text-zinc-500'} />
              <span className="mt-2 font-medium">Dark</span>
            </button>
            <button 
              type="button" 
              onClick={() => setTheme('system')} 
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-accent bg-accent/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50'}`}
            >
              <Monitor size={24} className={theme === 'system' ? 'text-accent' : 'text-zinc-500'} />
              <span className="mt-2 font-medium">System</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Brand Color</h3>
          <div className="flex gap-4 items-center">
            <input 
              type="color" 
              value={settings.accentColor} 
              onChange={e => setSettings({...settings, accentColor: e.target.value})} 
              className="w-12 h-12 rounded cursor-pointer border-0 p-0" 
            />
            <input 
              type="text" 
              value={settings.accentColor} 
              onChange={e => setSettings({...settings, accentColor: e.target.value})} 
              className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white font-mono uppercase" 
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">Choose the primary brand color for UI elements like buttons.</p>
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
