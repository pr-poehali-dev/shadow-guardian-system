import { useEffect, useState } from "react"
import { Hero3DWebGL as Hero3D } from "@/components/hero-webgl"
import { FeaturesSection } from "@/components/features-section"
import { TechnologySection } from "@/components/technology-section"
import { ApplicationsTimeline } from "@/components/applications-timeline"
import { AboutSection } from "@/components/about-section"
import { SafetySection } from "@/components/safety-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Index() {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setBlocked(true)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="dark">
      {blocked && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
            <h1 style={{ color: "#ef4444", fontSize: 48, fontWeight: 800, letterSpacing: 2, margin: 0 }}>
              ВЫ ЗАБЛОКИРОВАНЫ
            </h1>
            <p style={{ color: "#888", marginTop: 12, fontSize: 18 }}>Доступ к этому разделу ограничен</p>
          </div>
        </div>
      )}
      <Navbar />
      <main>
        <Hero3D />
        <FeaturesSection />
        <section id="technology">
          <TechnologySection />
        </section>
        <ApplicationsTimeline />
        <AboutSection />
        <section id="safety">
          <SafetySection />
        </section>
        <TestimonialsSection />
        <section id="faq">
          <FAQSection />
        </section>
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}