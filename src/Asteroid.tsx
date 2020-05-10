import React, {
  memo,
  MutableRefObject,
  useRef,
  useState,
  useEffect,
} from 'react'
import { useCollision } from './useCollision'

export const Asteroid = memo(
  ({
    spaceRef,
    shipRef,
    onDismiss,
    onHit,
    isOver,
  }: {
    spaceRef: MutableRefObject<HTMLDivElement>
    shipRef: MutableRefObject<HTMLDivElement>
    onDismiss: () => void
    onHit: () => void
    isOver: boolean
  }) => {
    const height = 4
    const width = 4
    const windowWidth = window.innerWidth

    const ref = useRef<HTMLDivElement>()
    const [data, setData] = useState({
      top: -2,
      left: -2,
      x: undefined,
      y: undefined,
    })

    const [started, setStarted] = useState<boolean>()

    const [finishPoint, setFinishPoint] = useState<{ x: number; y: number }>()

    const collided = useCollision(ref?.current, shipRef?.current)

    useEffect(() => {
      const spaceDimension = spaceRef.current?.getBoundingClientRect()
      if (isOver && started && !finishPoint) {
        const { left, top } = ref.current.getBoundingClientRect()
        setFinishPoint({
          x: left - data.left - spaceDimension.left,
          y: top - data.top - spaceDimension.top,
        })
      }
    }, [data, finishPoint, isOver, spaceRef, started])

    useEffect(() => {
      if (collided && !isOver) {
        onHit()
      }
    }, [collided, isOver, onHit])

    // moving towards to the target
    useEffect(() => {
      function getTarget() {
        let left
        let top

        const spaceDimension = spaceRef.current?.getBoundingClientRect()
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
      }

      const id = setTimeout(getTarget, 100)
      return () => clearTimeout(id)
    }, [shipRef, spaceRef, windowWidth])

    // delay to start moving
    useEffect(() => {
      const id = setTimeout(() => {
        setStarted(true)
      }, 500 + Math.random() * 500)

      return () => clearTimeout(id)
    }, [])

    // reach to the edge
    useEffect(() => {
      if (isOver) {
        return
      }

      const spaceDimension = spaceRef.current?.getBoundingClientRect()
      const id = setInterval(() => {
        const { top, left } = ref.current.getBoundingClientRect()
        if (
          started &&
          (left > spaceDimension.left + spaceDimension.width ||
            left <= spaceDimension.left ||
            top <= spaceDimension.top ||
            top > spaceDimension.top + spaceDimension.height)
        ) {
          onDismiss()
        }
      }, 100)
      return () => clearInterval(id)
    }, [started, onDismiss, spaceRef, isOver])

    function getTranslate() {
      let translate
      if (started) {
        translate = `translate(${data.x}px,${data.y}px)`
      }

      if (isOver) {
        translate = `translate(${finishPoint?.x}px,${finishPoint?.y}px)`
      }

      return translate
    }
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
          transform: getTranslate(),
        }}
      />
    )
  }
)
