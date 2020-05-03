import { useEffect, useState } from 'react'

export function useCollision(objectA: HTMLElement, objectB: HTMLElement) {
  const [collided, setCollided] = useState<boolean>()

  const fuzz = 4
  useEffect(
    () => {
      if (!objectA || !objectB) {
        return
      }
      const intervalId = setInterval(() => {
        const { top, left, width, height } = objectA.getBoundingClientRect()
        const {
          top: bTop,
          left: bLeft,
          width: bWidth,
          height: bHeight,
        } = objectB.getBoundingClientRect()
        if (
          ((top >= bTop && top - bTop < bHeight - fuzz) ||
            (top < bTop && bTop - top < height - fuzz)) &&
          ((left >= bLeft && left - bLeft < bWidth - fuzz) ||
            (left < bLeft && bLeft - left < width - fuzz))
        ) {
          setCollided(true)
          clearInterval(intervalId)
        }
      }, 10)
      return () => clearInterval(intervalId)
    },
    [objectA, objectB]
  )

  return collided
}
