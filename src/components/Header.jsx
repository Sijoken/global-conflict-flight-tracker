import React, { useState, useEffect } from 'react'
import { Radio, AlertTriangle, Globe } from 'lucide-react'

export default function Header({ activeEvents, criticalCount }) {
  const [time, setTime] = useState(new Date())
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    const blinker = setInterval(() => setBlink(v => !v), 800)
    return () => { clearInterval(timer); clearInterval(blinker) }
  }, [])

  const utc = time.toUTCString().replace('GMT', 'UTC')

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-war-panel border-b border-war-border flex-shrink-0">
      <div className="flex items-center gap-3">
        <Globe className="w-5 h-5 text-war-cyan" />
        <div>
          <div className="text-war-text font-mono font-bold text-sm tracking-widest uppercase">
            Global Conflict & Flight Tracker
          </div>
          <div className="text-war-muted text-xs font-mono tracking-wider">OSINT Tactical Dashboard</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {criticalCount > 0 && (
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded border border-war-red/40 bg-war-red/10 ${
            blink ? 'opacity-100' : 'opacity-50'
          } transition-opacity`}>
            <AlertTriangle className="w-3 h-3 text-war-red" />
            <span className="text-war-red text-xs font-mono font-bold">{criticalCount} CRITICAL</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full bg-green-400 ${ blink ? 'opacity-100' : 'opacity-60' } transition-opacity`} />
          <span className="text-green-400 text-xs font-mono font-bold">LIVE</span>
        </div>

        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-war-subtext" />
          <span className="text-war-subtext text-xs font-mono">{utc}</span>
        </div>

        <div className="px-2 py-1 rounded bg-war-accent border border-war-border">
          <span className="text-war-cyan text-xs font-mono">{activeEvents} Active Events</span>
        </div>
      </div>
    </header>
  )
}