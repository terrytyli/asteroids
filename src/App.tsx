import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Asteroid } from './Asteroid'
import { Ship } from './Ship'

function App() {
  const spaceRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)

  const [isOver, setIsOver] = useState<boolean>()
  const [dimension, setDimension] = useState<DOMRect>()
  const [asteroids, setAsteroids] = useState(() => {
    return Array.from({ length: 5 }).map((_, index) => {
      return {
        id: index,
      }
    })
  })

  useEffect(() => {
    const dimension = spaceRef.current.getBoundingClientRect()
    setDimension(dimension)
  }, [spaceRef])

  const handleDismiss = useCallback(
    (id) => {
      if (!isOver) {
        const updated = asteroids.filter((a) => a.id !== id)
        updated.push({ id: Date.now() })
        setAsteroids(updated)
      }
    },
    [asteroids, isOver]
  )

  const handleHit = useCallback(() => {
    setIsOver(true)
  }, [])

  return (
    <div
      style={{
        background: '#000',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        ref={spaceRef}
        style={{
          position: 'relative',
          border: '1px solid #fff',
          width: '90%',
          height: '30%',
          minHeight: 320,
          maxWidth: 768,
          overflow: 'hidden',
        }}
      >
        {asteroids.map((a) => {
          return (
            <Asteroid
              onDismiss={() => handleDismiss(a.id)}
              onHit={handleHit}
              isOver={isOver}
              spaceDimension={dimension}
              shipRef={shipRef}
              key={a.id}
            />
          )
        })}

        <Ship ref={shipRef} spaceDimension={dimension} isOver={isOver} />
      </div>
    </div>
  )
}

export default App
