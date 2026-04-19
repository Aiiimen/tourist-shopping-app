import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getOrCreateList, getItems, updateItem } from '../lib/listService'
import { getCachedMatches } from '../lib/storeService'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// ─── Category config (from visual-identity.md §1.6) ───────────────────────
const CATEGORY_COLORS = {
  electronics:      '#1B5FE8',
  food_snacks:      '#FF6B2B',
  clothing:         '#A855F7',
  souvenirs:        '#EAB308',
  beauty_health:    '#EC4899',
  books_stationery: '#22C55E',
  other:            '#9EA4C1',
}

const CATEGORY_LABELS = {
  electronics:      'Electronics',
  food_snacks:      'Food & Snacks',
  clothing:         'Clothing',
  souvenirs:        'Souvenirs',
  beauty_health:    'Beauty & Health',
  books_stationery: 'Books & Stationery',
  other:            'Other',
}

const MULTI_COLOR = '#161C34'
const PURCHASED_COLOR = '#00B896'
const TOKYO_CENTER = [35.6762, 139.6503]

// ─── SVG pin factory ───────────────────────────────────────────────────────
function makePinSvg({ color, size = 'single', count = 1, purchased = false }) {
  const isMulti = size === 'multi'
  const w = isMulti ? 44 : 36
  const h = isMulti ? 56 : 48
  const fill = purchased ? PURCHASED_COLOR : isMulti ? MULTI_COLOR : color
  const opacity = purchased ? '0.6' : '1'
  const shadow = purchased ? '' : isMulti
    ? 'filter: drop-shadow(0 4px 10px rgba(0,0,0,0.22));'
    : 'filter: drop-shadow(0 2px 8px rgba(0,0,0,0.18));'

  const inner = purchased
    ? `<text x="${w / 2}" y="${h * 0.48}" text-anchor="middle" dominant-baseline="middle"
        font-size="14" font-family="Inter,sans-serif" fill="white">✓</text>`
    : isMulti
    ? `<text x="${w / 2}" y="${h * 0.45}" text-anchor="middle" dominant-baseline="middle"
        font-size="15" font-weight="800" font-family="Inter,sans-serif" fill="white">${count}</text>`
    : `<circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.22}" fill="rgba(255,255,255,0.2)"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
    style="${shadow} opacity:${opacity}">
    <path d="M${w / 2} ${h - 2} C${w / 2} ${h - 2} 2 ${h * 0.62} 2 ${h * 0.38}
      C2 ${h * 0.16} ${w * 0.2} 2 ${w / 2} 2
      C${w * 0.8} 2 ${w - 2} ${h * 0.16} ${w - 2} ${h * 0.38}
      C${w - 2} ${h * 0.62} ${w / 2} ${h - 2} ${w / 2} ${h - 2}Z"
      fill="${fill}"/>
    ${inner}
  </svg>`
}

function leafletIcon({ color, size, count, purchased }) {
  const w = size === 'multi' ? 44 : 36
  const h = size === 'multi' ? 56 : 48
  return L.divIcon({
    html: makePinSvg({ color, size, count, purchased }),
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
  })
}

// ─── Group store_matches by store ──────────────────────────────────────────
function groupByStore(items, matchesMap) {
  const stores = {}
  for (const item of items) {
    const matches = matchesMap[item.id] ?? []
    for (const m of matches) {
      const key = `${m.store_name}|${m.lat ?? ''}|${m.lng ?? ''}`
      if (!stores[key]) {
        stores[key] = {
          key,
          store_name: m.store_name,
          area: m.area,
          address: m.address,
          lat: m.lat,
          lng: m.lng,
          itemIds: [],
        }
      }
      if (!stores[key].itemIds.includes(item.id)) {
        stores[key].itemIds.push(item.id)
      }
    }
  }
  return Object.values(stores).filter(s => s.lat && s.lng)
}

// ─── Bottom sheet snap heights ─────────────────────────────────────────────
const SNAP = { collapsed: 120, half: '50vh', full: '90vh' }

