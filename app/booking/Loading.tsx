'use client'

import React, { useEffect, useState } from 'react'

export default function MovingLoading() {
  const [step, setStep] = useState(0)
  const [lines, setLines] = useState<string[]>(['---------', '---------', '---------'])

  const randomChar = () => {
    const chars = '!@#$%^&*()_+=abcdefghijklmnopqrstuvwxyz0123456789'
    return chars[Math.floor(Math.random() * chars.length)]
  }

  const generateLine = (length: number, step: number) => {
    const totalSteps = length + 3
    const index = step % totalSteps

    let visibleCount = 3
    if (index === 0) visibleCount = 1
    else if (index === 1) visibleCount = 2
    else if (index < 2) visibleCount = 3

    let result = ''
    for (let i = 0; i < length; i++) {
      if (i >= index - visibleCount + 1 && i <= index) result += randomChar()
      else result += '-'
    }
    return result
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => prev + 1)
      setLines([
        generateLine(9, step),
        generateLine(9, step + 2),
        generateLine(9, step + 4),
      ])
    }, 300)

    return () => clearInterval(interval)
  }, [step])

  return (
    <div className="flex flex-col items-center justify-center h-screen  text-foreground -400 font-mono  tracking-widest">
      {lines.map((line, i) => (
        <div key={i}>
          {i === 0 && line}
          {i === 1 && "--IGN-X--"}
          {i === 2 && line}
        </div>
      ))}
    </div>
  )
}
