import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Asteroid } from './Asteroid'
import { Message } from './Message'
import { Ship } from './Ship'
import { Timer } from './Timer'

function genAsteroids() {
  return Array.from({ length: 5 }).map((_, index) => {
    return {
      id: index,
    }
  })
}

function App() {
  const spaceRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)

  const [isOver, setIsOver] = useState<boolean>()
  const [dimension, setDimension] = useState<DOMRect>()
  const [asteroids, setAsteroids] = useState([])

  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const [isNewRecord, setIsNewRecord] = useState<boolean>()
  const [record, setRecord] = useState<number>(() => {
    const pb = localStorage.getItem('asteroids-pb')
    if (pb) {
      return Number(pb)
    }
  })

  function reStart() {
    setIsOver(false)
    setIsNewRecord(false)
    setAsteroids([])

    setStartTime(Date.now())
    setEndTime(undefined)

    const id = setTimeout(() => {
      setAsteroids(genAsteroids())
    }, 1000)

    return () => clearTimeout(id)
  }

  useEffect(() => {
    reStart()
  }, [])

  useEffect(() => {
    function handleRestart(e) {
      if (isOver && e.key === 'Enter') {
        reStart()
      }
    }
    window.addEventListener('keypress', handleRestart)
    return () => window.removeEventListener('keypress', handleRestart)
  }, [isOver])

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
    const et = Date.now()
    setEndTime(et)

    const pb = et - startTime
    if (!record || pb > record) {
      setIsNewRecord(true)
      setRecord(pb)
      localStorage.setItem('asteroids-pb', String(pb))
    }
  }, [record, startTime])

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
        <div style={{ color: '#b5b5b5', fontSize: 13 }}>
          <Timer startTime={startTime} endTime={endTime}></Timer>
        </div>
        {/* {isOver && endTime && <Message time={endTime - startTime}></Message>} */}
        {isOver && endTime && (
          <Message
            onClick={reStart}
            time={((endTime - startTime) / 1000).toFixed(2)}
            isNewRecord={isNewRecord}
          ></Message>
        )}
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
