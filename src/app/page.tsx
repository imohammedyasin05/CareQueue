'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import HowItWorks from '@/components/landing/how-it-works'
import Benefits from '@/components/landing/benefits'
import DashboardPage from '@/components/dashboard/dashboard-page'
import AdminPage from '@/components/admin/admin-page'
import AnalyticsPage from '@/components/visualization/analytics-page'

// Page transition variants for smooth navigation
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: 'easeIn' } },
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState('landing')

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    // Scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Landing page includes all landing sections
  const renderLanding = () => (
    <>
      <Hero onNavigate={handleNavigate} />
      <Features onNavigate={handleNavigate} />
      <HowItWorks onNavigate={handleNavigate} />
      <Benefits onNavigate={handleNavigate} />
    </>
  )

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return renderLanding()
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />
      case 'analytics':
        return <AnalyticsPage onNavigate={handleNavigate} />
      default:
        return renderLanding()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-space">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  )
}
