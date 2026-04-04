'use client'

import { motion } from 'framer-motion'
import { Clock, Zap, Heart, Database } from 'lucide-react'

interface BenefitsProps {
  onNavigate: (page: string) => void
}

const benefits = [
  {
    icon: Clock,
    title: 'Reduce Wait Times',
    description:
      'Cut average patient waiting time by up to 40% with AI-driven queue optimization.',
    color: 'text-mars',
    bg: 'bg-mars/10',
  },
  {
    icon: Zap,
    title: 'Improve Efficiency',
    description:
      'Optimize resource allocation across all departments with intelligent scheduling.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Heart,
    title: 'Better Experience',
    description:
      'Enhance patient satisfaction with transparent wait estimates and smooth flow.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
  {
    icon: Database,
    title: 'Data-Driven',
    description:
      'Make informed decisions with real-time analytics and comprehensive reporting.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export default function Benefits({ onNavigate: _onNavigate }: BenefitsProps) {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">CareQueue</span>?
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">
            Transform your healthcare facility with measurable improvements in patient care and operational efficiency.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-panel border border-white/5 rounded-xl p-6 sm:p-8 card-hover group"
            >
              <div className="flex items-start gap-5">
                <div
                  className={`w-12 h-12 rounded-lg ${benefit.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <benefit.icon size={24} className={benefit.color} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
