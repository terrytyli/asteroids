import React, { CSSProperties } from 'react'
import { MovingStatus } from './App'

function Button({
  style,
  children,
  onTouchStart,
  onTouchEnd,
}: {
  style?: CSSProperties
  children: any
  onTouchStart: () => void
  onTouchEnd: () => void
}) {
  return (
    <button
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        fontSize: 32,
        color: 'white',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        background: 'none',
        border: 0,
        outline: 0,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
export function Controls({
  setMoving,
  moving,
}: {
  moving: MovingStatus
  setMoving: (m: MovingStatus) => void
}) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div>
        <Button
          onTouchStart={() =>
            setMoving({
              ...moving,
              up: true,
            })
          }
          onTouchEnd={() =>
            setMoving({
              ...moving,
              up: false,
            })
          }
        >
          ↑
        </Button>
      </div>

      <div>
        <Button
          style={{ marginRight: 84 }}
          onTouchStart={() =>
            setMoving({
              ...moving,
              left: true,
            })
          }
          onTouchEnd={() =>
            setMoving({
              ...moving,
              left: false,
            })
          }
        >
          ←
        </Button>
        <Button
          onTouchStart={() =>
            setMoving({
              ...moving,
              right: true,
            })
          }
          onTouchEnd={() =>
            setMoving({
              ...moving,
              right: false,
            })
          }
        >
          →
        </Button>
      </div>
      <div>
        <Button
          onTouchStart={() =>
            setMoving({
              ...moving,
              down: true,
            })
          }
          onTouchEnd={() =>
            setMoving({
              ...moving,
              down: false,
            })
          }
        >
          ↓
        </Button>
      </div>
    </div>
  )
}
