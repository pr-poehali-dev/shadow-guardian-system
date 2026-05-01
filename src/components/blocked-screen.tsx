import { useEffect, useRef, useState } from "react"

export function BlockedScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [attempts, setAttempts] = useState(0)
  const [glitch, setGlitch] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [scanLine, setScanLine] = useState(0)

  // Matrix rain canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 18)
    const drops: number[] = Array(cols).fill(1)
    const chars = "アイウエオカキクケコ01アクセス拒否BLOCKED∑∆ΩΨΛ#$%@!<>01"

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = "14px JetBrains Mono, monospace"

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * 18
        const y = drops[i] * 18

        const isRed = Math.random() > 0.92
        ctx.fillStyle = isRed ? "#ef4444" : "rgba(239,68,68,0.25)"
        ctx.fillText(char, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 40)
    return () => clearInterval(interval)
  }, [])

  // Scan line animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 2) % 100)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // Random glitch
  useEffect(() => {
    const trigger = () => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 150 + Math.random() * 200)
    }
    const interval = setInterval(trigger, 2000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  // Show warning after click
  const handleClick = () => {
    setAttempts(prev => prev + 1)
    setGlitch(true)
    setShowWarning(true)
    setTimeout(() => setGlitch(false), 300)
    setTimeout(() => setShowWarning(false), 2000)
  }

  const ipAddr = "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255)

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        cursor: "not-allowed",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace",
        userSelect: "none",
      }}
    >
      {/* Matrix canvas */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, opacity: 0.4 }} />

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanLine}%`,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* CRT vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.8) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      {/* Horizontal glitch bars */}
      {glitch && (
        <>
          <div style={{
            position: "absolute",
            top: `${20 + Math.random() * 30}%`,
            left: 0, right: 0,
            height: 3 + Math.random() * 8,
            background: "rgba(239,68,68,0.6)",
            zIndex: 10,
            transform: `translateX(${-20 + Math.random() * 40}px)`,
          }} />
          <div style={{
            position: "absolute",
            top: `${50 + Math.random() * 30}%`,
            left: 0, right: 0,
            height: 2 + Math.random() * 5,
            background: "rgba(239,68,68,0.4)",
            zIndex: 10,
            transform: `translateX(${-30 + Math.random() * 60}px)`,
          }} />
        </>
      )}

      {/* Main content */}
      <div style={{
        position: "relative",
        zIndex: 5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}>
        {/* Top status bar */}
        <div style={{
          position: "absolute",
          top: 24,
          left: 32,
          right: 32,
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(239,68,68,0.5)",
          fontSize: 11,
          letterSpacing: 2,
        }}>
          <span>SYNAPSE_AI_OS v3.7.1</span>
          <span>INTRUSION_DETECTED :: {new Date().toISOString()}</span>
          <span>NODE: FIREWALL-01</span>
        </div>

        {/* Lock icon — ASCII art style */}
        <div style={{
          fontSize: 13,
          color: "rgba(239,68,68,0.7)",
          lineHeight: 1.4,
          marginBottom: 32,
          textAlign: "center",
          filter: glitch ? "blur(1px)" : "none",
          transition: "filter 0.1s",
        }}>
          <pre style={{ margin: 0 }}>{`
  ██████████
 ██        ██
██  ██████  ██
██  ██  ██  ██
██  ██████  ██
██          ██
 ██        ██
  ██████████`}</pre>
        </div>

        {/* Main text */}
        <div style={{
          textAlign: "center",
          transform: glitch ? `translate(${-3 + Math.random() * 6}px, 0)` : "none",
          transition: "transform 0.05s",
        }}>
          <div style={{
            color: "rgba(239,68,68,0.4)",
            fontSize: 12,
            letterSpacing: 8,
            marginBottom: 8,
            textTransform: "uppercase",
          }}>
            // ДОСТУП ЗАПРЕЩЁН //
          </div>

          <h1 style={{
            margin: 0,
            fontSize: "clamp(36px, 8vw, 80px)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            lineHeight: 1,
            color: "#ef4444",
            textShadow: glitch
              ? "4px 0 #00ffff, -4px 0 #ff00ff, 0 0 20px rgba(239,68,68,0.8)"
              : "0 0 40px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.3)",
          }}>
            ВЫ ЗАБЛОКИРОВАНЫ
          </h1>

          <div style={{
            color: "rgba(239,68,68,0.5)",
            fontSize: 12,
            letterSpacing: 6,
            marginTop: 8,
          }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
        </div>

        {/* Info block */}
        <div style={{
          marginTop: 32,
          color: "rgba(239,68,68,0.6)",
          fontSize: 13,
          letterSpacing: 1,
          textAlign: "center",
          lineHeight: 2,
        }}>
          <div>IP: <span style={{ color: "#ef4444" }}>{ipAddr}</span> — ЗАФИКСИРОВАН</div>
          <div>ПОПЫТКИ ДОСТУПА: <span style={{ color: "#ef4444" }}>{attempts}</span></div>
          <div style={{ color: "rgba(239,68,68,0.35)", fontSize: 11, marginTop: 4 }}>
            [НЕЙРОННЫЙ ИНТЕРФЕЙС ДЕАКТИВИРОВАН]
          </div>
        </div>

        {/* Warning flash */}
        {showWarning && (
          <div style={{
            position: "absolute",
            bottom: 100,
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.5)",
            color: "#ef4444",
            padding: "12px 32px",
            fontSize: 13,
            letterSpacing: 3,
            animation: "fadeInOut 2s ease",
          }}>
            ⚠ ПОПЫТКА №{attempts} ЗАРЕГИСТРИРОВАНА
          </div>
        )}

        {/* Bottom bar */}
        <div style={{
          position: "absolute",
          bottom: 24,
          left: 32,
          right: 32,
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(239,68,68,0.3)",
          fontSize: 10,
          letterSpacing: 2,
        }}>
          <span>FIREWALL: ACTIVE</span>
          <span>████████████████████ 100%</span>
          <span>SEC_LEVEL: MAXIMUM</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
