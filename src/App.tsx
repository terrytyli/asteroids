import React, { useEffect, useRef, useState } from 'react'
import { Asteroid } from './Asteroid'
import { Ship } from './Ship'

function App() {
  const spaceRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)

  const [dimension, setDimension] = useState<DOMRect>()
  const [asteroids, setAsteroids] = useState(() => {
    return Array.from({ length: 30 }).map((_, index) => {
      return {
        id: index,
      }
    })
  })

  useEffect(
    () => {
      const dimension = spaceRef.current.getBoundingClientRect()
      setDimension(dimension)
    },
    [spaceRef]
  )

  function handleDone(id) {
    const updated = asteroids.filter((a) => a.id !== id)
    updated.push({ id: Date.now() })
    setAsteroids(updated)
  }
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
          overflow: 'hidden',
        }}
      >
        {asteroids.map((a) => {
          return (
            <Asteroid
              onDone={() => handleDone(a.id)}
              spaceDimension={dimension}
              shipRef={shipRef}
              key={a.id}
            />
          )
        })}

        <Ship ref={shipRef} spaceDimension={dimension} />
      </div>
    </div>
  )
}

export default App
