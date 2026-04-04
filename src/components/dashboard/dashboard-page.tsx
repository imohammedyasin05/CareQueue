'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Users,
  Stethoscope,
  Clock,
  Loader2,
  Download,
  AlertCircle,
  TrendingUp,
  Activity,
  Timer,
  FileText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DashboardPageProps {
  onNavigate: (page: string) => void
}

interface PredictionResult {
  id: string
  estimatedWaitTime: number
  queueStatus: string
  patients: number
  doctors: number
  avgConsultationTime: number
  timestamp: string
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [patients, setPatients] = useState('')
  const [doctors, setDoctors] = useState('')
  const [avgConsultationTime, setAvgConsultationTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [history, setHistory] = useState<PredictionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [displayWaitTime, setDisplayWaitTime] = useState(0)

  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const resultRef = useRef<PredictionResult | null>(null)

  // Load history on mount
  useEffect(() => {
    fetchHistory()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Animated counting effect for wait time
  useEffect(() => {
    if (result && result !== resultRef.current) {
      resultRef.current = result
      startTimeRef.current = performance.now()
      setDisplayWaitTime(0)

      const duration = 1200 // ms
      const targetValue = result.estimatedWaitTime

      const animate = (now: number) => {
        const elapsed = now - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayWaitTime(Math.round(eased * targetValue * 10) / 10)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setDisplayWaitTime(targetValue)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }
  }, [result])

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history')
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      setHistory(Array.isArray(data) ? data : [])
    } catch {
      // Silently fail - history is non-critical
      setHistory([])
    }
  }, [])

  const handlePredict = async () => {
    setError(null)
    setResult(null)

    const p = parseInt(patients)
    const d = parseInt(doctors)
    const t = parseInt(avgConsultationTime)

    if (!p || !d || !t) {
      setError('Please fill in all fields with valid positive numbers.')
      return
    }

    if (p <= 0 || d <= 0 || t <= 0) {
      setError('All values must be positive numbers.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patients: p,
          doctors: d,
          avgConsultationTime: t,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setResult(data)
      // Refresh history after successful prediction
      fetchHistory()
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (history.length === 0) return

    const headers = ['Time', 'Patients', 'Doctors', 'Avg Time (min)', 'Wait Time (min)', 'Status']
    const rows = history.map((h) => [
      new Date(h.timestamp).toLocaleString(),
      h.patients,
      h.doctors,
      h.avgConsultationTime,
      h.estimatedWaitTime,
      h.queueStatus,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `carequeue-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'low':
        return 'status-low'
      case 'medium':
        return 'status-medium'
      case 'high':
        return 'status-high'
      default:
        return 'status-medium'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'low':
        return <Activity size={14} />
      case 'medium':
        return <TrendingUp size={14} />
      case 'high':
        return <AlertCircle size={14} />
      default:
        return <Activity size={14} />
    }
  }

  const getWaitTimeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'low':
        return 'text-emerald-400'
      case 'medium':
        return 'text-amber-400'
      case 'high':
        return 'gradient-text'
      default:
        return 'text-white'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePredict()
    }
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-3">
          Queue <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-xl mx-auto">
          Predict and optimize hospital queue wait times
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Left Column: Form + Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Prediction Form Card */}
          <motion.div
            className="bg-panel rounded-2xl border border-white/5 p-6 sm:p-8 card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-mars/10 flex items-center justify-center">
                <Brain size={20} className="text-mars" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-white">
                  Predict Wait Time
                </h2>
                <p className="text-text-muted text-sm">
                  Enter queue parameters to get an AI prediction
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Patients Input */}
              <div className="space-y-2">
                <Label className="text-text-muted text-sm flex items-center gap-2">
                  <Users size={14} className="text-mars" />
                  Number of Patients
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={patients}
                  onChange={(e) => setPatients(e.target.value)}
                  onKeyDown={handleKeyDown}
                  min={1}
                  className="bg-panel-light border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-muted/50 focus-visible:border-mars focus-visible:ring-1 focus-visible:ring-mars/50 h-11"
                />
              </div>

              {/* Doctors Input */}
              <div className="space-y-2">
                <Label className="text-text-muted text-sm flex items-center gap-2">
                  <Stethoscope size={14} className="text-mars" />
                  Number of Doctors
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  value={doctors}
                  onChange={(e) => setDoctors(e.target.value)}
                  onKeyDown={handleKeyDown}
                  min={1}
                  className="bg-panel-light border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-muted/50 focus-visible:border-mars focus-visible:ring-1 focus-visible:ring-mars/50 h-11"
                />
              </div>

              {/* Avg Consultation Time Input */}
              <div className="space-y-2">
                <Label className="text-text-muted text-sm flex items-center gap-2">
                  <Timer size={14} className="text-mars" />
                  Average Consultation Time (min)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 15"
                  value={avgConsultationTime}
                  onChange={(e) => setAvgConsultationTime(e.target.value)}
                  onKeyDown={handleKeyDown}
                  min={1}
                  className="bg-panel-light border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-text-muted/50 focus-visible:border-mars focus-visible:ring-1 focus-visible:ring-mars/50 h-11"
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Predict Button */}
              <Button
                onClick={handlePredict}
                disabled={loading}
                className="btn-glow bg-mars hover:bg-mars-hover text-white font-semibold py-3 px-8 rounded-xl w-full sm:w-auto h-12 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={18} />
                    Predict Wait Time
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                className="bg-panel rounded-2xl border border-white/5 p-6 sm:p-8 card-hover"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Clock size={20} className="text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-heading font-semibold text-white">
                    Prediction Result
                  </h2>
                </div>

                {/* Main Wait Time Display */}
                <div className="bg-panel-light rounded-xl p-6 sm:p-8 mb-6 border border-white/5">
                  <p className="text-text-muted text-sm mb-2 uppercase tracking-wider">
                    Estimated Wait Time
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`text-5xl sm:text-6xl font-heading font-bold ${getWaitTimeColor(result.queueStatus)}`}
                    >
                      {displayWaitTime}
                    </span>
                    <span className="text-text-muted text-lg font-medium">minutes</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-text-muted text-sm">Queue Status:</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(result.queueStatus)}`}
                    >
                      {getStatusIcon(result.queueStatus)}
                      {result.queueStatus}
                    </span>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-panel-light rounded-xl p-4 border border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users size={16} className="text-text-muted" />
                      <span className="text-text-muted text-xs uppercase tracking-wider">
                        Patients
                      </span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">
                      {result.patients}
                    </p>
                  </div>

                  <div className="bg-panel-light rounded-xl p-4 border border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Stethoscope size={16} className="text-text-muted" />
                      <span className="text-text-muted text-xs uppercase tracking-wider">
                        Doctors
                      </span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">
                      {result.doctors}
                    </p>
                  </div>

                  <div className="bg-panel-light rounded-xl p-4 border border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Timer size={16} className="text-text-muted" />
                      <span className="text-text-muted text-xs uppercase tracking-wider">
                        Avg Time
                      </span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">
                      {result.avgConsultationTime}
                      <span className="text-sm text-text-muted font-normal ml-1">min</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: History Table */}
        <div className="lg:col-span-2">
          <motion.div
            className="bg-panel rounded-2xl border border-white/5 p-6 sm:p-8 card-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-chart-5/10 flex items-center justify-center">
                  <FileText size={20} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-white">
                    Recent Predictions
                  </h2>
                  <p className="text-text-muted text-xs">
                    Last {history.length > 10 ? '10' : history.length} predictions
                  </p>
                </div>
              </div>

              {history.length > 0 && (
                <Button
                  onClick={handleExport}
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-white hover:bg-white/5 gap-2 text-xs"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-panel-light flex items-center justify-center mb-4">
                  <Activity size={28} className="text-text-muted/40" />
                </div>
                <p className="text-text-muted text-sm mb-1">No predictions yet</p>
                <p className="text-text-muted/50 text-xs">
                  Make your first prediction to see it here
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/5 overflow-hidden">
                <div className="max-h-[480px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-panel-light hover:bg-panel-light border-white/5">
                        <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider py-3 px-3">
                          Time
                        </TableHead>
                        <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider py-3 px-3 text-center">
                          P
                        </TableHead>
                        <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider py-3 px-3 text-center">
                          D
                        </TableHead>
                        <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider py-3 px-3 text-center">
                          Avg
                        </TableHead>
                        <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider py-3 px-3 text-center">
                          Wait
                        </TableHead>
                        <TableHead className="text-text-muted text-xs font-semibold uppercase tracking-wider py-3 px-3 text-right">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.slice(0, 10).map((item, index) => (
                        <TableRow
                          key={item.id}
                          className={`border-white/5 ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'} hover:bg-white/[0.04]`}
                        >
                          <TableCell className="py-3 px-3 text-text-muted text-xs">
                            {new Date(item.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </TableCell>
                          <TableCell className="py-3 px-3 text-white text-xs text-center font-medium">
                            {item.patients}
                          </TableCell>
                          <TableCell className="py-3 px-3 text-white text-xs text-center font-medium">
                            {item.doctors}
                          </TableCell>
                          <TableCell className="py-3 px-3 text-text-muted text-xs text-center">
                            {item.avgConsultationTime}m
                          </TableCell>
                          <TableCell className="py-3 px-3 text-white text-xs text-center font-semibold">
                            {item.estimatedWaitTime}m
                          </TableCell>
                          <TableCell className="py-3 px-3 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusClass(item.queueStatus)}`}
                            >
                              {item.queueStatus}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Export Report Button */}
            {history.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full border-white/10 bg-panel-light hover:bg-white/5 text-text-muted hover:text-white gap-2 text-sm"
                >
                  <Download size={16} />
                  Export Report as CSV
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
