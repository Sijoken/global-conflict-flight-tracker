import React from 'react'
import { warEvents } from '../data/events.js'
import { flightPaths } from '../data/flights.js'
import { AlertTriangle, Plane, RotateCcw, Globe } from 'lucide-react'

export default function StatsBar({ showNoFlyZones, onToggleNoFlyZones, showFlights, onToggleFlights }) {
  const critical = warEvents.filter(e => e.severity === 'critical').length
  const high = warEvents.filter(e => e.severity === 'high').length
  const rerouted = flightPaths.filter(f => f.status === 'rerouted').length
  const humanitarian = flightPaths.filter(f => f.status === 'humanitarian').length
  const regions = [...new Set(warEvents.map(e => e.region.split('/')[0].trim()))].length

  return (
    <div className="flex items-center gap-0 border-b border-war-border bg-war-bg flex-shrink-0 overflow-x-auto">
      <div className="flex items-center gap-3 px-4 py-2 border-r border-war-border flex-shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-war-red" />
        <div>
          <div className="text-war-text text-xs font-mono font-bold">{critical} Critical</div>
          <div className="text-war-muted text-xs font-mono">{high} High</div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 border-r border-war-border flex-shrink-0">
        <Globe className="w-3.5 h-3.5 text-war-yellow" />
        <div>
          <div className="text-war-text text-xs font-mono font-bold">{warEvents.length} Events</div>
          <div className="text-war-muted text-xs font-mono">{regions} Regions</div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 border-r border-war-border flex-shrink-0">
        <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
        <div>
          <div className="text-war-text text-xs font-mono font-bold">{rerouted} Rerouted</div>
          <div className="text-war-muted text-xs font-mono">{humanitarian} Humanitarian</div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-2 border-r border-war-border flex-shrink-0">
        <Plane className="w-3.5 h-3.5 text-war-cyan" />
        <div>
          <div className="text-war-text text-xs font-mono font-bold">{flightPaths.length} Tracked Flights</div>
          <div className="text-war-muted text-xs font-mono">Conflict affected</div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 ml-auto flex-shrink-0">
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono uppercase tracking-wider transition-colors ${
            showNoFlyZones ? 'border-war-yellow/50 bg-war-yellow/10 text-war-yellow' : 'border-war-border bg-war-bg text-war-muted hover:text-war-subtext'
          }`}
          onClick={onToggleNoFlyZones}
        >
          <span className="w-2 h-2 rounded-sm" style={{ background: showNoFlyZones ? '#d69e2e' : '#4a5568' }} />
          No-Fly Zones
        </button>
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono uppercase tracking-wider transition-colors ${
            showFlights ? 'border-war-cyan/50 bg-war-cyan/10 text-war-cyan' : 'border-war-border bg-war-bg text-war-muted hover:text-war-subtext'
          }`}
          onClick={onToggleFlights}
        >
          <Plane className="w-3 h-3" />
          Flight Paths
        </button>
      </div>
    </div>
  )
}