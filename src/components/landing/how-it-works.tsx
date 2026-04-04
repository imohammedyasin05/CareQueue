'use client'

import { motion } from 'framer-motion'
import { FileText, Cpu, TrendingUp, ArrowRight } from 'lucide-react'

interface HowItWorksProps {
  onNavigate: (page: string) => void
}

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Input Data',
    description:
      'Enter patient count, doctor availability, and average consultation time into the system.',
    color: 'bg-mars/10 border-mars/20',
    iconColor: 'text-mars',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI Processing',
    description:
      'Our algorithm analyzes multiple factors to predict optimal queue patterns and resource allocation.',
    color: 'bg-blue-400/10 border-blue-400/20',
    iconColor: 'text-blue-400',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Get Results',
    description:
      'Receive instant predictions with actionable insights to reduce wait times and improve efficiency.',
    color: 'bg-emerald-400/10 border-emerald-400/20',
    iconColor: 'text-emerald-400',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function HowItWorks({ onNavigate: _onNavigate }: HowItWorksProps) {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mars/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">
            Three simple steps to optimize your hospital&apos;s queue system.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              <div className="bg-panel border border-white/5 rounded-xl p-6 sm:p-8 h-full card-hover">
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading text-4xl font-bold text-white/5">
                    {step.number}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-lg ${step.color} border flex items-center justify-center`}
                  >
                    <step.icon size={22} className={step.iconColor} />
                  </div>
                </div>

                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector arrow (visible on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                  <ArrowRight size={20} className="text-mars/40" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
