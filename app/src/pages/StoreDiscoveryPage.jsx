import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrCreateList, getItems, updateItem } from '../lib/listService'
import { getCachedMatches, discoverStores } from '../lib/storeService'

const CATEGORY_COLORS = {
  electronics:      '#1B5FE8',
  food_snacks:      '#F5A623',
  clothing:         '#8B5CF6',
  souvenirs:        '#EC4899',
  beauty_health:    '#00B896',
  books_stationery: '#0EA5E9',
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

function SkeletonCard() {
  return (
    <div className="store-card store-card--skeleton" aria-hidden="true">
      <div className="skeleton-line skeleton-line--long" />
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-line skeleton-line--medium" />
    </div>
  )
}

function StoreCard({ store, onMapClick }) {
  return (
    <div className="store-card">
      <div className="store-card-header">
        <span className="store-name">{store.store_name}</span>
        <button
          className="store-map-link"
          onClick={() => onMapClick(store)}
          aria-label={`View ${store.store_name} on map`}
        >
          Map →
        </button>
      </div>
      {store.area && (
        <p className="store-area small">{store.area}</p>
      )}
      {store.address && (
        <p className="store-address caption">{store.address}</p>
      )}
      {store.reasoning && (
        <p className="store-reasoning caption">{store.reasoning}</p>
      )}
    </div>
  )
}

function NotFoundCard() {
  return (
    <div className="store-card store-card--not-found">
      <p className="store-not-found-icon">😕</p>
      <p className="store-not-found-text small">No stores found nearby</p>
      <p className="caption">This item may need a specialist shop.</p>
    </div>
  )
}

export default function StoreDiscoveryPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [matchesMap, setMatchesMap] = useState({})
  const [loadingItems, setLoadingItems] = useState(true)
  const [discoveringIds, setDiscoveringIds] = useState(new Set())
  const [filter, setFilter] = useState('all') // all | not_found | bought
  const [error, setError] = useState(null)

  // Load list + items + cached matches
  useEffect(() => {
    async function load() {
      try {
        const list = await getOrCreateList()
        const its = await getItems(list.id)
        setItems(its)
        if (its.length > 0) {
          const cached = await getCachedMatches(its.map(i => i.id))
          setMatchesMap(cached)
          // Kick off discovery for items without cache
          const uncached = its.filter(i => !cached[i.id])
          if (uncached.length > 0) {
            runDiscovery(uncached)
          }
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingItems(false)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const runDiscovery = useCallback(async (uncachedItems) => {
    setDiscoveringIds(prev => {
      const next = new Set(prev)
      uncachedItems.forEach(i => next.add(i.id))
      return next
    })
    try {
      const newMap = await discoverStores(uncachedItems)
      setMatchesMap(prev => ({ ...prev, ...newMap }))
    } catch (err) {
      console.error('Store discovery failed:', err.message)
    } finally {
      setDiscoveringIds(prev => {
        const next = new Set(prev)
        uncachedItems.forEach(i => next.delete(i.id))
        return next
      })
    }
  }, [])

  const handleMarkBought = useCallback(async (item) => {
    try {
      const updated = await updateItem(item.id, {
        is_purchased: !item.is_purchased,
        purchased_at: !item.is_purchased ? new Date().toISOString() : null,
      })
      setItems(prev => prev.map(i => i.id === item.id ? updated : i))
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }, [])

  const handleMapClick = useCallback((store) => {
    navigate('/map', { state: { focusStore: store } })
  }, [navigate])

  const foundCount = items.filter(i => matchesMap[i.id]?.length > 0).length
  const boughtCount = items.filter(i => i.is_purchased).length
  const notFoundCount = items.filter(
    i => !discoveringIds.has(i.id) && matchesMap[i.id] !== undefined && matchesMap[i.id].length === 0
  ).length

  const filteredItems = items.filter(item => {
    if (filter === 'bought') return item.is_purchased
    if (filter === 'not_found') {
      return !discoveringIds.has(item.id) && matchesMap[item.id] !== undefined && matchesMap[item.id].length === 0
    }
    return true
  })

  if (loadingItems) {
    return (
      <main className="discovery-page">
        <header className="page-header">
          <Link to="/" className="btn-icon back-btn" aria-label="Back to list">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </Link>
          <h1>Finding Stores…</h1>
          <span className="discovery-count caption">Loading…</span>
        </header>
        <div className="discovery-scroll">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="discovery-page">
        <header className="page-header">
          <Link to="/" className="btn-icon back-btn">←</Link>
          <h1>Stores Found</h1>
          <span />
        </header>
        <div className="discovery-scroll">
          <p className="small" style={{ color: 'var(--color-error)', padding: 'var(--space-base)' }}>
            Failed to load: {error}
          </p>
        </div>
      </main>
    )
  }

  const isDiscovering = discoveringIds.size > 0

  return (
    <main className="discovery-page">
      <header className="page-header">
        <Link to="/" className="btn-icon back-btn" aria-label="Back to list">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </Link>
        <h1>{isDiscovering ? 'Finding Stores…' : 'Stores Found'}</h1>
        <span className="discovery-count caption">
          {foundCount} of {items.length} found {!isDiscovering && '✓'}
        </span>
      </header>

      {/* Filter chips */}
      <div className="filter-chips">
        <button
          className={`chip${filter === 'all' ? ' chip--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`chip${filter === 'not_found' ? ' chip--active' : ''}`}
          onClick={() => setFilter('not_found')}
        >
          Not found{notFoundCount > 0 ? ` (${notFoundCount})` : ''}
        </button>
        <button
          className={`chip${filter === 'bought' ? ' chip--active' : ''}`}
          onClick={() => setFilter('bought')}
        >
          Bought ✓{boughtCount > 0 ? ` (${boughtCount})` : ''}
        </button>
      </div>

      <div className="discovery-scroll">
        {filteredItems.length === 0 ? (
          <div className="discovery-empty">
            <p className="small">No items match this filter.</p>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const color = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other
            const label = CATEGORY_LABELS[item.category] ?? 'Other'
            const stores = matchesMap[item.id] ?? []
            const isSearching = discoveringIds.has(item.id)
            const hasCacheResult = matchesMap[item.id] !== undefined

            return (
              <div key={item.id} className={`item-group${item.is_purchased ? ' item-group--bought' : ''}`}>
                {idx > 0 && <div className="item-group-divider" />}

                <div className="item-group-header">
                  <span className="category-dot" style={{ background: color }} aria-hidden="true" />
                  <div className="item-group-info">
                    <span className="item-group-name">{item.name.toUpperCase()}</span>
                    <span className="item-group-meta small">
                      {label}{item.budget ? ` · ¥${Number(item.budget).toLocaleString()}` : ''}
                    </span>
                  </div>
                  {item.is_purchased ? (
                    <button
                      className="mark-bought-btn mark-bought-btn--done"
                      onClick={() => handleMarkBought(item)}
                    >
                      Bought ✓
                    </button>
                  ) : (
                    hasCacheResult && stores.length > 0 && (
                      <button
                        className="mark-bought-btn"
                        onClick={() => handleMarkBought(item)}
                      >
                        Mark bought ✓
                      </button>
                    )
                  )}
                </div>

                <div className="store-cards">
                  {isSearching ? (
                    <>
                      <SkeletonCard />
                      <SkeletonCard />
                    </>
                  ) : stores.length > 0 ? (
                    stores.map(store => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        onMapClick={handleMapClick}
                      />
                    ))
                  ) : hasCacheResult ? (
                    <NotFoundCard />
                  ) : null}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="discovery-cta">
        <Link to="/map" className="btn-primary btn-full">
          🗺 See All on Map
        </Link>
      </div>
    </main>
  )
}
