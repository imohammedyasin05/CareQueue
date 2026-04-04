'use client'

import { motion } from 'framer-motion'
import { Activity, Heart, Shield, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onNavigate: (page: string) => void
}

const floatingIcons = [
  { Icon: Activity, x: '10%', y: '20%', delay: 0, size: 20 },
  { Icon: Heart, x: '85%', y: '15%', delay: 1, size: 24 },
  { Icon: Shield, x: '75%', y: '70%', delay: 2, size: 18 },
  { Icon: Sparkles, x: '15%', y: '75%', delay: 0.5, size: 16 },
  { Icon: Activity, x: '90%', y: '45%', delay: 1.5, size: 14 },
  { Icon: Heart, x: '5%', y: '50%', delay: 2.5, size: 22 },
]

const decorativeCircles = [
  { x: '20%', y: '30%', size: 120, opacity: 0.03 },
  { x: '70%', y: '20%', size: 200, opacity: 0.02 },
  { x: '60%', y: '70%', size: 160, opacity: 0.025 },
]

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Decorative gradient orbs */}
      {decorativeCircles.map((circle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-mars"
          style={{
            left: circle.x,
            top: circle.y,
            width: circle.size,
            height: circle.size,
            opacity: circle.opacity,
            filter: 'blur(60px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Floating healthcare icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-mars/20"
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [1, 1.1, 1],
            y: [0, -12, 0],
          }}
          transition={{
            duration: 5 + i * 0.5,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mars/10 border border-mars/20 mb-8">
            <Activity size={14} className="text-mars" />
            <span className="text-xs font-medium text-mars tracking-wide uppercase">
              AI-Powered Healthcare
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="gradient-text">Smart Hospital Queue</span>
          <br />
          <span className="text-white">Optimization</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="font-heading text-lg sm:text-xl md:text-2xl text-text-muted font-medium mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Reducing Patient Wait Time Using AI
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base text-text-muted/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          CareQueue uses advanced machine learning algorithms to predict patient wait times,
          optimize doctor scheduling, and streamline hospital workflows — so your patients
          spend less time waiting and more time receiving care.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={() => onNavigate('dashboard')}
            className="btn-glow bg-mars hover:bg-mars-hover text-white font-semibold px-8 py-3 text-base rounded-xl"
          >
            Get Started
            <ArrowRight size={18} />
          </Button>
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium px-8 py-3 text-base rounded-xl"
            onClick={() => onNavigate('dashboard')}
          >
            View Dashboard
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { value: '40%', label: 'Wait Time Reduced' },
            { value: '99.2%', label: 'Prediction Accuracy' },
            { value: '3x', label: 'Faster Scheduling' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-heading text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-space to-transparent" />
    </section>
  )
}
