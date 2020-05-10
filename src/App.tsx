import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Asteroid } from './Asteroid'
import { Message } from './Message'
import { Ship } from './Ship'
import { Timer } from './Timer'
import { Controls } from './Controls'

export interface MovingStatus {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}
const isTouchDevice = 'ontouchstart' in document.documentElement

function genAsteroids() {
  return Array.from({ length: 0 }).map((_, index) => {
    return {
      id: index,
    }
  })
}

function App() {
  const spaceRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)

  const [isOver, setIsOver] = useState<boolean>()
  const [asteroids, setAsteroids] = useState([])

  const [moving, setMoving] = useState<MovingStatus>({
    up: false,
    down: false,
    right: false,
    left: false,
  })

  const [startTime, setStartTime] = useState<number>()
  const [endTime, setEndTime] = useState<number>()
  const [isNewRecord, setIsNewRecord] = useState<boolean>()
  const [record, setRecord] = useState<number>(() => {
    const pb = localStorage.getItem('asteroids-pb')
    if (pb) {
      return Number(pb)
    }
  })

  const reStart = useCallback(() => {
    setIsNewRecord(false)
    setAsteroids([])

    setStartTime(Date.now())
    setEndTime(undefined)

    setIsOver(false)

    const id = setTimeout(() => {
      setAsteroids(genAsteroids())
    }, 1000)

    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    reStart()
  }, [reStart])

  useEffect(() => {
    function handleRestart(e) {
      if (e.key === 'Enter') {
        reStart()
      }
    }
    window.addEventListener('keypress', handleRestart)
    return () => window.removeEventListener('keypress', handleRestart)
  }, [reStart])

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

    const lapse = et - startTime
    if (!record || lapse > record) {
      setIsNewRecord(true)
      setRecord(lapse)
      localStorage.setItem('asteroids-pb', String(lapse))
    }
  }, [record, startTime])

  return (
    <div
      style={{
        background: '#000',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
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
          minHeight: 280,
          maxWidth: 768,
          overflow: 'hidden',
        }}
      >
        <div style={{ color: '#b5b5b5', fontSize: 13 }}>
          <Timer startTime={startTime} endTime={endTime}></Timer>
        </div>
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
              spaceRef={spaceRef}
              shipRef={shipRef}
              key={a.id}
            />
          )
        })}

        <Ship
          ref={shipRef}
          spaceRef={spaceRef}
          isOver={isOver}
          moving={moving}
          setMoving={setMoving}
        />
      </div>
      {isTouchDevice && (
        <div style={{ marginTop: 12 }}>
          <Controls moving={moving} setMoving={setMoving}></Controls>
        </div>
      )}
    </div>
  )
}

export default App
