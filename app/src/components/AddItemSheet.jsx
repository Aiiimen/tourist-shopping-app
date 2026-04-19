import { useState, useRef, useEffect } from 'react'

export default function AddItemSheet({ onAdd, onClose }) {
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [budget, setBudget] = useState('')
  const [forWhom, setForWhom] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || submitting) return
    setSubmitting(true)
    try {
      await onAdd({ name, notes, budget, for_whom: forWhom })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="sheet-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add item"
    >
      <div className="sheet-modal" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 className="sheet-title">Add Item</h2>

        <form onSubmit={handleSubmit} className="sheet-form">
          <div className="form-field">
            <label className="form-label" htmlFor="item-name">
              ITEM NAME *
            </label>
            <input
              ref={nameRef}
              id="item-name"
              className="form-input"
              type="text"
              placeholder="e.g. Sony WH-1000XM5"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="item-notes">
              DESCRIPTION <span className="form-optional">(optional)</span>
            </label>
            <textarea
              id="item-notes"
              className="form-input form-textarea"
              placeholder="Any notes on colour/model…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-field form-field-grow">
              <label className="form-label" htmlFor="item-budget">
                BUDGET <span className="form-optional">(optional)</span>
              </label>
              <div className="form-input-group">
                <span className="input-prefix">¥</span>
                <input
                  id="item-budget"
                  className="form-input form-input-inline"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">&nbsp;</label>
              <div className="currency-badge">JPY</div>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="item-for-whom">
              FOR WHOM? <span className="form-optional">(optional)</span>
            </label>
            <input
              id="item-for-whom"
              className="form-input"
              type="text"
              placeholder="e.g. Me, Mom, Everyone"
              value={forWhom}
              onChange={e => setForWhom(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={!name.trim() || submitting}
          >
            {submitting ? 'Adding…' : '+ Add to List'}
          </button>
        </form>
      </div>
    </div>
  )
}
