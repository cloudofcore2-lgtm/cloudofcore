'use client'

import { useState } from 'react'
import { Button } from './ui/button'

export function BatchAccessGate({ children }: { children: React.ReactNode }) {
  const [isAccessGranted, setIsAccessGranted] = useState(false)
  const [showAppealForm, setShowAppealForm] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')

  const handleAppealClick = () => {
    setShowAppealForm(true)
    setError('')
    setAccessCode('')
  }

  const handleAccessCodeSubmit = () => {
    if (accessCode === '86828682') {
      setIsAccessGranted(true)
      setShowAppealForm(false)
      setAccessCode('')
      setError('')
    } else {
      setError('Invalid access code. Please try again.')
      setAccessCode('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAccessCodeSubmit()
    }
  }

  if (isAccessGranted) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
        <div className="relative w-full max-w-md mx-4 p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0"></div>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-2">
              <p className="text-sm font-semibold text-blue-300 mb-4 tracking-wider">
                SECURED BY IFC ARENA
              </p>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Batch 305</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Cloud of Core&apos;s Batch 305 has concluded. This site is no longer available for students from this cohort.
              </p>
            </div>

            {!showAppealForm ? (
              <div className="space-y-4">
                <p className="text-center text-white/80 text-sm">
                  If you believe this is an error, please submit an appeal request.
                </p>
                <Button
                  onClick={handleAppealClick}
                  className="w-full bg-white/90 text-black hover:bg-white font-semibold py-6 text-base transition-all duration-200"
                >
                  Appeal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-3">
                    Enter Access Code
                  </label>
                  <input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter code"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm text-center font-medium">{error}</p>
                )}
                <Button
                  onClick={handleAccessCodeSubmit}
                  className="w-full bg-white/90 text-black hover:bg-white font-semibold py-3 text-base transition-all duration-200"
                >
                  Submit
                </Button>
                <button
                  onClick={() => {
                    setShowAppealForm(false)
                    setError('')
                    setAccessCode('')
                  }}
                  className="w-full text-white/70 hover:text-white text-sm font-medium transition-colors py-2"
                >
                  Back
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
