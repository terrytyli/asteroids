import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  MutableRefObject,
} from 'react'

function Asteroid({
  spaceDimension,
  shipRef,
  onDone,
}: {
  spaceDimension: DOMRect
  shipRef: MutableRefObject<HTMLDivElement>
  onDone: () => void
}) {
  const height = 4
  const width = 4
  const windowWidth = window.innerWidth

  const ref = useRef<HTMLDivElement>()
  const [data, setData] = useState({
    top: undefined,
    left: undefined,
    x: undefined,
    y: undefined,
  })

  const [moving, setMoving] = useState<boolean>()
  useEffect(
    () => {
      let left, top
      if (spaceDimension) {
        const dice = Math.random()
        if (dice > 0.5) {
          left = Math.random() * spaceDimension.width
          top = Math.round(Math.random()) * spaceDimension.height
          if (top === 0) {
            top = top - height
          }
        } else {
          left = Math.round(Math.random()) * spaceDimension.width
          if (left === 0) {
            left = left - width
          }
          top = Math.random() * spaceDimension.height
        }

        const {
          left: shipLeft,
          top: shipTop,
        } = shipRef.current.getBoundingClientRect()
        const YToX = Math.abs(
          (shipTop - top - spaceDimension.top) /
            (shipLeft - left - spaceDimension.left)
        )
        let x, y

        if (left + spaceDimension.left <= shipLeft) {
          x = spaceDimension.width - left
          if (top + spaceDimension.top > shipTop) {
            y = -x * YToX - width
            if (Math.abs(y) > top) {
              y = -top - width
              x = top / YToX
            }
          } else {
            y = x * YToX
            if (Math.abs(y) > spaceDimension.height - top) {
              y = spaceDimension.height - top
              x = y / YToX
            }
          }
        } else {
          x = -left - width
          if (top + spaceDimension.top > shipTop) {
            y = -left * YToX
            if (Math.abs(y) > top) {
              y = -top - width
              x = -top / YToX
            }
          } else {
            y = left * YToX
            if (Math.abs(y) > spaceDimension.height - top) {
              y = spaceDimension.height - top
              x = -y / YToX
            }
          }
        }
        setData({
          left,
          top,
          x: x,
          y: y,
        })
      }
    },
    [shipRef, spaceDimension, windowWidth]
  )

  useEffect(() => {
    const id = setTimeout(() => {
      setMoving(true)
    }, 1000)

    return () => clearTimeout(id)
  }, [])

  useEffect(
    () => {
      const id = setInterval(() => {
        const { top, left } = ref.current.getBoundingClientRect()
        if (
          moving &&
          (left > spaceDimension.left + spaceDimension.width ||
            left <= spaceDimension.left ||
            top <= spaceDimension.top ||
            top > spaceDimension.top + spaceDimension.height)
        ) {
          onDone()
        }
      }, 100)
      return () => clearInterval(id)
    },
    [moving, onDone, spaceDimension]
  )

  return (
    <div
      ref={ref}
      style={{
        background: '#fff',
        height,
        width,
        borderRadius: '50%',
        position: 'absolute',
        top: data.top,
        left: data.left,
        transition: 'transform 5s linear',
        transform: moving && `translate(${data.x}px,${data.y}px)`,
      }}
    />
  )
}

const Ship = forwardRef<HTMLDivElement>(function _Ship(props, ref) {
  return (
    <div
      {...props}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 32,
      }}
      ref={ref}
    >
      <div
        style={{
          transform: 'rotate(-43deg)',
        }}
      >
        🚀
      </div>
    </div>
  )
})

function App() {
  const spaceRef = useRef<HTMLDivElement>(null)
  const shipRef = useRef<HTMLDivElement>(null)

  const [dimension, setDimension] = useState<DOMRect>()
  const [asteroids, setAsteroids] = useState(() => {
    return Array.from({ length: 50 }).map((_, index) => {
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

        <Ship ref={shipRef} />
      </div>
    </div>
  )
}

export default App
