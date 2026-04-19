import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrCreateList, getItems, addItem, updateItem, deleteItem } from '../lib/listService'
import AddItemSheet from '../components/AddItemSheet'

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

export default function ListPage() {
  const navigate = useNavigate()
  const [list, setList] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSheet, setShowSheet] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const l = await getOrCreateList()
        setList(l)
        const its = await getItems(l.id)
        setItems(its)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleAddItem = useCallback(async (formData) => {
    try {
      const item = await addItem(list.id, formData)
      setItems(prev => [...prev, item])
      setShowSheet(false)
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }, [list])

  const handleTogglePurchased = useCallback(async (item) => {
    try {
      const updated = await updateItem(item.id, {
        is_purchased: !item.is_purchased,
        purchased_at: !item.is_purchased ? new Date().toISOString() : null,
      })
      setItems(prev => prev.map(i => i.id === item.id ? updated : i))
      setExpandedId(null)
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }, [])

  const handleDelete = useCallback(async (itemId) => {
    try {
      await deleteItem(itemId)
      setItems(prev => prev.filter(i => i.id !== itemId))
      setExpandedId(null)
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }, [])

  const hasItems = items.length > 0
  const boughtCount = items.filter(i => i.is_purchased).length

  if (loading) {
    return (
      <main className="list-page">
        <div className="list-loading">
          <span>Loading your list…</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="list-page">
        <div className="list-loading">
          <span style={{ color: 'var(--color-error)' }}>Failed to load: {error}</span>
        </div>
      </main>
    )
  }

  return (
    <main className="list-page">
      <header className="page-header">
        <h1>My Shopping List</h1>
        {hasItems && (
          <Link to="/map" className="btn-icon" aria-label="View on map">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              <line x1="9" y1="3" x2="9" y2="18"/>
              <line x1="15" y1="6" x2="15" y2="21"/>
            </svg>
            <span>Map</span>
          </Link>
        )}
      </header>

      {hasItems && (
        <div className="progress-section">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${(boughtCount / items.length) * 100}%` }}
            />
          </div>
          <p className="caption">{boughtCount} of {items.length} items bought</p>
        </div>
      )}

      <div className={`list-scroll${hasItems ? ' list-scroll--has-cta' : ''}`}>
        {!hasItems ? (
          <div className="list-empty">
            <span className="list-empty-icon">🛍</span>
            <h2>Your list is empty</h2>
            <p className="small">Add items to find stores<br />near you in Tokyo</p>
          </div>
        ) : (
          <>
            <p className="section-label">YOUR LIST</p>
            <ul className="item-list">
              {items.map(item => {
                const isExpanded = expandedId === item.id
                const color = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other
                const label = CATEGORY_LABELS[item.category] ?? 'Other'

                return (
                  <li
                    key={item.id}
                    className={`item-card${item.is_purchased ? ' purchased' : ''}${isExpanded ? ' expanded' : ''}`}
                  >
                    <button
                      className="item-card-main"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      aria-expanded={isExpanded}
                    >
                      <span
                        className="category-dot"
                        style={{ background: color }}
                        aria-hidden="true"
                      />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-meta small">
                          {label}
                          {item.budget ? ` · ¥${Number(item.budget).toLocaleString()}` : ''}
                          {item.for_whom ? ` · For: ${item.for_whom}` : ''}
                        </span>
                      </div>
                      <span className={`item-badge${item.is_purchased ? ' badge-bought' : ' badge-searching'}`}>
                        {item.is_purchased ? '✓ Bought' : 'Searching…'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="item-actions">
                        <button
                          className="item-action-btn action-bought"
                          onClick={() => handleTogglePurchased(item)}
                        >
                          {item.is_purchased ? 'Unmark' : '✓ Mark Bought'}
                        </button>
                        <button
                          className="item-action-btn action-discover"
                          onClick={() => navigate('/stores')}
                        >
                          🔍 Find Stores
                        </button>
                        <button
                          className="item-action-btn action-delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>

      {hasItems && (
        <div className="view-map-cta">
          <Link to="/stores" className="btn-primary btn-full">
            🔍 Find Stores
          </Link>
        </div>
      )}

      <button
        className={`fab${hasItems ? ' fab-raised' : ''}`}
        aria-label="Add item"
        onClick={() => setShowSheet(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {showSheet && (
        <AddItemSheet
          onAdd={handleAddItem}
          onClose={() => setShowSheet(false)}
        />
      )}
    </main>
  )
}
