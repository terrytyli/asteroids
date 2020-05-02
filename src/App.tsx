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
}: {
  spaceDimension: DOMRect
  shipRef: MutableRefObject<HTMLDivElement>
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

  const [move, setMove] = useState<boolean>()
  useEffect(
    () => {
      if (spaceDimension) {
        const left = Math.random() * spaceDimension.width

        const top = Math.random() * spaceDimension.height

        const {
          left: shipLeft,
          top: shipTop,
        } = shipRef.current.getBoundingClientRect()
        const YToX = Math.abs(
          (shipTop - top - spaceDimension.top) /
            (shipLeft - left - spaceDimension.left)
        )
        console.log(YToX)
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
      setMove(true)
    }, 1000)

    return () => clearTimeout(id)
  }, [])

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
        transition: 'transform 3s linear',
        transform: move && `translate(${data.x}px,${data.y}px)`,
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
    return Array.from({ length: 100 }).map((_, index) => {
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
  return (
    <div
      style={{
        background: '#000',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // overflow: 'hidden',
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
          // overflow: 'hidden',
        }}
      >
        {asteroids.map((asteroid) => {
          return (
            <Asteroid
              spaceDimension={dimension}
              shipRef={shipRef}
              key={asteroid.id}
            />
          )
        })}

        <Ship ref={shipRef} />
      </div>
    </div>
  )
}

export default App
