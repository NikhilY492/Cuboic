import { useState, useEffect } from 'react'
import { apiClient } from '../../api/apiClient'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { MapPin, Edit2, Save, Loader2, Navigation, Shield } from 'lucide-react'

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

  // Geofencing state (restaurant-level config)
  const [geoConfig, setGeoConfig] = useState({
    latitude: '' as string | number,
    longitude: '' as string | number,
    geofenceEnabled: false,
    geofenceRadius: 25,
  })
  const [geoLoading, setGeoLoading] = useState(true)
  const [geoSaving, setGeoSaving] = useState(false)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    loadOutlets()
    loadGeoConfig()
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

  const loadGeoConfig = async () => {
    if (!restaurantId) return
    try {
      setGeoLoading(true)
      const res = await apiClient.get(`/restaurants/${restaurantId}`)
      const r = res.data
      setGeoConfig({
        latitude: r.latitude ?? '',
        longitude: r.longitude ?? '',
        geofenceEnabled: r.geofenceEnabled ?? false,
        geofenceRadius: r.geofenceRadius ?? 25,
      })
    } catch {
      // Non-critical, silently ignore
    } finally {
      setGeoLoading(false)
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
    } catch {
      toast.error('Failed to update outlet')
    }
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoConfig(prev => ({
          ...prev,
          latitude: parseFloat(pos.coords.latitude.toFixed(7)),
          longitude: parseFloat(pos.coords.longitude.toFixed(7)),
        }))
        toast.success('Location detected!')
        setLocating(false)
      },
      () => {
        toast.error('Could not detect location. Please enter coordinates manually.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSaveGeo = async (e: React.FormEvent) => {
    e.preventDefault()
    const lat = parseFloat(String(geoConfig.latitude))
    const lng = parseFloat(String(geoConfig.longitude))

    if (geoConfig.geofenceEnabled) {
      if (isNaN(lat) || isNaN(lng)) {
        toast.error('Please enter valid GPS coordinates before enabling geofencing.')
        return
      }
      if (lat < -90 || lat > 90) { toast.error('Latitude must be between -90 and 90'); return }
      if (lng < -180 || lng > 180) { toast.error('Longitude must be between -180 and 180'); return }
    }

    try {
      setGeoSaving(true)
      await apiClient.patch(`/restaurants/${restaurantId}`, {
        latitude: isNaN(lat) ? null : lat,
        longitude: isNaN(lng) ? null : lng,
        geofenceEnabled: geoConfig.geofenceEnabled,
        geofenceRadius: geoConfig.geofenceRadius,
      })
      toast.success('Geofencing settings saved')
    } catch {
      toast.error('Failed to save geofencing settings')
    } finally {
      setGeoSaving(false)
    }
  }

  if (loading || geoLoading) return <div className="py-10 text-center text-zinc-500">Loading settings...</div>

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
    <div className="space-y-8">

      {/* ── Geofencing Section ─────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Shield size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Location Ordering</h2>
            <p className="text-sm text-zinc-500">Only allow customers to order when physically near the restaurant.</p>
          </div>
        </div>

        <form onSubmit={handleSaveGeo} className="space-y-6">
          {/* Enable toggle */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <div>
              <p className="font-semibold text-zinc-900 dark:text-white text-sm">Enable geofencing</p>
              <p className="text-xs text-zinc-500 mt-0.5">Customers must be within the set radius to check out</p>
            </div>
            <button
              type="button"
              onClick={() => setGeoConfig(prev => ({ ...prev, geofenceEnabled: !prev.geofenceEnabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${geoConfig.geofenceEnabled ? 'bg-accent' : 'bg-zinc-300 dark:bg-zinc-600'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${geoConfig.geofenceEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Radius slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-zinc-500">Geofence Radius</label>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">{geoConfig.geofenceRadius} m</span>
            </div>
            <input
              type="range"
              min={10} max={100} step={5}
              value={geoConfig.geofenceRadius}
              onChange={e => setGeoConfig(prev => ({ ...prev, geofenceRadius: Number(e.target.value) }))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>10 m</span>
              <span>100 m</span>
            </div>
          </div>

          {/* GPS coordinates */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-zinc-500">Restaurant GPS Coordinates</label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="flex items-center gap-1.5 text-xs font-medium text-accent hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {locating
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Navigation size={13} />}
                {locating ? 'Detecting...' : 'Use my location'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 9.9312"
                  value={geoConfig.latitude}
                  onChange={e => setGeoConfig(prev => ({ ...prev, latitude: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 76.2673"
                  value={geoConfig.longitude}
                  onChange={e => setGeoConfig(prev => ({ ...prev, longitude: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-accent text-zinc-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2">
              Tip: Get accurate coordinates from Google Maps — right-click your restaurant location and copy the coordinates.
            </p>
          </div>

          {geoConfig.geofenceEnabled && (!geoConfig.latitude || !geoConfig.longitude) && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300 text-xs">
              ⚠️ Geofencing is enabled but no GPS coordinates are set. Customers will not be blocked until coordinates are saved.
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="submit"
              disabled={geoSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {geoSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {geoSaving ? 'Saving...' : 'Save Geofencing Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Outlets Section ─────────────────────────────────── */}
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
    </div>
  )
}
