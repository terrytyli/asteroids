import React, {
  memo,
  forwardRef,
  MutableRefObject,
  useState,
  useEffect,
} from 'react'

const ShipForwardRef = forwardRef<
  HTMLDivElement,
  {
    spaceDimension: DOMRect
  }
>(function _Ship({ spaceDimension }, ref: MutableRefObject<HTMLDivElement>) {
  const [top, setTop] = useState<number>(0)
  const [left, setLeft] = useState<number>(0)
  const [init, setInit] = useState<boolean>()
  useEffect(
    () => {
      if (ref.current && spaceDimension) {
        const { width, height } = ref.current.getBoundingClientRect()
        setTop(Math.floor(spaceDimension.height / 2 - height / 2))
        setLeft(Math.floor(spaceDimension.width / 2 - width / 2))
        setInit(true)
      }
    },
    [ref, spaceDimension]
  )

  useEffect(
    () => {
      function handleKeyDown(e) {
        if (!init) {
          return
        }

        if (ref.current && spaceDimension) {
          const {
            left: shipLeft,
            top: shipTop,
            width: shipWidth,
            height: shipHeight,
          } = ref.current.getBoundingClientRect()
          const step = 5
          switch (e.key) {
            case 'ArrowDown': {
              if (
                shipHeight + shipTop >
                spaceDimension.top + spaceDimension.height
              ) {
                setTop(spaceDimension.height - shipHeight)
              }

              if (
                shipHeight + shipTop <
                spaceDimension.top + spaceDimension.height
              ) {
                setTop(top + step)
              }

              break
            }
            case 'ArrowUp': {
              if (shipTop < spaceDimension.top) {
                setTop(0)
              }

              if (shipTop > spaceDimension.top) {
                setTop(top - step)
              }
              break
            }

            case 'ArrowLeft':
              if (shipLeft < spaceDimension.left) {
                setLeft(0)
              }
              if (shipLeft > spaceDimension.left) {
                setLeft(left - step)
              }
              break

            case 'ArrowRight':
              if (
                shipLeft + spaceDimension.left >
                spaceDimension.left + spaceDimension.width
              ) {
                setLeft(spaceDimension.width - shipWidth)
              }
              if (
                shipLeft + spaceDimension.left <
                spaceDimension.left + spaceDimension.width
              ) {
                setLeft(left + step)
              }
              break
            default:
              break
          }
        }
      }
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    },
    [init, left, ref, spaceDimension, top]
  )

  return (
    <div
      style={{
        position: 'absolute',
        transition: 'transform .5s ease-out',
        transform: `translate(${left}px, ${top}px)`,
        fontSize: 32,
      }}
      ref={ref}
    >
      <div
        style={{
          transform: 'rotate(-43deg)',
        }}
      >
        <span role="img" aria-label="rocket">
          🚀
        </span>
      </div>
    </div>
  )
})

export const Ship = memo(ShipForwardRef)
