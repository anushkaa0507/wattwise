"use client"

import { useEffect, useRef } from "react"
import { animate, createTimeline, createTimer, stagger, utils } from "animejs"

export default function Hero({ goLogin }) {
  const creatureRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const creatureEl = creatureRef.current
    if (!creatureEl) return

    creatureEl.innerHTML = ""

    const viewport = {
      w: window.innerWidth * 0.5,
      h: window.innerHeight * 0.5,
    }

    const cursor = { x: 0, y: 0 }

    const rows = 13
    const grid = [rows, rows]
    const from = "center"

    const scaleStagger = stagger([2, 5], {
      ease: "inQuad",
      grid,
      from,
    })

    const opacityStagger = stagger([1, 0.1], {
      grid,
      from,
    })

    for (let i = 0; i < rows * rows; i++) {
      const div = document.createElement("div")
      creatureEl.appendChild(div)
    }

    const particleEls = creatureEl.querySelectorAll("div")

    utils.set(creatureEl, {
      width: rows * 10 + "em",
      height: rows * 10 + "em",
    })

    utils.set(particleEls, {
      width: "4em",
      height: "4em",
      margin: "3em",
      x: 0,
      y: 0,
      scale: scaleStagger,
      opacity: opacityStagger,
      borderRadius: "50%",
      background: stagger([80, 20], {
        grid,
        from,
        modifier: v => `hsl(4, 80%, ${v}%)`,
      }),
      boxShadow: stagger([8, 1], {
        grid,
        from,
        modifier: v =>
          `0px 0px ${Math.round(v)}em 0px hsl(4, 80%, 50%)`,
      }),
      zIndex: stagger([rows * rows, 1], {
        grid,
        from,
        modifier: v => Math.round(v),
      }),
    })

    const pulse = () => {
      animate(particleEls, {
        keyframes: [
          {
            scale: 5,
            opacity: 1,
            delay: stagger(90, { start: 1650, grid, from }),
            duration: 150,
          },
          {
            scale: scaleStagger,
            opacity: opacityStagger,
            duration: 600,
            ease: "inOutQuad",
          },
        ],
      })
    }

    const mainLoop = createTimer({
      frameRate: 15,
      onUpdate: () => {
        animate(particleEls, {
          x: cursor.x,
          y: cursor.y,
          delay: stagger(40, { grid, from }),
          duration: stagger(120, { start: 750, grid, from }),
          ease: "inOut",
          composition: "blend",
        })
      },
    })

    const autoMove = createTimeline()
      .add(
        cursor,
        {
          x: [-viewport.w * 0.45, viewport.w * 0.45],
          duration: 3000,
          ease: "inOutExpo",
          alternate: true,
          loop: true,
          onBegin: pulse,
          onLoop: pulse,
        },
        0
      )
      .add(
        cursor,
        {
          y: [-viewport.h * 0.45, viewport.h * 0.45],
          duration: 2000,
          ease: "inOutQuad",
          alternate: true,
          loop: true,
        },
        0
      )

    autoMove.play()

    const followPointer = e => {
      const event = e.touches ? e.touches[0] : e
      cursor.x = event.pageX - viewport.w
      cursor.y = event.pageY - viewport.h
    }

    document.addEventListener("mousemove", followPointer)
    document.addEventListener("touchmove", followPointer)

    if (textRef.current) {
      animate(textRef.current, {
        opacity: [0, 1],
        translateY: [60, 0],
        duration: 1400,
        ease: "easeOutExpo",
        delay: 400,
      })
    }

    return () => {
      mainLoop.pause()
      autoMove.pause()
      document.removeEventListener("mousemove", followPointer)
      document.removeEventListener("touchmove", followPointer)
    }
  }, [])

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            ref={creatureRef}
            className="flex flex-wrap justify-center items-center"
            style={{ fontSize: "0.2vh" }}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl" />

        {/* Center Content */}
        <div className="relative z-10 flex flex-col h-full items-center justify-center gap-8 text-center">
          <h1
            ref={textRef}
            className="text-6xl md:text-8xl font-bold tracking-tight 
            bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 
            bg-clip-text text-transparent"
          >
            WattWise
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl">
            Smart Energy Consumption Tracker with real-time monitoring 
            and remote device control for your home.
          </p>

          <button
            onClick={goLogin}
            className="px-8 py-3 rounded-full bg-gradient-to-r 
            from-red-500 to-orange-500 text-white font-semibold 
            hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* EXTRA CONTENT SECTION */}
      <section className="bg-black text-white py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">

          <div className="p-8 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
            <h3 className="text-2xl font-semibold mb-4 text-orange-400">
              📊 Real-Time Tracking
            </h3>
            <p className="text-gray-400">
              Monitor electricity units consumed daily, weekly, and monthly.
              Get visual analytics and smart insights on usage.
            </p>
          </div>

          <div className="p-8 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
            <h3 className="text-2xl font-semibold mb-4 text-orange-400">
              ⚡ Remote Device Control
            </h3>
            <p className="text-gray-400">
              Switch devices ON/OFF remotely, change modes, and automate 
              energy-saving schedules from anywhere.
            </p>
          </div>

          <div className="p-8 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
            <h3 className="text-2xl font-semibold mb-4 text-orange-400">
              🔔 Smart Alerts
            </h3>
            <p className="text-gray-400">
              Get notified when energy consumption exceeds limits and 
              optimize your home’s power efficiency.
            </p>
          </div>

        </div>
      </section>
    </>
  )
}
