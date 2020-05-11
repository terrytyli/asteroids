import React, {
  forwardRef,
  memo,
  MutableRefObject,
  useEffect,
  useState,
} from 'react'
import { MovingStatus } from './App'
import { isTouchDevice } from './util'

const ShipForwardRef = forwardRef<
  HTMLDivElement,
  {
    isOver: boolean
    spaceRef: MutableRefObject<HTMLDivElement>
    moving: MovingStatus
    setMoving: (m: MovingStatus) => void
  }
>(function _Ship(
  { spaceRef, isOver, moving, setMoving },
  ref: MutableRefObject<HTMLDivElement>
) {
  const [top, setTop] = useState<number>(0)
  const [left, setLeft] = useState<number>(0)
  const [init, setInit] = useState<boolean>()

  const [finishPoint, setFinishPoint] = useState({
    x: undefined,
    y: undefined,
  })

  const step = 15

  // init size
  useEffect(() => {
    const spaceDimension = spaceRef.current.getBoundingClientRect()
    if (ref.current && spaceDimension && !isOver) {
      const { width, height } = ref.current.getBoundingClientRect()
      setTop(Math.floor(spaceDimension.height / 2 - height / 2))
      setLeft(Math.floor(spaceDimension.width / 2 - width / 2))
      setInit(true)
    }
  }, [isOver, ref, spaceRef])

  // set finish point
  useEffect(() => {
    if (isOver) {
      const { top, left } = ref.current.getBoundingClientRect()
      setFinishPoint({
        x: left,
        y: top,
      })
    }
  }, [isOver, ref])

  // move up
  useEffect(() => {
    if (!init || isOver || isTouchDevice) {
      return
    }

    const spaceDimension = spaceRef.current?.getBoundingClientRect()
    const id = setInterval(() => {
      const {
        top: shipTop,
        height: shipHeight,
      } = ref.current.getBoundingClientRect()
      if (shipTop < spaceDimension.top) {
        setTop(shipHeight)
      }
      if (moving.up) {
        if (shipTop > spaceDimension.top) {
          setTop(top - step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, moving.up, ref, spaceRef, top])

  // move down
  useEffect(() => {
    if (!init || isOver || isTouchDevice) {
      return
    }

    const spaceDimension = spaceRef.current?.getBoundingClientRect()
    const id = setInterval(() => {
      const {
        top: shipTop,
        height: shipHeight,
      } = ref.current.getBoundingClientRect()

      if (shipTop + shipHeight > spaceDimension.top + spaceDimension.height) {
        setTop(spaceDimension.height - shipHeight * 2)
      }
      if (moving.down) {
        if (shipHeight + shipTop < spaceDimension.top + spaceDimension.height) {
          setTop(top + step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, moving.down, ref, spaceRef, top])

  // move left
  useEffect(() => {
    if (!init || isOver || isTouchDevice) {
      return
    }

    const spaceDimension = spaceRef.current?.getBoundingClientRect()

    const id = setInterval(() => {
      const {
        left: shipLeft,
        width: shiftWidth,
      } = ref.current.getBoundingClientRect()
      if (shipLeft < spaceDimension.left) {
        setLeft(shiftWidth)
      }
      if (moving.left) {
        if (shipLeft > spaceDimension.left) {
          setLeft(left - step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, left, moving.left, ref, spaceRef])

  // move right
  useEffect(() => {
    if (!init || isOver || isTouchDevice) {
      return
    }

    const spaceDimension = spaceRef.current?.getBoundingClientRect()

    const id = setInterval(() => {
      const {
        left: shipLeft,
        width: shipWidth,
      } = ref.current.getBoundingClientRect()

      if (shipLeft + shipWidth > spaceDimension.left + spaceDimension.width) {
        setLeft(spaceDimension.width - shipWidth * 2)
      }

      if (moving.right) {
        if (
          shipLeft + spaceDimension.left <
          spaceDimension.left + spaceDimension.width
        ) {
          setLeft(left + step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, left, moving.right, ref, spaceRef])

  useEffect(() => {
    function handleKeyDown(e) {
      if (!init || isOver || isTouchDevice) {
        return
      }

      if (e.key === 'ArrowUp') {
        setMoving({
          ...moving,
          up: true,
        })
      }
      if (e.key === 'ArrowDown') {
        setMoving({
          ...moving,
          down: true,
        })
      }

      if (e.key === 'ArrowLeft') {
        setMoving({
          ...moving,
          left: true,
        })
      }
      if (e.key === 'ArrowRight') {
        setMoving({
          ...moving,
          right: true,
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [init, isOver, moving, setMoving])

  useEffect(() => {
    if (!init || isTouchDevice) {
      return
    }

    function handleKeyUp(e) {
      if (e.key === 'ArrowUp') {
        setMoving({
          ...moving,
          up: false,
        })
      }
      if (e.key === 'ArrowDown') {
        setMoving({
          ...moving,
          down: false,
        })
      }
      if (e.key === 'ArrowLeft') {
        setMoving({
          ...moving,
          left: false,
        })
      }
      if (e.key === 'ArrowRight') {
        setMoving({
          ...moving,
          right: false,
        })
      }
    }
    window.addEventListener('keyup', handleKeyUp)

    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [init, moving, setMoving])

  useEffect(() => {
    if (isOver) {
      setMoving({
        up: false,
        down: false,
        left: false,
        right: false,
      })
    }
  }, [isOver, setMoving])

  function touchMove(e) {
    if (isOver) {
      return
    }
    const {
      left: spaceLeft,
      top: spaceTop,
      width: spaceWidth,
      height: spaceHeight,
    } = spaceRef.current.getBoundingClientRect()
    const { width, height } = ref.current.getBoundingClientRect()
    const { clientX, clientY } = e.touches[0]
    const left = clientX - spaceLeft - width * 0.5
    const top = clientY - spaceTop - height * 1.5
    if (left > 0 && left < spaceWidth - width) {
      setLeft(left)
    }
    if (top > -height && top < spaceHeight - height) {
      setTop(top)
    }
  }

  return (
    <>
      {isOver && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            transform: `translate(${finishPoint.x}px, ${finishPoint.y}px)`,
            fontSize: 24,
          }}
        >
          <div>
            <span role="img" aria-label="rocket">
              💥
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          transition: !isTouchDevice && `transform .5s linear`,
          transform: `translate(${left}px, ${top}px)`,
          fontSize: 24,
          visibility: isOver ? 'hidden' : 'visible',
        }}
        onTouchStart={touchMove}
        onTouchMove={touchMove}
        ref={ref}
      >
        <div
          style={{
            transform: 'rotate(268deg)',
          }}
        >
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </div>
      </div>
    </>
  )
})

export const Ship = memo(ShipForwardRef)
