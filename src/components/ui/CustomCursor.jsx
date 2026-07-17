import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

// ─── BRAND COLORS ─────────────────────────────────────────────────────────────
const CURSOR_CONFIG = {
  // Arrow cursor
  arrowColor:        'var(--color-deep-forest-dark)',
  arrowSize:         24,

  // Ambient rings (always visible, slow pulse)
  ringColor:         'var(--color-saffron-glow)',
  ring1Size:         18,
  ring2Size:         30,
  ring3Size:         44,
  ringStrokeWidth:   1.5,
  ring1Opacity:      0.75,
  ring2Opacity:      0.40,
  ring3Opacity:      0.18,

  // Click burst rings (animate out on click)
  clickBurstColor:   'var(--color-saffron-glow-dark)',
  clickBurstCount:   3,

  // Spring config for cursor following
  springStiffness:   800,
  springDamping:     35,
  springMass:        0.5,
}

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springX = useSpring(cursorX, {
    stiffness: CURSOR_CONFIG.springStiffness,
    damping:   CURSOR_CONFIG.springDamping,
    mass:      CURSOR_CONFIG.springMass,
  })
  const springY = useSpring(cursorY, {
    stiffness: CURSOR_CONFIG.springStiffness,
    damping:   CURSOR_CONFIG.springDamping,
    mass:      CURSOR_CONFIG.springMass,
  })

  const [clicks, setClicks]         = useState([])
  const [isHovering, setIsHovering] = useState(false)
  const [isPointer, setIsPointer]   = useState(false)
  const [isHidden, setIsHidden]     = useState(false)
  const clickIdRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const getZoom = () => {
      const zoom = window.getComputedStyle(document.body).zoom;
      return (zoom && !isNaN(parseFloat(zoom))) ? parseFloat(zoom) : 1;
    }

    const onMove = (e) => {
      const zoom = getZoom();
      cursorX.set(e.clientX / zoom)
      cursorY.set(e.clientY / zoom)
    }

    const onClick = (e) => {
      const zoom = getZoom();
      const id = ++clickIdRef.current
      setClicks(prev => [...prev, { id, x: e.clientX / zoom, y: e.clientY / zoom }])

      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id))
      }, 800)
    }

    const onMouseOver = (e) => {
      const target = e.target
      const computed = window.getComputedStyle(target).cursor
      setIsPointer(
        computed === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.getAttribute('role') === 'button'
      )
    }

    const onMouseLeave = () => setIsHidden(true)
    const onMouseEnter = () => setIsHidden(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('click',     onClick)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('click',     onClick)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [cursorX, cursorY])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      <motion.div
        style={{
          position:      'fixed',
          left:          springX,
          top:           springY,
          zIndex:        99999,
          pointerEvents: 'none',
          opacity:       isHidden ? 0 : 1,
          transform:     'translate(-2px, -2px)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <AmbientRing size={CURSOR_CONFIG.ring3Size} color={CURSOR_CONFIG.ringColor} opacity={CURSOR_CONFIG.ring3Opacity} strokeWidth={CURSOR_CONFIG.ringStrokeWidth} delay={0} isPointer={isPointer} />
          <AmbientRing size={CURSOR_CONFIG.ring2Size} color={CURSOR_CONFIG.ringColor} opacity={CURSOR_CONFIG.ring2Opacity} strokeWidth={CURSOR_CONFIG.ringStrokeWidth} delay={0.15} isPointer={isPointer} />
          <AmbientRing size={CURSOR_CONFIG.ring1Size} color={CURSOR_CONFIG.ringColor} opacity={CURSOR_CONFIG.ring1Opacity} strokeWidth={CURSOR_CONFIG.ringStrokeWidth + 0.5} delay={0.3} isPointer={isPointer} />
        </div>

        <motion.svg
          width={CURSOR_CONFIG.arrowSize}
          height={CURSOR_CONFIG.arrowSize}
          viewBox="0 0 24 24"
          style={{ display: 'block', position: 'relative', zIndex: 2 }}
          animate={{ scale: isPointer ? 1.15 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M 0 0 L 0 18 L 4.5 13.5 L 8 20 L 10 19 L 6.5 12.5 L 12 12.5 Z"
            fill={CURSOR_CONFIG.arrowColor}
            stroke="white"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>

      <AnimatePresence>
        {clicks.map((click) => (
          <ClickBurstRings key={click.id} x={click.x} y={click.y} color={CURSOR_CONFIG.clickBurstColor} />
        ))}
      </AnimatePresence>
    </>
  )
}

function AmbientRing({ size, color, opacity, strokeWidth, delay, isPointer }) {
  const r = (size - strokeWidth) / 2
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: 'absolute',
        left: -(size / 2) + 2,
        top:  -(size / 2) + 2,
        zIndex: 1,
      }}
      animate={{
        scale:   isPointer ? [1, 1.2, 1] : [1, 1.08, 1],
        opacity: [opacity, opacity * 0.6, opacity],
      }}
      transition={{
        duration: 2.5,
        delay:    delay,
        repeat:   Infinity,
        ease:     'easeInOut',
      }}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </motion.svg>
  )
}

function ClickBurstRings({ x, y, color }) {
  const rings = [
    { delay: 0,    maxSize: 36, duration: 0.65 },
    { delay: 0.1,  maxSize: 56, duration: 0.75 },
    { delay: 0.2,  maxSize: 76, duration: 0.85 },
  ]

  return (
    <>
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          style={{
            position:      'fixed',
            left:          x,
            top:           y,
            zIndex:        99998,
            pointerEvents: 'none',
            translateX:    '-50%',
            translateY:    '-50%',
          }}
        >
          <motion.div
            style={{
              width:        ring.maxSize,
              height:       ring.maxSize,
              borderRadius: '50%',
              border:       `2px solid ${color}`,
              position:     'absolute',
              top:          '50%',
              left:         '50%',
              translateX:   '-50%',
              translateY:   '-50%',
            }}
            initial={{ scale: 0.1, opacity: 0.9 }}
            animate={{ scale: 1,   opacity: 0   }}
            exit={{}}
            transition={{
              duration: ring.duration,
              delay:    ring.delay,
              ease:     'easeOut',
            }}
          />
        </motion.div>
      ))}
    </>
  )
}
