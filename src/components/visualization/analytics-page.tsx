'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Stethoscope,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface Prediction {
  id: string
  patients: number
  doctors: number
  avgConsultationTime: number
  estimatedWaitTime: number
  queueStatus: 'Low' | 'Medium' | 'High'
  timestamp: string
}

interface Doctor {
  id: string
  name: string
  specialty: string
  status: string
  patientsToday: number
  maxPatients: number
  createdAt: string
  updatedAt: string
}

interface AnalyticsPageProps {
  onNavigate: (page: string) => void
}

// Sample data for fallback
const SAMPLE_PREDICTIONS: Prediction[] = [
  { id: 's1', patients: 12, doctors: 5, avgConsultationTime: 15, estimatedWaitTime: 18, queueStatus: 'Low', timestamp: new Date(Date.now() - 3600000 * 8).toISOString() },
  { id: 's2', patients: 18, doctors: 5, avgConsultationTime: 18, estimatedWaitTime: 27, queueStatus: 'Medium', timestamp: new Date(Date.now() - 3600000 * 7).toISOString() },
  { id: 's3', patients: 25, doctors: 5, avgConsultationTime: 20, estimatedWaitTime: 42, queueStatus: 'High', timestamp: new Date(Date.now() - 3600000 * 6).toISOString() },
  { id: 's4', patients: 20, doctors: 6, avgConsultationTime: 16, estimatedWaitTime: 30, queueStatus: 'Medium', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 's5', patients: 30, doctors: 5, avgConsultationTime: 22, estimatedWaitTime: 55, queueStatus: 'High', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 's6', patients: 15, doctors: 6, avgConsultationTime: 14, estimatedWaitTime: 20, queueStatus: 'Low', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 's7', patients: 22, doctors: 5, avgConsultationTime: 19, estimatedWaitTime: 38, queueStatus: 'Medium', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 's8', patients: 28, doctors: 5, avgConsultationTime: 21, estimatedWaitTime: 48, queueStatus: 'High', timestamp: new Date(Date.now() - 3600000 * 1).toISOString() },
  { id: 's9', patients: 16, doctors: 7, avgConsultationTime: 15, estimatedWaitTime: 22, queueStatus: 'Low', timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString() },
  { id: 's10', patients: 24, doctors: 6, avgConsultationTime: 17, estimatedWaitTime: 35, queueStatus: 'Medium', timestamp: new Date().toISOString() },
]

const SAMPLE_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Chen', specialty: 'General Medicine', status: 'active', patientsToday: 22, maxPatients: 30, createdAt: '', updatedAt: '' },
  { id: 'd2', name: 'Dr. James Wilson', specialty: 'Cardiology', status: 'active', patientsToday: 28, maxPatients: 30, createdAt: '', updatedAt: '' },
  { id: 'd3', name: 'Dr. Maria Garcia', specialty: 'Pediatrics', status: 'active', patientsToday: 15, maxPatients: 25, createdAt: '', updatedAt: '' },
  { id: 'd4', name: 'Dr. Robert Kim', specialty: 'Orthopedics', status: 'active', patientsToday: 18, maxPatients: 20, createdAt: '', updatedAt: '' },
  { id: 'd5', name: 'Dr. Emily Brown', specialty: 'Neurology', status: 'break', patientsToday: 12, maxPatients: 25, createdAt: '', updatedAt: '' },
]

