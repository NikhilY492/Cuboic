import { useState, useEffect } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Users, Shield, Plus, Edit2, Trash2, CheckSquare, Square } from 'lucide-react'

const PERMISSIONS_MATRIX = [
  { group: 'Orders', perms: ['order.view', 'order.create', 'order.modify', 'order.cancel', 'order.discount'] },
  { group: 'Menu', perms: ['menu.view', 'menu.create', 'menu.modify', 'menu.delete'] },
  { group: 'Settings', perms: ['settings.view', 'settings.modify', 'settings.printers'] },
  { group: 'Staff', perms: ['staff.view', 'staff.manage', 'roles.manage'] },
  { group: 'Billing', perms: ['billing.view', 'billing.refund', 'billing.void'] }
]

export default function StaffPermissionsTab() {
  const { user } = useAuth()
  const restaurantId = user?.restaurantId ?? ''

  const [activeSubTab, setActiveSubTab] = useState<'staff' | 'roles'>('staff')
  const [staff, setStaff] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingRole, setEditingRole] = useState<any | null>(null)
  const [roleForm, setRoleForm] = useState({ name: '', permissions: [] as string[] })

  const [showStaffModal, setShowStaffModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState<any | null>(null)
  const [staffForm, setStaffForm] = useState({ role: 'Staff', customRoleId: '' })

  const loadData = async () => {
    if (!restaurantId) return
    try {
      setLoading(true)
      const [staffRes, rolesRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/users/roles')
      ])
      setStaff(staffRes.data)
      setRoles(rolesRes.data)
    } catch (e) {
      toast.error('Failed to load staff data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [restaurantId])

  // --- Role Handlers ---
  const handleRoleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingRole) {
        await apiClient.patch(`/users/roles/${editingRole.id}`, roleForm)
        toast.success('Role updated')
      } else {
        await apiClient.post('/users/roles', roleForm)
        toast.success('Role created')
      }
      setShowRoleModal(false)
      loadData()
    } catch (e) {
      toast.error('Failed to save role')
    }
  }

  const handleRoleDelete = async (id: string) => {
    if (!confirm('Delete this role?')) return
    try {
      await apiClient.delete(`/users/roles/${id}`)
      toast.success('Role deleted')
      loadData()
    } catch (e) {
      toast.error('Failed to delete role')
    }
  }

  const togglePermission = (perm: string) => {
    setRoleForm(prev => {
      const perms = prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
      return { ...prev, permissions: perms }
    })
  }

  // --- Staff Handlers ---
  const handleStaffSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.patch(`/users/${editingStaff.id}`, {
        role: staffForm.role,
        customRoleId: staffForm.customRoleId || null
      })
      toast.success('Staff permissions updated')
      setShowStaffModal(false)
      loadData()
    } catch (e) {
      toast.error('Failed to update staff')
    }
  }

  if (loading) return <div className="py-10 text-center text-zinc-500">Loading data...</div>

  return (
    <div>
      <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Staff & Permissions</h2>
          <p className="text-sm text-zinc-500">Manage who can do what in your restaurant.</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('staff')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'staff' ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            <Users size={16} /> Staff List
          </button>
          <button 
            onClick={() => setActiveSubTab('roles')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'roles' ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            <Shield size={16} /> Custom Roles
          </button>
        </div>
      </div>

      {activeSubTab === 'staff' && (
        <div className="space-y-4">
          {staff.map(user => (
            <div key={user.id} className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">{user.name}</h3>
                  <p className="text-xs text-zinc-500">@{user.user_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                  <div className="text-sm font-semibold text-accent">{user.customRole?.name || user.role}</div>
                  <div className="text-xs text-zinc-500">{user.customRole ? 'Custom Role' : 'System Role'}</div>
                </div>
                <button 
                  onClick={() => {
                    setEditingStaff(user)
                    setStaffForm({ role: user.role, customRoleId: user.customRoleId || '' })
                    setShowStaffModal(true)
                  }}
                  className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Manage Role
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'roles' && (
        <div>
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => {
                setEditingRole(null)
                setRoleForm({ name: '', permissions: [] })
                setShowRoleModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} /> Create Role
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map(role => (
              <div key={role.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">{role.name}</h3>
                    <p className="text-sm text-zinc-500">{role.permissions.length} permissions active</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditingRole(role); setRoleForm({ name: role.name, permissions: role.permissions || [] }); setShowRoleModal(true); }} className="p-2 text-zinc-400 hover:text-accent transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleRoleDelete(role.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.permissions.slice(0, 5).map((p: string) => (
                    <span key={p} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 rounded-md">
                      {p}
                    </span>
                  ))}
                  {role.permissions.length > 5 && (
                    <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 rounded-md">
                      +{role.permissions.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ))}
            {roles.length === 0 && (
              <div className="col-span-2 py-10 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
                No custom roles defined. You can create granular roles here.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingRole ? 'Edit Custom Role' : 'Create Custom Role'}</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-500">Role Name</label>
                <input required type="text" value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white" placeholder="e.g. Shift Manager" />
              </div>
              <div>
                <h3 className="font-bold mb-3 text-zinc-900 dark:text-white">Permission Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PERMISSIONS_MATRIX.map(group => (
                    <div key={group.group} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/50">
                      <h4 className="font-bold text-sm mb-3 text-zinc-900 dark:text-white">{group.group}</h4>
                      <div className="space-y-2">
                        {group.perms.map(perm => {
                          const hasPerm = roleForm.permissions.includes(perm)
                          return (
                            <button 
                              key={perm}
                              type="button"
                              onClick={() => togglePermission(perm)}
                              className="flex items-center gap-2 w-full text-left"
                            >
                              {hasPerm ? <CheckSquare size={16} className="text-accent" /> : <Square size={16} className="text-zinc-400" />}
                              <span className={`text-sm font-mono ${hasPerm ? 'text-zinc-900 dark:text-white font-medium' : 'text-zinc-500'}`}>{perm}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-950">
              <button type="button" onClick={() => setShowRoleModal(false)} className="px-6 py-2.5 font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
              <button type="button" onClick={handleRoleSave} className="px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:opacity-90 transition-opacity">Save Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Role Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold">Assign Role</h2>
              <p className="text-sm text-zinc-500 mt-1">For {editingStaff?.name}</p>
            </div>
            <form onSubmit={handleStaffSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-500">System Role</label>
                <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white">
                  {['Admin', 'Owner', 'Manager', 'Captain', 'Cashier', 'Waiter', 'Kitchen', 'Staff'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500 mt-1">Provides base system access</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-500">Custom Role (Overrides System Role)</label>
                <select value={staffForm.customRoleId} onChange={e => setStaffForm({...staffForm, customRoleId: e.target.value})} className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white">
                  <option value="">None (Use System Role)</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6">
                <button type="button" onClick={() => setShowStaffModal(false)} className="px-4 py-2 font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
