'use client'

import { Activity } from 'lucide-react'

interface FooterProps {
  onNavigate: (page: string) => void
}

const quickLinks = [
  { label: 'Home', page: 'landing' },
  { label: 'Dashboard', page: 'dashboard' },
  { label: 'Admin', page: 'admin' },
]

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-white/5 bg-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-mars/10 flex items-center justify-center">
              <Activity size={15} className="text-mars" />
            </div>
            <div>
              <span className="font-heading text-base font-bold text-white">
                Care<span className="text-mars">Queue</span>
              </span>
              <p className="text-xs text-text-muted ml-1">by Team Ballerina</p>
            </div>
          </div>

          {/* Center - Quick Links */}
          <nav className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className="text-sm text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right - Copyright */}
          <p className="text-xs text-text-muted text-center md:text-right">
            &copy; 2026 CareQueue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
