'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  UserCheck,
  UserPlus,
  BarChart3,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Download,
  RotateCcw,
  Activity,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ─── Types ───────────────────────────────────────────────────────────────────

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

interface Prediction {
  id: string
  patients: number
  doctors: number
  avgConsultationTime: number
  estimatedWaitTime: number
  queueStatus: string
  timestamp: string
}

interface DoctorFormData {
  name: string
  specialty: string
  maxPatients: number
}

const SPECIALTIES = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'Dermatology',
  'Emergency',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

function CustomChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-panel border border-white/10 rounded-lg p-3 shadow-xl">
      <p className="text-text-muted text-xs mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-muted">{entry.name}:</span>
          <span className="font-semibold text-white">
            {entry.name === 'Wait Time (min)' ? `${entry.value.toFixed(1)} min` : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface AdminPageProps {
  onNavigate: (page: string) => void
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  // State
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [history, setHistory] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  // Form state
  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    specialty: 'General Medicine',
    maxPatients: 20,
  })
  const [formErrors, setFormErrors] = useState<Partial<DoctorFormData>>({})
  const [submitting, setSubmitting] = useState(false)

  // ─── Data Fetching ────────────────────────────────────────────────────────

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await fetch('/api/doctors')
      if (!res.ok) throw new Error('Failed to fetch doctors')
      const data = await res.json()
      setDoctors(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history')
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchDoctors(), fetchHistory()]).finally(() => setLoading(false))
  }, [fetchDoctors, fetchHistory])

  // ─── Computed Values ──────────────────────────────────────────────────────

  const totalDoctors = doctors.length
  const availableDoctors = doctors.filter((d) => d.status === 'Available').length
  const todayPredictions = history.length
  const avgWaitTime =
    history.length > 0
      ? history.reduce((acc, p) => acc + (p.estimatedWaitTime || 0), 0) / history.length
      : 0

  const peakWaitTime =
    history.length > 0
      ? Math.max(...history.map((p) => p.estimatedWaitTime || 0))
      : 0

  const totalPatientsToday = doctors.reduce((acc, d) => acc + d.patientsToday, 0)

  // Chart data: last 10 predictions
  const chartData = [...history]
    .reverse()
    .slice(-10)
    .map((p, i) => ({
      name: `#${i + 1}`,
      Patients: p.patients,
      'Wait Time (min)': Math.round(p.estimatedWaitTime * 10) / 10,
    }))

  // ─── Form Handling ────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({ name: '', specialty: 'General Medicine', maxPatients: 20 })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Partial<DoctorFormData> = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.specialty) errors.specialty = 'Specialty is required'
    if (formData.maxPatients <= 0) errors.maxPatients = 'Must be greater than 0'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddDoctor = async () => {
    if (!validateForm()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          specialty: formData.specialty,
          maxPatients: formData.maxPatients,
        }),
      })
      if (!res.ok) throw new Error('Failed to create doctor')
      await fetchDoctors()
      setAddDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error('Add doctor error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditDoctor = async () => {
    if (!selectedDoctor || !validateForm()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/doctors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDoctor.id,
          name: formData.name.trim(),
          specialty: formData.specialty,
          maxPatients: formData.maxPatients,
        }),
      })
      if (!res.ok) throw new Error('Failed to update doctor')
      await fetchDoctors()
      setEditDialogOpen(false)
      resetForm()
      setSelectedDoctor(null)
    } catch (err) {
      console.error('Edit doctor error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/doctors?id=${selectedDoctor.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete doctor')
      await fetchDoctors()
      setDeleteDialogOpen(false)
      setSelectedDoctor(null)
    } catch (err) {
      console.error('Delete doctor error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      maxPatients: doctor.maxPatients,
    })
    setFormErrors({})
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setDeleteDialogOpen(true)
  }

  // ─── Quick Actions ────────────────────────────────────────────────────────

  const handleExportCSV = () => {
    if (doctors.length === 0) return
    const headers = ['Name', 'Specialty', 'Status', 'Patients Today', 'Max Patients']
    const rows = doctors.map((d) => [
      d.name,
      d.specialty,
      d.status,
      d.patientsToday,
      d.maxPatients,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'carequeue-doctors.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleResetAll = async () => {
    try {
      // Delete all doctors
      await Promise.all(
        doctors.map((d) => fetch(`/api/doctors?id=${d.id}`, { method: 'DELETE' }))
      )
      await fetchDoctors()
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error('Reset error:', err)
    }
  }

  // ─── Status Badge ─────────────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{status}</Badge>
      case 'Busy':
        return <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30">{status}</Badge>
      case 'Offline':
        return <Badge className="bg-gray-500/15 text-gray-400 border border-gray-500/30">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // ─── Capacity Color ───────────────────────────────────────────────────────

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  // ─── Loading Skeleton ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl mb-8" />
        <Skeleton className="h-80 rounded-2xl mb-8" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
          Admin Panel
        </h1>
        <p className="text-text-muted text-sm sm:text-base">
          Manage doctors and monitor hospital operations
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: 'Total Doctors',
            value: totalDoctors,
            icon: UserCheck,
            color: 'bg-mars/15',
            iconColor: 'text-mars',
          },
          {
            label: 'Available Doctors',
            value: availableDoctors,
            icon: UserPlus,
            color: 'bg-emerald-500/15',
            iconColor: 'text-emerald-400',
          },
          {
            label: "Today's Predictions",
            value: todayPredictions,
            icon: BarChart3,
            color: 'bg-amber-500/15',
            iconColor: 'text-amber-400',
          },
          {
            label: 'Average Wait Time',
            value: `${avgWaitTime.toFixed(1)} min`,
            icon: Clock,
            color: 'bg-blue-500/15',
            iconColor: 'text-blue-400',
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="bg-panel rounded-xl border border-white/5 p-5 card-hover"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-text-muted text-sm">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Doctor Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-panel rounded-2xl border border-white/5 p-6 mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Doctor Management</h2>
            <p className="text-text-muted text-sm mt-1">
              Add, edit, and manage doctor profiles
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setAddDialogOpen(true)
            }}
            className="btn-glow bg-mars hover:bg-mars-hover text-white"
          >
            <Plus className="w-4 h-4" />
            Add Doctor
          </Button>
        </div>

        {/* Doctor Table */}
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-text-muted font-medium">Name</TableHead>
                  <TableHead className="text-text-muted font-medium">Specialty</TableHead>
                  <TableHead className="text-text-muted font-medium">Status</TableHead>
                  <TableHead className="text-text-muted font-medium">Patients</TableHead>
                  <TableHead className="text-text-muted font-medium min-w-[140px]">Capacity</TableHead>
                  <TableHead className="text-text-muted font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.length === 0 ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center py-12 text-text-muted">
                      <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No doctors found. Add your first doctor to get started.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  doctors.map((doctor) => {
                    const capacity = Math.round(
                      (doctor.patientsToday / doctor.maxPatients) * 100
                    )
                    return (
                      <TableRow
                        key={doctor.id}
                        className="border-white/5 hover:bg-panel-light"
                      >
                        <TableCell className="font-medium text-white">
                          {doctor.name}
                        </TableCell>
                        <TableCell className="text-text-muted">
                          {doctor.specialty}
                        </TableCell>
                        <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                        <TableCell className="text-text-muted">
                          {doctor.patientsToday} / {doctor.maxPatients}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={capacity}
                              className={`h-2 bg-panel-lighter flex-1 [&>div]:${getCapacityColor(capacity)}`}
                            />
                            <span className="text-xs text-text-muted w-8 text-right">
                              {capacity}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(doctor)}
                              className="text-text-muted hover:text-white hover:bg-white/5"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(doctor)}
                              className="text-text-muted hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </motion.div>

      {/* Patient Flow Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-panel rounded-2xl border border-white/5 p-6 mb-8"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Patient Flow Analytics</h2>
          <p className="text-text-muted text-sm mt-1">
            Historical prediction data visualization
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No prediction data available yet.</p>
            <p className="text-xs mt-1 opacity-60">
              Run a prediction from the dashboard to see analytics here.
            </p>
            <Button
              variant="ghost"
              className="mt-4 text-mars hover:text-mars-hover"
              onClick={() => onNavigate('dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#b0b3b8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#b0b3b8', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend
                  wrapperStyle={{ color: '#b0b3b8', fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="Patients"
                  fill="#ff3b3b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="Wait Time (min)"
                  fill="#ff8c5a"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Reset All Data */}
        <div className="bg-panel rounded-2xl border border-white/5 p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Reset All Data</h3>
              <p className="text-text-muted text-xs">Clear all doctor records</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => {
              if (doctors.length === 0) return
              setSelectedDoctor(null)
              setDeleteDialogOpen(true)
            }}
            disabled={doctors.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Reset Doctors
          </Button>
        </div>

        {/* Export Analytics */}
        <div className="bg-panel rounded-2xl border border-white/5 p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Export Analytics</h3>
              <p className="text-text-muted text-xs">Download doctor data as CSV</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
            onClick={handleExportCSV}
            disabled={doctors.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="bg-panel rounded-2xl border border-white/5 p-5 card-hover">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Quick Stats</h3>
              <p className="text-text-muted text-xs">At-a-glance metrics</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total Patients Today</span>
              <span className="text-white font-semibold">{totalPatientsToday}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Peak Wait Time</span>
              <span className="text-white font-semibold">{peakWaitTime.toFixed(1)} min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Avg Consultation</span>
              <span className="text-white font-semibold">
                {history.length > 0
                  ? (
                      history.reduce((acc, p) => acc + (p.avgConsultationTime || 0), 0) /
                      history.length
                    ).toFixed(0)
                  : 0}{' '}
                min
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Add Doctor Dialog ────────────────────────────────────────────── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-panel border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Doctor</DialogTitle>
            <DialogDescription className="text-text-muted">
              Enter the details for the new doctor profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-name" className="text-text-muted">
                Name
              </Label>
              <Input
                id="add-name"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-panel-light border-white/10 text-white placeholder:text-text-muted/50"
              />
              {formErrors.name && (
                <p className="text-red-400 text-xs">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-specialty" className="text-text-muted">
                Specialty
              </Label>
              <Select
                value={formData.specialty}
                onValueChange={(val) =>
                  setFormData({ ...formData, specialty: val })
                }
              >
                <SelectTrigger className="bg-panel-light border-white/10 text-white w-full">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent className="bg-panel border-white/10">
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s} className="text-white focus:bg-panel-light focus:text-white">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.specialty && (
                <p className="text-red-400 text-xs">{formErrors.specialty}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-max" className="text-text-muted">
                Max Patients
              </Label>
              <Input
                id="add-max"
                type="number"
                min={1}
                placeholder="20"
                value={formData.maxPatients}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPatients: parseInt(e.target.value) || 1,
                  })
                }
                className="bg-panel-light border-white/10 text-white placeholder:text-text-muted/50"
              />
              {formErrors.maxPatients && (
                <p className="text-red-400 text-xs">{formErrors.maxPatients}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setAddDialogOpen(false)}
              className="text-text-muted hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDoctor}
              disabled={submitting}
              className="btn-glow bg-mars hover:bg-mars-hover text-white"
            >
              {submitting ? 'Adding...' : 'Add Doctor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Doctor Dialog ───────────────────────────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-panel border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Doctor</DialogTitle>
            <DialogDescription className="text-text-muted">
              Update the doctor profile details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-text-muted">
                Name
              </Label>
              <Input
                id="edit-name"
                placeholder="Dr. John Smith"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-panel-light border-white/10 text-white placeholder:text-text-muted/50"
              />
              {formErrors.name && (
                <p className="text-red-400 text-xs">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-specialty" className="text-text-muted">
                Specialty
              </Label>
              <Select
                value={formData.specialty}
                onValueChange={(val) =>
                  setFormData({ ...formData, specialty: val })
                }
              >
                <SelectTrigger className="bg-panel-light border-white/10 text-white w-full">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent className="bg-panel border-white/10">
                  {SPECIALTIES.map((s) => (
                    <SelectItem key={s} value={s} className="text-white focus:bg-panel-light focus:text-white">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.specialty && (
                <p className="text-red-400 text-xs">{formErrors.specialty}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-max" className="text-text-muted">
                Max Patients
              </Label>
              <Input
                id="edit-max"
                type="number"
                min={1}
                placeholder="20"
                value={formData.maxPatients}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPatients: parseInt(e.target.value) || 1,
                  })
                }
                className="bg-panel-light border-white/10 text-white placeholder:text-text-muted/50"
              />
              {formErrors.maxPatients && (
                <p className="text-red-400 text-xs">{formErrors.maxPatients}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status" className="text-text-muted">
                Status
              </Label>
              <Select
                value={selectedDoctor?.status || 'Available'}
                onValueChange={(val) =>
                  setSelectedDoctor((prev) =>
                    prev ? { ...prev, status: val } : prev
                  )
                }
              >
                <SelectTrigger className="bg-panel-light border-white/10 text-white w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-panel border-white/10">
                  {['Available', 'Busy', 'Offline'].map((s) => (
                    <SelectItem key={s} value={s} className="text-white focus:bg-panel-light focus:text-white">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setEditDialogOpen(false)}
              className="text-text-muted hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditDoctor}
              disabled={submitting}
              className="btn-glow bg-mars hover:bg-mars-hover text-white"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ───────────────────────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-panel border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              {selectedDoctor ? 'Delete Doctor' : 'Reset All Data'}
            </DialogTitle>
            <DialogDescription className="text-text-muted">
              {selectedDoctor
                ? `Are you sure you want to delete "${selectedDoctor.name}"? This action cannot be undone.`
                : `Are you sure you want to delete all ${doctors.length} doctors? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-text-muted hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={
                selectedDoctor ? handleDeleteDoctor : handleResetAll
              }
              disabled={submitting}
            >
              {submitting
                ? 'Deleting...'
                : selectedDoctor
                  ? 'Delete'
                  : 'Reset All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-panel border border-red-500/30 rounded-lg p-4 shadow-xl max-w-sm z-50">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-text-muted hover:text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
