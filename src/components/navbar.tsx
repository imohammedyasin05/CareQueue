'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navLinks = [
  { label: 'Home', page: 'landing' },
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Admin', page: 'admin' },
  { label: 'Analytics', page: 'analytics' },
]

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNavigate = (page: string) => {
    onNavigate(page)
    setMobileOpen(false)
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-space/80 backdrop-blur-xl border-b border-white/5"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('landing')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-mars/10 flex items-center justify-center group-hover:bg-mars/20 transition-colors">
              <Activity size={18} className="text-mars" />
            </div>
            <span className="font-heading text-lg font-bold text-white">
              Care<span className="text-mars">Queue</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigate(link.page)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg cursor-pointer ${
                  currentPage === link.page
                    ? 'text-mars'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {currentPage === link.page && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-mars rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => handleNavigate('dashboard')}
              className="btn-glow bg-mars hover:bg-mars-hover text-white text-sm px-5 py-2 rounded-lg"
            >
              Open App
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-text-muted hover:text-white">
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-panel border-white/5 w-72 p-0">
                <SheetHeader className="p-6 pb-4 border-b border-white/5">
                  <SheetTitle className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-mars/10 flex items-center justify-center">
                      <Activity size={18} className="text-mars" />
                    </div>
                    <span className="font-heading text-lg font-bold text-white">
                      Care<span className="text-mars">Queue</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.page}>
                      <button
                        onClick={() => handleNavigate(link.page)}
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                          currentPage === link.page
                            ? 'bg-mars/10 text-mars'
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </button>
                    </SheetClose>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <SheetClose asChild>
                      <Button
                        onClick={() => handleNavigate('dashboard')}
                        className="btn-glow bg-mars hover:bg-mars-hover text-white w-full text-sm py-3 rounded-lg"
                      >
                        Open App
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
