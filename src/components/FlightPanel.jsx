import React, { useState } from 'react'
import { flightPaths, flightStatusColors, FLIGHT_STATUS } from '../data/flights.js'
import { Plane, AlertTriangle, CheckCircle, Heart, RotateCcw, X } from 'lucide-react'

const STATUS_ICON = {
  rerouted: RotateCcw,
  cancelled: X,
  normal: CheckCircle,
  diverted: AlertTriangle,
  humanitarian: Heart,
}

const STATUS_LABEL = {
  rerouted: 'Rerouted',
  cancelled: 'Cancelled',
  normal: 'Normal',
  diverted: 'Diverted',
  humanitarian: 'Humanitarian',
}

export default function FlightPanel({ selectedFlight, onSelectFlight, showFlights, onToggleFlights }) {
  const [filter, setFilter] = useState('all')
  const filtered = flightPaths.filter(f => filter === 'all' || f.status === filter)

  return (
    <div className="flex flex-col h-full bg-war-panel border-l border-war-border overflow-hidden" style={{ width: '300px', minWidth: '300px' }}>
      <div className="px-4 py-3 border-b border-war-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-war-cyan" />
            <span className="text-war-text font-mono font-bold text-sm tracking-wider uppercase">Flight Paths</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-war-cyan/20 text-war-cyan text-xs font-mono font-bold">{filtered.length}</span>
          </div>
          <button
            className={`px-2 py-1 rounded text-xs font-mono border transition-colors ${
              showFlights ? 'border-war-cyan/50 bg-war-cyan/10 text-war-cyan' : 'border-war-border bg-war-bg text-war-muted'
            }`}
            onClick={onToggleFlights}
          >
            {showFlights ? 'Visible' : 'Hidden'}
          </button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', 'rerouted', 'humanitarian', 'normal'].map(s => (
            <button
              key={s}
              className={`px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider transition-colors ${
                filter === s ? 'text-war-bg font-bold' : 'text-war-muted hover:text-war-subtext border border-war-border'
              }`}
              style={filter === s ? { backgroundColor: s === 'all' ? '#3182ce' : flightStatusColors[s] || '#3182ce' } : {}}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map(flight => {
          const color = flightStatusColors[flight.status]
          const isSelected = selectedFlight?.id === flight.id
          return (
            <div
              key={flight.id}
              className={`border-b border-war-border cursor-pointer transition-all duration-150 px-3 py-2.5 ${
                isSelected ? 'bg-war-accent/60' : 'hover:bg-war-accent/30'
              }`}
              onClick={() => onSelectFlight(isSelected ? null : flight)}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Plane className="w-3 h-3 flex-shrink-0" style={{ color }} />
                  <span className="text-war-text text-xs font-mono font-bold">{flight.callsign}</span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-mono uppercase tracking-wider"
                    style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}>
                    {STATUS_LABEL[flight.status]}
                  </span>
                </div>
              </div>
              <div className="text-war-muted text-xs font-mono mb-1 truncate">{flight.airline}</div>
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-war-subtext truncate">{flight.from.split('(')[1]?.replace(')', '') || flight.from}</span>
                <span className="text-war-muted">→</span>
                <span className="text-war-subtext truncate">{flight.to.split('(')[1]?.replace(')', '') || flight.to}</span>
              </div>
              {flight.extraTime && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-orange-400 text-xs font-mono">+{flight.extraTime}</span>
                  {flight.extraFuel && <span className="text-war-muted text-xs font-mono">{flight.extraFuel} fuel</span>}
                </div>
              )}
              {isSelected && (
                <div className="mt-2 pt-2 border-t border-war-border/50">
                  <div className="text-war-cyan text-xs font-mono font-bold mb-1 uppercase tracking-wider">Route Info</div>
                  <p className="text-war-subtext text-xs font-mono leading-relaxed">{flight.rerouting}</p>
                  <div className="mt-1.5 text-war-muted text-xs font-mono"><span className="text-war-subtext">From:</span> {flight.from}</div>
                  <div className="text-war-muted text-xs font-mono"><span className="text-war-subtext">To:</span> {flight.to}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="border-t border-war-border p-3 flex-shrink-0 bg-war-bg/40">
        <div className="text-war-muted text-xs font-mono mb-2 uppercase tracking-wider">Status Summary</div>
        <div className="space-y-1">
          {Object.entries(STATUS_LABEL).map(([status, label]) => {
            const count = flightPaths.filter(f => f.status === status).length
            if (count === 0) return null
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: flightStatusColors[status] }} />
                  <span className="text-war-muted text-xs font-mono">{label}</span>
                </div>
                <span className="text-war-text text-xs font-mono font-bold">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}