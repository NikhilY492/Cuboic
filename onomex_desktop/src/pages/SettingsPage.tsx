import { useState, useMemo } from 'react'
import { 
  Store, 
  MapPin, 
  Printer as PrinterIcon, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Bell, 
  Palette, 
  Link as LinkIcon, 
  Activity, 
  Database, 
  Shield 
} from 'lucide-react'

// Tabs
import RestaurantSettingsTab from './settings/RestaurantSettingsTab'
import PrinterSettingsTab from './settings/PrinterSettingsTab'
import OutletSettingsTab from './settings/OutletSettingsTab'
import StaffPermissionsTab from './settings/StaffPermissionsTab'
import OrderSettingsTab from './settings/OrderSettingsTab'
import PaymentSettingsTab from './settings/PaymentSettingsTab'
import ThemeAppearanceTab from './settings/ThemeAppearanceTab'
import BackupDataTab from './settings/BackupDataTab'

// Placeholders for remaining tabs (we will replace these with actual imports soon)
const NotificationSettingsTab = () => <div className="p-10 text-center text-zinc-500">Notifications coming soon.</div>
const IntegrationsTab = () => <div className="p-10 text-center text-zinc-500">Integrations coming soon.</div>
const AuditLogsTab = () => <div className="p-10 text-center text-zinc-500">Audit Logs coming soon.</div>
const SecurityTab = () => <div className="p-10 text-center text-zinc-500">Security coming soon.</div>

const TABS = [
  { id: 'restaurant', label: 'Restaurant', icon: Store, component: RestaurantSettingsTab },
  { id: 'outlets', label: 'Outlets', icon: MapPin, component: OutletSettingsTab },
  { id: 'printers', label: 'Printers', icon: PrinterIcon, component: PrinterSettingsTab },
  { id: 'staff', label: 'Staff & Roles', icon: Users, component: StaffPermissionsTab },
  { id: 'orders', label: 'Order Settings', icon: ShoppingCart, component: OrderSettingsTab },
  { id: 'payments', label: 'Payment Settings', icon: CreditCard, component: PaymentSettingsTab },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationSettingsTab },
  { id: 'theme', label: 'Theme & Appearance', icon: Palette, component: ThemeAppearanceTab },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon, component: IntegrationsTab },
  { id: 'audit', label: 'Audit & Logs', icon: Activity, component: AuditLogsTab },
  { id: 'backup', label: 'Backup & Data', icon: Database, component: BackupDataTab },
  { id: 'security', label: 'Security', icon: Shield, component: SecurityTab },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  
  const ActiveComponent = useMemo(() => {
    return TABS.find(t => t.id === activeTab)?.component || RestaurantSettingsTab
  }, [activeTab])

  return (
    <div className="flex h-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage configuration</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-accent text-white shadow-md shadow-accent/20' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-zinc-400'} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="max-w-4xl mx-auto">
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}