const STATUS_COLORS = {
  Low: '#4ade80',
  Medium: '#fbbf24',
  High: '#ff3b3b',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])
  return count
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; payload?: Record<string, unknown> }>; label?: string | number }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-panel-light border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-sm">
      <p className="text-white font-medium text-sm mb-1.5">{label != null ? String(label) : ''}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-text-muted">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
      {payload[0]?.payload?.queueStatus && (
        <div className="mt-1.5 pt-1.5 border-t border-white/5">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${STATUS_COLORS[payload[0].payload.queueStatus as keyof typeof STATUS_COLORS]}20`,
              color: STATUS_COLORS[payload[0].payload.queueStatus as keyof typeof STATUS_COLORS],
            }}
          >
            {String(payload[0].payload.queueStatus)}
          </span>
        </div>
      )}
    </div>
  )
}

// Custom pie tooltip
function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { name: string; value: number; fill: string } }> }) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0]
  return (
    <div className="bg-panel-light border border-white/10 rounded-lg p-3 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }} />
        <span className="text-white text-sm font-medium">{data.payload.name}</span>
      </div>
      <p className="text-text-muted text-xs mt-1">{data.value} predictions</p>
    </div>
  )
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-72 mx-auto rounded-lg" />
        <Skeleton className="h-5 w-96 mx-auto rounded-lg" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      {/* Main chart */}
      <Skeleton className="h-96 rounded-2xl" />
      {/* Two col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
      {/* Metrics */}
      <Skeleton className="h-48 rounded-2xl" />
      {/* Doctor workload */}
      <Skeleton className="h-72 rounded-2xl" />
    </motion.div>
  )
}

// Metric card with animated counter
function MetricCard({ metric }: { metric: { label: string; value: number; suffix: string; icon: React.ElementType; color: string; progress: number } }) {
  const Icon = metric.icon
  const animatedValue = useAnimatedCounter(metric.value)
  return (
    <div className="bg-panel-light rounded-xl border border-white/5 p-5 flex items-center gap-4">
      <div className="relative shrink-0">
        <ProgressRing value={metric.progress} max={100} color={metric.color} size={56} strokeWidth={4} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-4 h-4" style={{ color: metric.color }} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-text-muted text-xs truncate">{metric.label}</p>
        <p className="text-white text-xl font-bold">
          {animatedValue}
          {metric.suffix && (
            <span className="text-text-muted text-xs font-normal ml-1">{metric.suffix}</span>
          )}
        </p>
        {/* Mini progress bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: metric.color }}
            initial={{ width: 0 }}
            animate={{ width: `${metric.progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

// Progress Ring component
function ProgressRing({ value, max, color, size = 60, strokeWidth = 5 }: { value: number; max: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = Math.min(value / max, 1)
  const offset = circumference - progress * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

// Stat card component
function StatCard({ icon: Icon, label, value, suffix = '', color = '#ff3b3b' }: { icon: React.ElementType; label: string; value: number; suffix?: string; color?: string }) {
  const animatedValue = useAnimatedCounter(value)
  return (
    <motion.div
      variants={itemVariants}
      className="bg-panel rounded-xl border border-white/5 p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="text-text-muted text-sm mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">
        {animatedValue}
        {suffix && <span className="text-text-muted text-base font-normal ml-1">{suffix}</span>}
      </p>
    </motion.div>
  )
}

export default function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [useSampleData, setUseSampleData] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [historyRes, doctorsRes] = await Promise.all([
        fetch('/api/history'),
        fetch('/api/doctors'),
      ])

      const historyData = historyRes.ok ? await historyRes.json() : []
      const doctorsData = doctorsRes.ok ? await doctorsRes.json() : []

      if (historyData && historyData.length > 0) {
        setPredictions(historyData)
        setUseSampleData(false)
      } else {
        setPredictions(SAMPLE_PREDICTIONS)
        setUseSampleData(true)
      }

      if (doctorsData && doctorsData.length > 0) {
        setDoctors(doctorsData)
      } else {
        setDoctors(SAMPLE_DOCTORS)
        setUseSampleData(true)
      }
    } catch {
      setPredictions(SAMPLE_PREDICTIONS)
      setDoctors(SAMPLE_DOCTORS)
      setUseSampleData(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Compute analytics
  const totalPredictions = predictions.length
  const avgWaitTime = predictions.length > 0
    ? Math.round(predictions.reduce((sum, p) => sum + p.estimatedWaitTime, 0) / predictions.length)
    : 0
  const peakQueueLoad = predictions.length > 0
    ? Math.max(...predictions.map(p => p.patients))
    : 0
  const bestWait = predictions.length > 0 ? Math.min(...predictions.map(p => p.estimatedWaitTime)) : 0
  const worstWait = predictions.length > 0 ? Math.max(...predictions.map(p => p.estimatedWaitTime)) : 0
  const totalDoctors = doctors.length
  const totalPatientsAvg = predictions.length > 0
    ? Math.round(predictions.reduce((sum, p) => sum + p.patients, 0) / predictions.length)
    : 0
  const efficiencyScore = totalPatientsAvg > 0 ? Math.min(Math.round((totalDoctors / totalPatientsAvg) * 100), 100) : 0

  // Queue status distribution
  const statusCounts = predictions.reduce(
    (acc, p) => {
      acc[p.queueStatus] = (acc[p.queueStatus] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const pieData = [
    { name: 'Low', value: statusCounts['Low'] || 0, fill: STATUS_COLORS.Low },
    { name: 'Medium', value: statusCounts['Medium'] || 0, fill: STATUS_COLORS.Medium },
    { name: 'High', value: statusCounts['High'] || 0, fill: STATUS_COLORS.High },
  ].filter(d => d.value > 0)

  // Scatter/composed chart data
  const scatterData = predictions.map(p => ({
    patients: p.patients,
    waitTime: p.estimatedWaitTime,
    queueStatus: p.queueStatus,
    name: `${p.patients} patients`,
  }))

  // Area chart data - sorted by timestamp
  const trendData = [...predictions]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(p => ({
      time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitTime: p.estimatedWaitTime,
      patients: p.patients,
      queueStatus: p.queueStatus,
    }))

  // Doctor workload data
  const doctorWorkload = doctors.map(d => ({
    name: d.name.replace('Dr. ', ''),
    specialty: d.specialty,
    patients: d.patientsToday,
    capacity: d.maxPatients,
    utilization: Math.round((d.patientsToday / d.maxPatients) * 100),
  }))

  // Performance metrics
  const metrics = [
    {
      label: 'Efficiency Score',
      value: efficiencyScore,
      suffix: '%',
      icon: Zap,
      color: efficiencyScore >= 70 ? '#4ade80' : efficiencyScore >= 40 ? '#fbbf24' : '#ff3b3b',
      progress: efficiencyScore,
    },
    {
      label: 'Best Case Wait',
      value: bestWait,
      suffix: ' min',
      icon: CheckCircle2,
      color: '#4ade80',
      progress: Math.round(((100 - bestWait) / 100) * 100),
    },
    {
      label: 'Worst Case Wait',
      value: worstWait,
      suffix: ' min',
      icon: AlertTriangle,
      color: worstWait > 40 ? '#ff3b3b' : worstWait > 20 ? '#fbbf24' : '#4ade80',
      progress: Math.min(worstWait, 100),
    },
    {
      label: 'Prediction Count',
      value: totalPredictions,
      suffix: '',
      icon: Activity,
      color: '#ff3b3b',
      progress: Math.min(totalPredictions * 10, 100),
    },
  ]

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    if (percent < 0.05) return null
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key="analytics"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Analytics & Visualization</h1>
            <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
              Data-driven insights for hospital queue optimization
            </p>
          </motion.div>

          {/* Sample data notice */}
          {useSampleData && (
            <motion.div
              variants={itemVariants}
              className="bg-panel-light border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3 max-w-3xl mx-auto"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
              <p className="text-sm text-text-muted">
                Showing sample data.{' '}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-mars hover:text-mars-hover font-medium transition-colors"
                >
                  Run predictions from the Dashboard
                </button>{' '}
                to see real data.
              </p>
            </motion.div>
          )}

          {/* Summary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={BarChart3} label="Total Predictions" value={totalPredictions} color="#ff3b3b" />
            <StatCard icon={Clock} label="Average Wait Time" value={avgWaitTime} suffix="min" color="#fbbf24" />
            <StatCard icon={Users} label="Peak Queue Load" value={peakQueueLoad} suffix="patients" color="#4ade80" />
          </div>

          {/* Main Chart - Patient Load vs Wait Time */}
          <motion.div
            variants={itemVariants}
            className="bg-panel rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-mars/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-mars" />
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Patient Load vs Wait Time</h2>
                <p className="text-text-muted text-xs">Correlation between patient count and estimated wait time</p>
              </div>
            </div>

            <div className="w-full h-[350px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={scatterData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="patients"
                    type="number"
                    tick={{ fill: '#b0b3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    label={{ value: 'Number of Patients', position: 'insideBottom', offset: -2, fill: '#b0b3b8', fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="waitTime"
                    type="number"
                    tick={{ fill: '#b0b3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    label={{ value: 'Wait Time (min)', angle: -90, position: 'insideLeft', offset: 10, fill: '#b0b3b8', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 12 }}
                    formatter={(value: string) => <span className="text-text-muted text-xs">{value}</span>}
                  />
                  <Bar dataKey="patients" fill="#ff3b3b" opacity={0.15} radius={[4, 4, 0, 0]} barSize={24} name="Patients" />
                  <Line
                    type="monotone"
                    dataKey="waitTime"
                    stroke="#ff6b6b"
                    strokeWidth={2.5}
                    dot={(props: { cx: number; cy: number; index: number; payload: { queueStatus: string } }) => {
                      const { cx, cy, index, payload } = props
                      const color = STATUS_COLORS[payload.queueStatus as keyof typeof STATUS_COLORS] || '#b0b3b8'
                      return (
                        <circle
                          key={`dot-${index}`}
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill={color}
                          stroke="#1a1c22"
                          strokeWidth={2}
                        />
                      )
                    }}
                    activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                    name="Wait Time"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Color legend for status */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-text-muted text-xs">{status} Queue</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Two column: Pie Chart + Area Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Queue Status Distribution */}
            <motion.div
              variants={itemVariants}
              className="bg-panel rounded-2xl border border-white/5 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Queue Status Distribution</h2>
                  <p className="text-text-muted text-xs">Breakdown of queue load categories</p>
                </div>
              </div>

              {pieData.length > 0 ? (
                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[260px] flex items-center justify-center">
                  <p className="text-text-muted text-sm">No status data available</p>
                </div>
              )}

              {/* Custom legend */}
              <div className="flex items-center justify-center gap-6 mt-2">
                {pieData.map(entry => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                    <span className="text-text-muted text-sm">{entry.name}</span>
                    <span className="text-white text-sm font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Wait Time Trends */}
            <motion.div
              variants={itemVariants}
              className="bg-panel rounded-2xl border border-white/5 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-mars/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-mars" />
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Wait Time Trends</h2>
                  <p className="text-text-muted text-xs">Wait time progression over time</p>
                </div>
              </div>

              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="waitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff3b3b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ff3b3b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: '#b0b3b8', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                    />
                    <YAxis
                      tick={{ fill: '#b0b3b8', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      label={{ value: 'min', angle: -90, position: 'insideLeft', offset: -5, fill: '#b0b3b8', fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="waitTime"
                      stroke="#ff3b3b"
                      strokeWidth={2.5}
                      fill="url(#waitGradient)"
                      name="Wait Time"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          <motion.div
            variants={itemVariants}
            className="bg-panel rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Performance Metrics</h2>
                <p className="text-text-muted text-xs">Key performance indicators at a glance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </motion.div>

          {/* Doctor Workload Overview */}
          <motion.div
            variants={itemVariants}
            className="bg-panel rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Doctor Workload</h2>
                <p className="text-text-muted text-xs">Current patient load vs capacity per doctor</p>
              </div>
            </div>

            {doctorWorkload.length > 0 ? (
              <div className="w-full space-y-3">
                {doctorWorkload.map((doctor) => {
                  const utilColor = doctor.utilization > 80 ? '#ff3b3b' : doctor.utilization > 50 ? '#fbbf24' : '#4ade80'
                  return (
                    <div key={doctor.name} className="flex items-center gap-4">
                      <div className="w-32 sm:w-40 shrink-0 text-right">
                        <p className="text-white text-sm font-medium truncate">{doctor.name}</p>
                        <p className="text-text-muted text-xs truncate">{doctor.specialty}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="relative h-7 bg-white/5 rounded-md overflow-hidden">
                          {/* Background capacity bar */}
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-text-muted text-xs">{doctor.capacity}</span>
                          </div>
                          {/* Patient load bar */}
                          <motion.div
                            className="absolute left-0 top-0 h-full rounded-md flex items-center px-2"
                            style={{ backgroundColor: `${utilColor}30`, borderRight: `2px solid ${utilColor}` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(doctor.utilization, 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                          >
                            <span className="text-white text-xs font-semibold whitespace-nowrap">
                              {doctor.patients}
                            </span>
                          </motion.div>
                        </div>
                      </div>
                      <div className="w-14 text-right shrink-0">
                        <span className="text-xs font-bold" style={{ color: utilColor }}>
                          {doctor.utilization}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-text-muted text-sm">No doctor data available</p>
              </div>
            )}

            {/* Utilization legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-text-muted text-xs">&lt; 50%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-text-muted text-xs">50-80%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mars" />
                <span className="text-text-muted text-xs">&gt; 80%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
