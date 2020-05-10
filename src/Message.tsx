import React from 'react'
export function Message({ time, isNewRecord = false, onClick }) {
  return (
    <div
      style={{
        color: '#fff',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid #fff',
        borderRadius: 4,
        padding: 16,
        zIndex: 2,
        width: '80%',
        textAlign: 'center',
      }}
    >
      {isNewRecord && (
        <div style={{ fontSize: 32 }}>
          <span role="img" aria-label="diamond">
            💎
          </span>{' '}
          New Record!
        </div>
      )}
      <div style={{ marginBottom: 24, fontSize: 26, background: '#000' }}>
        You last {time} seconds!
      </div>
      <div style={{ position: 'relative', fontSize: 26 }}>
        <button
          onClick={onClick}
          style={{
            fontSize: 24,
            borderRadius: 4,
            background: '#000',
            color: '#fff',
            padding: '8px 16px',
            border: '2px solid white',
          }}
        >
          Restart ↩
        </button>
      </div>
    </div>
  )
}
