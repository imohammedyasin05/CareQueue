'use client'

import { motion } from 'framer-motion'
import { Brain, BarChart3, CalendarClock, Users } from 'lucide-react'

interface FeaturesProps {
  onNavigate: (page: string) => void
}

const features = [
  {
    icon: Brain,
    title: 'AI Prediction',
    description:
      'Predict patient wait times with machine learning algorithms trained on real hospital data patterns.',
    color: 'text-mars',
    bg: 'bg-mars/10',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Monitor hospital flow with live dashboards showing queue status, bottlenecks, and resource utilization.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: CalendarClock,
    title: 'Smart Scheduling',
    description:
      'Optimize doctor schedules for maximum efficiency with AI-driven appointment allocation.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  {
    icon: Users,
    title: 'Queue Management',
    description:
      'Streamline patient flow across departments with intelligent queue routing and priority assignment.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export default function Features({ onNavigate: _onNavigate }: FeaturesProps) {
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
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to transform hospital queue management with intelligent automation.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-panel border border-white/5 rounded-xl p-6 card-hover group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={24} className={feature.color} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
