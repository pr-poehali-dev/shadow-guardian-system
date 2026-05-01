import { useEffect, useRef, useState, useCallback } from "react"

type Stage = "blocked" | "hacking" | "unlocked"

const CORRECT_PASSWORD = "SYNAPSE"
const HACK_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@!%"

export function BlockedScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [attempts, setAttempts] = useState(0)
  const [glitch, setGlitch] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [scanLine, setScanLine] = useState(0)
  const [stage, setStage] = useState<Stage>("blocked")
  const [input, setInput] = useState("")
  const [inputError, setInputError] = useState(false)
  const [hackProgress, setHackProgress] = useState(0)
  const [hackDisplay, setHackDisplay] = useState("_______")
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [showInput, setShowInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const ipAddr = useRef(
    "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255)
  )

  // Matrix rain
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
      ctx.fillStyle = stage === "unlocked" ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = "14px JetBrains Mono, monospace"
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * 18
        const y = drops[i] * 18
        const isHighlight = Math.random() > 0.92
        if (stage === "unlocked") {
          ctx.fillStyle = isHighlight ? "#22c55e" : "rgba(34,197,94,0.2)"
        } else {
          ctx.fillStyle = isHighlight ? "#ef4444" : "rgba(239,68,68,0.2)"
        }
        ctx.fillText(char, x, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }
    const interval = setInterval(draw, 40)
    return () => clearInterval(interval)
  }, [stage])

  // Scan line
  useEffect(() => {
    const interval = setInterval(() => setScanLine(prev => (prev + 2) % 100), 16)
    return () => clearInterval(interval)
  }, [])

  // Random glitch
  useEffect(() => {
    if (stage === "unlocked") return
    const trigger = () => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 150 + Math.random() * 200)
    }
    const interval = setInterval(trigger, 2000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [stage])

  // Hacking animation
  const startHack = useCallback(() => {
    setStage("hacking")
    setHackProgress(0)
    setHackDisplay("_______")
    const lines: string[] = []
    const addLine = (line: string, delay: number) => {
      setTimeout(() => setTerminalLines(prev => [...prev, line]), delay)
    }
    addLine("> ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА ВЗЛОМА...", 0)
    addLine("> СКАНИРОВАНИЕ НЕЙРОСЕТЕВЫХ ПОРТОВ...", 600)
    addLine("> ОБХОД ФАЙРВОЛА: [████░░░░░░] 40%", 1200)
    addLine("> ОБХОД ФАЙРВОЛА: [████████░░] 80%", 1800)
    addLine("> ФАЙРВОЛ ОБОЙДЕН ✓", 2400)
    addLine("> БРУТФОРС ПАРОЛЯ ЗАПУЩЕН...", 3000)

    // Animate password cracking
    let progress = 0
    const cracked: string[] = Array(CORRECT_PASSWORD.length).fill("_")
    const hackInterval = setInterval(() => {
      progress++
      setHackProgress((progress / (CORRECT_PASSWORD.length * 18)) * 100)

      const charIndex = Math.floor((progress - 1) / 18)
      if (charIndex < CORRECT_PASSWORD.length) {
        if (progress % 18 === 0) {
          cracked[charIndex] = CORRECT_PASSWORD[charIndex]
        } else {
          const temp = [...cracked]
          temp[charIndex] = HACK_CHARS[Math.floor(Math.random() * HACK_CHARS.length)]
          setHackDisplay(temp.join(" "))
          return
        }
      }
      setHackDisplay(cracked.join(" "))

      if (progress >= CORRECT_PASSWORD.length * 18) {
        clearInterval(hackInterval)
        setTimeout(() => {
          setTerminalLines(prev => [...prev, "> ПАРОЛЬ НАЙДЕН: " + CORRECT_PASSWORD + " ✓"])
          setTimeout(() => {
            setTerminalLines(prev => [...prev, "> ДОСТУП РАЗРЕШЁН. ДОБРО ПОЖАЛОВАТЬ."])
            setTimeout(() => setStage("unlocked"), 800)
          }, 600)
        }, 200)
      }
    }, 80)

    return () => clearInterval(hackInterval)
  }, [])

  const handleClick = () => {
    if (stage === "hacking" || stage === "unlocked") return
    setAttempts(prev => prev + 1)
    setGlitch(true)
    setShowWarning(true)
    setShowInput(true)
    setTimeout(() => setGlitch(false), 300)
    setTimeout(() => setShowWarning(false), 2000)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.toUpperCase() === CORRECT_PASSWORD) {
      startHack()
    } else {
      setInputError(true)
      setGlitch(true)
      setTimeout(() => { setInputError(false); setGlitch(false) }, 600)
      setInput("")
    }
  }

  const accentColor = stage === "unlocked" ? "#22c55e" : "#ef4444"
  const accentRgb = stage === "unlocked" ? "34,197,94" : "239,68,68"

  if (stage === "unlocked") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, background: "#000",
        overflow: "hidden", fontFamily: "'JetBrains Mono', monospace",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeUnlock 0.5s ease",
      }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
        <div style={{ position: "relative", zIndex: 5, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "rgba(34,197,94,0.8)", lineHeight: 1.4, marginBottom: 24 }}>
            <pre style={{ margin: 0 }}>{`
  ████████████
 ██  ██    ██
██   ██    ██
██   ██    ██
 ██  ██████
  ████████████`}</pre>
          </div>
          <h1 style={{
            margin: 0, fontSize: "clamp(32px, 7vw, 72px)", fontWeight: 900,
            color: "#22c55e", letterSpacing: "0.05em",
            textShadow: "0 0 40px rgba(34,197,94,0.8), 0 0 80px rgba(34,197,94,0.4)",
            animation: "glowPulse 2s ease infinite",
          }}>
            ДОСТУП РАЗРЕШЁН
          </h1>
          <p style={{ color: "rgba(34,197,94,0.6)", marginTop: 16, fontSize: 14, letterSpacing: 3 }}>
            НЕЙРОИНТЕРФЕЙС АКТИВИРОВАН
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 32, padding: "12px 40px", background: "transparent",
              border: "1px solid #22c55e", color: "#22c55e", fontSize: 13,
              letterSpacing: 3, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.background = "rgba(34,197,94,0.15)"
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.background = "transparent"
            }}
          >
            [ ВОЙТИ В СИСТЕМУ ]
          </button>
        </div>
        <style>{`
          @keyframes fadeUnlock { from { opacity: 0; } to { opacity: 1; } }
          @keyframes glowPulse {
            0%, 100% { text-shadow: 0 0 40px rgba(34,197,94,0.8), 0 0 80px rgba(34,197,94,0.4); }
            50% { text-shadow: 0 0 60px rgba(34,197,94,1), 0 0 120px rgba(34,197,94,0.6); }
          }
        `}</style>
      </div>
    )
  }

  if (stage === "hacking") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, background: "#000",
        overflow: "hidden", fontFamily: "'JetBrains Mono', monospace",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, opacity: 0.25 }} />
        <div style={{ position: "relative", zIndex: 5, width: "90%", maxWidth: 600 }}>
          {/* Terminal window */}
          <div style={{
            border: "1px solid rgba(239,68,68,0.4)", background: "rgba(0,0,0,0.9)",
          }}>
            <div style={{
              padding: "8px 16px", borderBottom: "1px solid rgba(239,68,68,0.3)",
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(239,68,68,0.05)",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(239,68,68,0.3)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(239,68,68,0.3)" }} />
              <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(239,68,68,0.5)", letterSpacing: 2 }}>
                SYNAPSE_HACK_TERMINAL v1.0
              </span>
            </div>
            <div style={{ padding: 24, minHeight: 200 }}>
              {terminalLines.map((line, i) => (
                <div key={i} style={{
                  color: line.includes("✓") ? "#22c55e" : "rgba(239,68,68,0.8)",
                  fontSize: 13, lineHeight: 2, letterSpacing: 1,
                  animation: "typeIn 0.3s ease",
                }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Password crack display */}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(239,68,68,0.5)", letterSpacing: 3, marginBottom: 12 }}>
              ПЕРЕБОР КОМБИНАЦИЙ
            </div>
            <div style={{
              fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 900, letterSpacing: "0.3em",
              color: "#ef4444", textShadow: "0 0 20px rgba(239,68,68,0.6)",
              minHeight: 60, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {hackDisplay}
            </div>
            {/* Progress bar */}
            <div style={{
              marginTop: 16, height: 4, background: "rgba(239,68,68,0.15)",
              borderRadius: 2, overflow: "hidden",
            }}>
              <div style={{
                height: "100%", width: `${hackProgress}%`,
                background: "linear-gradient(90deg, #ef4444, #ff6b6b)",
                transition: "width 0.1s linear",
                boxShadow: "0 0 10px rgba(239,68,68,0.8)",
              }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "rgba(239,68,68,0.5)", letterSpacing: 2 }}>
              {Math.round(hackProgress)}%
            </div>
          </div>
        </div>
        <style>{`@keyframes typeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }`}</style>
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed", inset: 0, zIndex: 9999, background: "#000",
        cursor: "not-allowed", overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace", userSelect: "none",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, opacity: 0.4 }} />

      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: `${scanLine}%`,
        height: 2, background: `linear-gradient(90deg, transparent, rgba(${accentRgb},0.3), transparent)`,
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.85) 100%)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Glitch bars */}
      {glitch && (
        <>
          <div style={{
            position: "absolute", top: `${20 + Math.random() * 30}%`,
            left: 0, right: 0, height: 3 + Math.random() * 8,
            background: `rgba(${accentRgb},0.6)`, zIndex: 10,
            transform: `translateX(${-20 + Math.random() * 40}px)`,
          }} />
          <div style={{
            position: "absolute", top: `${50 + Math.random() * 30}%`,
            left: 0, right: 0, height: 2 + Math.random() * 5,
            background: `rgba(${accentRgb},0.4)`, zIndex: 10,
            transform: `translateX(${-30 + Math.random() * 60}px)`,
          }} />
        </>
      )}

      <div style={{
        position: "relative", zIndex: 5, height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* Top bar */}
        <div style={{
          position: "absolute", top: 24, left: 32, right: 32,
          display: "flex", justifyContent: "space-between",
          color: `rgba(${accentRgb},0.5)`, fontSize: 11, letterSpacing: 2,
        }}>
          <span>SYNAPSE_AI_OS v3.7.1</span>
          <span>INTRUSION_DETECTED :: {new Date().toISOString()}</span>
          <span>NODE: FIREWALL-01</span>
        </div>

        {/* ASCII lock */}
        <div style={{
          fontSize: 13, color: `rgba(${accentRgb},0.7)`,
          lineHeight: 1.4, marginBottom: 32, textAlign: "center",
          filter: glitch ? "blur(1px)" : "none", transition: "filter 0.1s",
        }}>
          <pre style={{ margin: 0 }}>{`  ██████████
 ██        ██
██  ██████  ██
██  ██  ██  ██
██  ██████  ██
██          ██
 ██        ██
  ██████████`}</pre>
        </div>

        {/* Main title */}
        <div style={{
          textAlign: "center",
          transform: glitch ? `translate(${-3 + Math.random() * 6}px, 0)` : "none",
          transition: "transform 0.05s",
        }}>
          <div style={{ color: `rgba(${accentRgb},0.4)`, fontSize: 12, letterSpacing: 8, marginBottom: 8 }}>
            // ДОСТУП ЗАПРЕЩЁН //
          </div>
          <h1 style={{
            margin: 0, fontSize: "clamp(36px, 8vw, 80px)", fontWeight: 900,
            letterSpacing: "0.05em", lineHeight: 1, color: accentColor,
            textShadow: glitch
              ? "4px 0 #00ffff, -4px 0 #ff00ff, 0 0 20px rgba(239,68,68,0.8)"
              : `0 0 40px rgba(${accentRgb},0.6), 0 0 80px rgba(${accentRgb},0.3)`,
          }}>
            ВЫ ЗАБЛОКИРОВАНЫ
          </h1>
          <div style={{ color: `rgba(${accentRgb},0.4)`, fontSize: 12, letterSpacing: 6, marginTop: 8 }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
        </div>

        {/* Info */}
        <div style={{
          marginTop: 24, color: `rgba(${accentRgb},0.6)`,
          fontSize: 13, letterSpacing: 1, textAlign: "center", lineHeight: 2,
        }}>
          <div>IP: <span style={{ color: accentColor }}>{ipAddr.current}</span> — ЗАФИКСИРОВАН</div>
          <div>ПОПЫТКИ ДОСТУПА: <span style={{ color: accentColor }}>{attempts}</span></div>
          <div style={{ color: `rgba(${accentRgb},0.35)`, fontSize: 11, marginTop: 4 }}>
            [НЕЙРОННЫЙ ИНТЕРФЕЙС ДЕАКТИВИРОВАН]
          </div>
        </div>

        {/* Password input */}
        {showInput && (
          <form
            onSubmit={handleSubmit}
            onClick={e => e.stopPropagation()}
            style={{ marginTop: 28, textAlign: "center", cursor: "default" }}
          >
            <div style={{ fontSize: 11, color: `rgba(${accentRgb},0.5)`, letterSpacing: 3, marginBottom: 10 }}>
              ВВЕДИТЕ КОД ДОСТУПА
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: `rgba(${accentRgb},0.6)`, fontSize: 16 }}>▶</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value.toUpperCase())}
                maxLength={10}
                autoComplete="off"
                spellCheck={false}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${inputError ? "#ff0000" : `rgba(${accentRgb},0.5)`}`,
                  color: inputError ? "#ff0000" : accentColor,
                  fontSize: 20, letterSpacing: 6, fontFamily: "inherit",
                  outline: "none", width: 180, textAlign: "center",
                  padding: "4px 0",
                  textShadow: `0 0 10px rgba(${accentRgb},0.6)`,
                  cursor: "text",
                  animation: inputError ? "shake 0.3s ease" : "none",
                }}
              />
            </div>
            {inputError && (
              <div style={{ color: "#ff0000", fontSize: 11, letterSpacing: 2, marginTop: 8 }}>
                НЕВЕРНЫЙ КОД — ПОПЫТКА ЗАПИСАНА
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 10, color: `rgba(${accentRgb},0.3)`, letterSpacing: 1 }}>
              нажмите Enter для подтверждения
            </div>
          </form>
        )}

        {/* Warning flash */}
        {showWarning && !showInput && (
          <div style={{
            position: "absolute", bottom: 100,
            background: `rgba(${accentRgb},0.1)`,
            border: `1px solid rgba(${accentRgb},0.5)`,
            color: accentColor, padding: "12px 32px",
            fontSize: 13, letterSpacing: 3,
            animation: "fadeInOut 2s ease",
          }}>
            ⚠ НАЖМИТЕ ДЛЯ ВВОДА КОДА ДОСТУПА
          </div>
        )}

        {/* Bottom bar */}
        <div style={{
          position: "absolute", bottom: 24, left: 32, right: 32,
          display: "flex", justifyContent: "space-between",
          color: `rgba(${accentRgb},0.3)`, fontSize: 10, letterSpacing: 2,
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}
