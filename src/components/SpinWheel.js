'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { Open_Sans } from 'next/font/google'
const OpenSans = Open_Sans({ subsets: ['latin'], weight: ['400', '500'] })

const segments = ['Magnet Wallet', 'Sticker Pack', 'Coffee', 'Tumbler']
const colors = ['#1A1A4E', '#C3E8F0', '#1A1A4E', '#C3E8F0']
const segmentCount = segments.length
const anglePerSegment = 360 / segmentCount

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [hadiahIndex, setHadiahIndex] = useState(null)

  const spin = () => {
    if (isSpinning) return
    setIsSpinning(true)

    const spins = 3 + Math.floor(Math.random() * 3)
    const randomSegment = Math.floor(Math.random() * segmentCount)
    const targetRotation = spins * 360 + (360 - randomSegment * anglePerSegment)

    setRotation(prev => prev + targetRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setHadiahIndex(randomSegment)
    }, 4000)
  }

  const conicGradient = colors
    .map((color, i) => {
      const start = i * anglePerSegment
      const end = (i + 1) * anglePerSegment
      return `${color} ${start}deg ${end}deg`
    })
    .join(', ')

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      {/* Pointer */}
      <div className="pointer-events-none absolute top-0 z-10 w-[70px]">
        <Image
          src="/images/samsung-pointer.png"
          width={56}
          height={48}
          alt="Pointer"
          className="w-full"
          priority
        />
      </div>

      {/* Wheel Container */}
      <div className="relative w-full flex items-center justify-center">
        <div className="relative h-[310px] w-[310px] rounded-full border-[10px] border-[#1A1A4E] shadow-md overflow-hidden">
          {/* Wheel */}
          <motion.div
            className="relative h-full w-full rounded-full"
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            style={{ background: `conic-gradient(${conicGradient})` }}
          >
            {/* 4 Grid-Based Segments */}
            <div className="absolute inset-0 flex items-center justify-center flex-wrap">
              {segments.map((text, i) => {
                const rotateText = [
                  'rotate-[-45deg]',
                  'rotate-[45deg]',
                  'rotate-[-135deg]',
                  'rotate-[135deg]'
                ]
                const textColor = colors[i] === '#C3E8F0' ? 'text-white' : 'text-[#1A1A4E]'

                return (
                  <div
                    key={i}
                    className="flex items-center justify-center w-[50%]"
                  >
                    <span
                      className={`text-[12px] font-semibold text-center w-[80px] leading-tight ${rotateText[i]} ${textColor}`}
                    >
                      {text} {i}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Center Circle */}
        <div className="absolute left-0 top-0 bottom-0 right-0 flex items-center justify-center w-[44%] m-auto">
          <Image
            src="/images/samsung-circle.png"
            width={98}
            height={98}
            alt="Center"
            className="w-full"
            priority
          />
        </div>
      </div>

      {/* Result */}
      {hadiahIndex !== null && (
        <p
          className={`pointer-events-none mt-4 inline-block text-center px-6 py-2 text-xs bg-[#2A2A5C] rounded-full text-white ${OpenSans.className}`}
        >
          Kamu mendapatkan: {segments[hadiahIndex]}
        </p>
      )}

      {/* Button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="mt-6 shadow-lg disabled:opacity-50"
      >
        <Image
          src="/images/new-putar.png"
          width={295}
          height={56}
          alt="Putar"
          className="w-full"
          priority
        />
      </button>
    </div>
  )
}
