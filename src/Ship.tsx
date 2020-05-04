import React, {
  forwardRef,
  memo,
  MutableRefObject,
  useEffect,
  useState,
} from 'react'

const ShipForwardRef = forwardRef<
  HTMLDivElement,
  {
    isOver: boolean
    spaceDimension: DOMRect
  }
>(function _Ship(
  { spaceDimension, isOver },
  ref: MutableRefObject<HTMLDivElement>
) {
  const [top, setTop] = useState<number>(0)
  const [left, setLeft] = useState<number>(0)
  const [init, setInit] = useState<boolean>()

  const [movingLeft, setMovingLeft] = useState<boolean>()
  const [movingRight, setMovingRight] = useState<boolean>()
  const [movingUp, setMovingUp] = useState<boolean>()
  const [movingDown, setMovingDown] = useState<boolean>()

  const [finishPoint, setFinishPoint] = useState({
    x: undefined,
    y: undefined,
  })

  const step = 15

  // init size
  useEffect(() => {
    if (ref.current && spaceDimension && !isOver) {
      const { width, height } = ref.current.getBoundingClientRect()
      setTop(Math.floor(spaceDimension.height / 2 - height / 2))
      setLeft(Math.floor(spaceDimension.width / 2 - width / 2))
      setInit(true)
    }
  }, [isOver, ref, spaceDimension])

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
    if (!init) {
      return
    }

    const id = setInterval(() => {
      const { top: shipTop } = ref.current.getBoundingClientRect()
      if (shipTop < spaceDimension.top) {
        setTop(0)
      }
      if (movingUp && !isOver) {
        if (shipTop > spaceDimension.top) {
          setTop(top - step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, movingUp, ref, spaceDimension, top])

  // move down
  useEffect(() => {
    if (!init) {
      return
    }

    const id = setInterval(() => {
      const {
        top: shipTop,
        height: shipHeight,
      } = ref.current.getBoundingClientRect()

      if (shipTop + shipHeight > spaceDimension.top + spaceDimension.height) {
        setTop(spaceDimension.height - shipHeight)
      }
      if (movingDown && !isOver) {
        if (shipHeight + shipTop < spaceDimension.top + spaceDimension.height) {
          setTop(top + step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, movingDown, ref, spaceDimension, top])

  // move left
  useEffect(() => {
    if (!init) {
      return
    }

    const id = setInterval(() => {
      const { left: shipLeft } = ref.current.getBoundingClientRect()
      if (shipLeft < spaceDimension.left) {
        setLeft(0)
      }
      if (movingLeft && !isOver) {
        if (shipLeft > spaceDimension.left) {
          setLeft(left - step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, left, movingLeft, ref, spaceDimension])

  // move right
  useEffect(() => {
    if (!init) {
      return
    }

    const id = setInterval(() => {
      const {
        left: shipLeft,
        width: shipWidth,
      } = ref.current.getBoundingClientRect()

      if (shipLeft + shipWidth > spaceDimension.left + spaceDimension.width) {
        setLeft(spaceDimension.width - shipWidth)
      }

      if (movingRight && !isOver) {
        if (
          shipLeft + spaceDimension.left <
          spaceDimension.left + spaceDimension.width
        ) {
          setLeft(left + step)
        }
      }
    }, 100)

    return () => clearInterval(id)
  }, [init, isOver, left, movingRight, ref, spaceDimension])

  useEffect(() => {
    function handleKeyDown(e) {
      if (!init || isOver) {
        return
      }

      if (e.key === 'ArrowUp') {
        setMovingUp(true)
      }
      if (e.key === 'ArrowDown') {
        setMovingDown(true)
      }

      if (e.key === 'ArrowLeft') {
        setMovingLeft(true)
      }
      if (e.key === 'ArrowRight') {
        setMovingRight(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [init, isOver, left, ref, spaceDimension, top])

  useEffect(() => {
    if (!init) {
      return
    }

    function handleKeyUp(e) {
      if (e.key === 'ArrowUp') {
        setMovingUp(false)
      }
      if (e.key === 'ArrowDown') {
        setMovingDown(false)
      }
      if (e.key === 'ArrowLeft') {
        setMovingLeft(false)
      }
      if (e.key === 'ArrowRight') {
        setMovingRight(false)
      }
    }
    window.addEventListener('keyup', handleKeyUp)

    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [init])

  useEffect(() => {
    if (isOver) {
      setMovingUp(false)

      setMovingDown(false)

      setMovingLeft(false)

      setMovingRight(false)
    }
  }, [isOver])

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
          transition: `transform .5s linear`,
          transform: `translate(${left}px, ${top}px)`,
          fontSize: 24,
          visibility: isOver ? 'hidden' : 'visible',
        }}
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
