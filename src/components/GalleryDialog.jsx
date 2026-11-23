import React, { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

export default function GalleryDialog({ className, label, labelledBy, onClose, children }) {
  const dialogRef = useRef(null)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const initialFocus = dialog.querySelector('[data-dialog-close]') || dialog
    initialFocus.focus({ preventScroll: true })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(dialog.querySelectorAll(
        'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable.at(-1)
      const focused = document.activeElement

      if (!first) {
        event.preventDefault()
      } else if (!focusable.includes(focused)) {
        event.preventDefault()
        const next = event.shiftKey ? last : first
        next.focus()
      } else if (event.shiftKey && focused === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault()
        first.focus()
      }
    }

    // 布局切换可能卸载当前焦点，键盘仍然应能操作弹层。
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <div
      ref={dialogRef}
      className={className}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {children}
    </div>,
    document.body
  )
}

GalleryDialog.propTypes = {
  className: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelledBy: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