export default function MapPage() {
  const location = useLocation()
  const mapRef = useRef(null)
  const leafletMap = useRef(null)
  const markersRef = useRef({})

  const [items, setItems] = useState([])
  const [matchesMap, setMatchesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [snap, setSnap] = useState('collapsed')
  const [selectedStore, setSelectedStore] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null) // null = all

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const list = await getOrCreateList()
        const its = await getItems(list.id)
        setItems(its)
        if (its.length > 0) {
          const cached = await getCachedMatches(its.map(i => i.id))
          setMatchesMap(cached)
        }
      } catch (err) {
        console.error('Map load failed:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Init Leaflet map
  useEffect(() => {
    if (loading || leafletMap.current) return
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      center: TOKYO_CENTER,
      zoom: 13,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    // Zoom controls — right side, per wireframe
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Tap on map dismisses store card
    map.on('click', () => {
      setSelectedStore(null)
      setSnap('collapsed')
    })

    leafletMap.current = map

    // If navigated from StoreDiscovery with a focusStore, centre on it
    if (location.state?.focusStore) {
      const s = location.state.focusStore
      if (s.lat && s.lng) map.setView([s.lat, s.lng], 15)
    }

    return () => {
      map.remove()
      leafletMap.current = null
    }
  }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync markers whenever items/matchesMap/activeFilter change
  useEffect(() => {
    const map = leafletMap.current
    if (!map || loading) return

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    const stores = groupByStore(items, matchesMap)

    for (const store of stores) {
      const storeItems = store.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean)
      const allBought = storeItems.length > 0 && storeItems.every(i => i.is_purchased)
      const isMulti = store.itemIds.length > 1

      // Filter: dim (not hide) stores not matching active filter
      const matchesFilter = activeFilter === null || store.itemIds.includes(activeFilter)

      // Determine pin color (first unpurchased item's category, or category of first item)
      const firstItem = storeItems.find(i => !i.is_purchased) ?? storeItems[0]
      const color = CATEGORY_COLORS[firstItem?.category] ?? CATEGORY_COLORS.other

      const icon = leafletIcon({
        color,
        size: isMulti ? 'multi' : 'single',
        count: store.itemIds.length,
        purchased: allBought,
      })

      const marker = L.marker([store.lat, store.lng], {
        icon,
        opacity: matchesFilter ? 1 : 0.3,
      }).addTo(map)

      marker.on('click', (e) => {
        e.originalEvent?.stopPropagation()
        setSelectedStore(store)
        setSnap('collapsed')
        map.panTo([store.lat, store.lng])
      })

      markersRef.current[store.key] = marker
    }

    // Fit bounds to all markers if no focus store
    const coordStores = stores.filter(s => !location.state?.focusStore)
    if (coordStores.length > 0 && !location.state?.focusStore) {
      try {
        const bounds = L.latLngBounds(coordStores.map(s => [s.lat, s.lng]))
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 })
      } catch (_) { /* ignore */ }
    }
  }, [items, matchesMap, activeFilter, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkBought = useCallback(async (item) => {
    const newVal = !item.is_purchased
    try {
      const updated = await updateItem(item.id, {
        is_purchased: newVal,
        purchased_at: newVal ? new Date().toISOString() : null,
      })
      setItems(prev => prev.map(i => i.id === item.id ? updated : i))
      if (selectedStore) {
        // Re-check if store is fully bought to close card
        const storeItems = selectedStore.itemIds
          .map(id => (id === item.id ? updated : items.find(i => i.id === id)))
          .filter(Boolean)
        if (storeItems.every(i => i.is_purchased)) {
          setSelectedStore(null)
          setSnap('collapsed')
        }
      }
    } catch (err) {
      console.error('Mark bought failed:', err)
    }
  }, [items, selectedStore])

  const handleMarkAllBought = useCallback(async () => {
    if (!selectedStore) return
    const storeItems = selectedStore.itemIds
      .map(id => items.find(i => i.id === id))
      .filter(i => i && !i.is_purchased)
    await Promise.all(storeItems.map(i => handleMarkBought(i)))
  }, [selectedStore, items, handleMarkBought])

  const handleDirections = useCallback(() => {
    if (!selectedStore) return
    const addr = encodeURIComponent(selectedStore.address ?? selectedStore.store_name)
    const url = `https://maps.google.com/maps?q=${addr}`
    window.open(url, '_blank', 'noopener')
  }, [selectedStore])

  const boughtCount = items.filter(i => i.is_purchased).length
  const totalCount = items.length
  const progressPct = totalCount > 0 ? Math.round((boughtCount / totalCount) * 100) : 0

  // Items with store data for filter chips
  const itemsWithStores = items.filter(i => (matchesMap[i.id] ?? []).length > 0)

  // Selected store's items for the store card
  const selectedStoreItems = selectedStore
    ? selectedStore.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean)
    : []

  const sheetHeight = snap === 'full' ? '90vh' : snap === 'half' ? '50vh' : '120px'

  // ─── Loading screen ────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="map-page">
        <div className="map-topbar">
          <Link to="/" className="btn-icon map-back" aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </Link>
          <span className="map-topbar-title">Tokyo Shopping Map</span>
          <span />
        </div>
        <div className="map-loading">
          <div className="skeleton-line" style={{ width: 160, height: 16 }} />
        </div>
      </main>
    )
  }

  return (
    <main className="map-page">
      {/* ─── Floating top bar ─────────────────────────────────────────── */}
      <div className="map-topbar">
        <Link to="/" className="btn-icon map-back" aria-label="Back to list">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </Link>
        <span className="map-topbar-title">Tokyo Shopping Map</span>
        <button
          className="btn-icon map-list-btn"
          onClick={() => setSnap(snap === 'full' ? 'collapsed' : 'full')}
          aria-label="Toggle list"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <span>List</span>
        </button>
      </div>

      {/* ─── Map container ────────────────────────────────────────────── */}
      <div ref={mapRef} className="map-container" />

      {/* ─── Bottom sheet ─────────────────────────────────────────────── */}
      <div
        className={`map-bottom-sheet map-bottom-sheet--${snap}`}
        style={{ height: sheetHeight }}
      >
        {/* Handle */}
        <button
          className="map-sheet-handle-area"
          aria-label="Toggle sheet"
          onClick={() => setSnap(snap === 'collapsed' ? 'half' : snap === 'half' ? 'full' : 'collapsed')}
        >
          <div className="map-sheet-handle" />
        </button>

        {/* Progress */}
        <div className="map-progress">
          <div className="map-progress-text">
            <span className="small">{boughtCount} of {totalCount} bought</span>
            <span className="small" style={{ color: 'var(--gray-500)' }}>{totalCount - boughtCount} left</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Filter chips */}
        <div className="filter-chips map-filter-chips">
          <button
            className={`chip${activeFilter === null ? ' chip--active' : ''}`}
            onClick={() => setActiveFilter(null)}
          >
            All
          </button>
          {itemsWithStores.slice(0, 5).map(item => (
            <button
              key={item.id}
              className={`chip${activeFilter === item.id ? ' chip--active' : ''}`}
              style={activeFilter === item.id ? {} : { borderLeft: `3px solid ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other}` }}
              onClick={() => setActiveFilter(activeFilter === item.id ? null : item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Store card — when pin is tapped */}
        {selectedStore && (
          <div className="map-store-card">
            <div className="map-store-card-header">
              <span
                className="category-dot"
                style={{
                  background: selectedStoreItems.length > 1
                    ? MULTI_COLOR
                    : CATEGORY_COLORS[selectedStoreItems[0]?.category] ?? CATEGORY_COLORS.other,
                  width: 10,
                  height: 10,
                }}
              />
              <div className="map-store-card-info">
                <span className="store-name">{selectedStore.store_name}</span>
                {selectedStore.area && <span className="caption">{selectedStore.area}</span>}
              </div>
              <button
                className="map-store-dismiss"
                aria-label="Dismiss"
                onClick={() => { setSelectedStore(null); setSnap('collapsed') }}
              >
                ✕
              </button>
            </div>

            <div className="map-store-items">
              <span className="section-label">CARRIES FROM YOUR LIST</span>
              <div className="map-store-chips">
                {selectedStoreItems.map(item => (
                  <span
                    key={item.id}
                    className="map-item-chip"
                    style={{ background: item.is_purchased ? 'var(--jade-500)' : (CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other) }}
                  >
                    {item.is_purchased ? '✓ ' : ''}{item.name}
                  </span>
                ))}
              </div>
            </div>

            {selectedStore.address && (
              <p className="caption map-store-address">{selectedStore.address}</p>
            )}

            <div className="map-store-actions">
              {selectedStoreItems.some(i => !i.is_purchased) && (
                selectedStoreItems.length === 1
                  ? (
                    <button className="btn-primary map-action-btn" onClick={() => handleMarkBought(selectedStoreItems[0])}>
                      ✓ Mark bought
                    </button>
                  ) : (
                    <button className="btn-primary map-action-btn" onClick={handleMarkAllBought}>
                      ✓ Mark all bought
                    </button>
                  )
              )}
              <button className="btn-secondary map-action-btn" onClick={handleDirections}>
                Directions ↗
              </button>
            </div>
          </div>
        )}

        {/* Full sheet — item list */}
        {snap === 'full' && (
          <div className="map-sheet-list">
            <div className="map-sheet-section">
              <span className="section-label">SHOPPING LIST</span>
            </div>

            {/* To find */}
            {items.filter(i => !i.is_purchased).length > 0 && (
              <>
                <div className="map-sheet-divider">
                  To find ({items.filter(i => !i.is_purchased).length})
                </div>
                {items.filter(i => !i.is_purchased).map(item => {
                  const stores = matchesMap[item.id] ?? []
                  const nearest = stores[0]
                  return (
                    <div key={item.id} className="map-list-item" onClick={() => {
                      if (nearest?.lat && nearest?.lng && leafletMap.current) {
                        leafletMap.current.setView([nearest.lat, nearest.lng], 15)
                        setSnap('collapsed')
                      }
                    }}>
                      <span
                        className="category-dot"
                        style={{ background: CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other }}
                      />
                      <div className="map-list-item-info">
                        <span className="item-name">{item.name}</span>
                        {nearest && (
                          <span className="caption">{nearest.store_name}{nearest.area ? ` · ${nearest.area}` : ''}</span>
                        )}
                      </div>
                      {nearest && <span className="caption map-pin-icon">→ Pin</span>}
                    </div>
                  )
                })}
              </>
            )}

            {/* Bought */}
            {items.filter(i => i.is_purchased).length > 0 && (
              <>
                <div className="map-sheet-divider">
                  Bought ({items.filter(i => i.is_purchased).length})
                </div>
                {items.filter(i => i.is_purchased).map(item => (
                  <div key={item.id} className="map-list-item map-list-item--bought">
                    <span
                      className="category-dot"
                      style={{ background: 'var(--jade-500)', width: 10, height: 10 }}
                    />
                    <div className="map-list-item-info">
                      <span className="item-name" style={{ textDecoration: 'line-through', color: 'var(--gray-500)' }}>
                        {item.name}
                      </span>
                    </div>
                    <span className="caption" style={{ color: 'var(--jade-500)' }}>✓</span>
                  </div>
                ))}
              </>
            )}

            {items.length === 0 && (
              <p className="small" style={{ padding: 'var(--space-base)', color: 'var(--gray-500)' }}>
                Add items to your list to see them here.
              </p>
            )}

            <Link to="/" className="map-add-cta small">
              + Add another item
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
