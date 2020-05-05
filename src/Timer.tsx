import React, { useEffect, useState } from 'react'
export function Timer({ startTime, endTime }) {
  const [lapse, setLapse] = useState(0)

  useEffect(() => {
    if (!endTime) {
      const id = setInterval(() => {
        setLapse(Date.now() - startTime)
      }, 10)

      return () => {
        clearInterval(id)
      }
    } else {
      setLapse(endTime - startTime)
    }
  }, [endTime, startTime])

  return <>{(lapse / 1000).toFixed(2)}</>
}
