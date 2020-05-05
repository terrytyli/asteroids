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
        background: '#000',
        border: '1px solid #fff',
        borderRadius: 4,
        padding: 16,
        zIndex: 1,
        width: '80%',
        textAlign: 'center',
      }}
    >
      {isNewRecord && (
        <div>
          <span role="img" aria-label="diamond">
            💎
          </span>{' '}
          New Record!
        </div>
      )}
      <div style={{ marginBottom: 24, fontSize: 32 }}>
        You last {time} seconds!
      </div>
      <div style={{ position: 'relative', fontSize: 26 }}>
        <button
          onClick={onClick}
          style={{
            fontSize: 24,
            borderRadius: 4,
            background: 'none',
            color: '#fff',
          }}
        >
          Restart
        </button>
        <div
          style={{
            fontSize: 14,
            position: 'absolute',
            top: '23%',
            right: '17%',
            color: '#b5b5b5',
          }}
        >
          or type Enter
        </div>
      </div>
    </div>
  )
}
