import React, { useState } from 'react'
import { warEvents, EVENT_COLORS, EVENT_LABELS, EVENT_TYPES } from '../data/events.js'
import { formatDistanceToNow } from 'date-fns'
import {
  Crosshair, Activity, Shield, Heart, Anchor,
  Zap, Swords, Flag, Filter, ChevronDown, X, Globe
} from 'lucide-react'

const TYPE_ICONS = {
  missile_strike: Crosshair,
  military_movement: Activity,
  no_fly_zone: Shield,
  humanitarian_aid: Heart,
  naval_blockade: Anchor,
  airstrike: Zap,
  ground_offensive: Swords,
  ceasefire: Flag,
}

const SEVERITY_BADGE = {
  critical: 'bg-war-red/20 text-war-red border border-war-red/40',
  high: 'bg-orange-900/30 text-orange-400 border border-orange-700/40',
  medium: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/40',
  low: 'bg-green-900/30 text-green-400 border border-green-700/40',
}

const ALL_TYPES = 'all'

export default function EventPanel({ selectedEvent, onSelectEvent, filters, onFiltersChange }) {
  const [expanded, setExpanded] = useState(null)

  const filtered = warEvents.filter(e => {
    if (filters.type !== ALL_TYPES && e.type !== filters.type) return false
    if (filters.severity !== ALL_TYPES && e.severity !== filters.severity) return false
    if (filters.region && !e.region.toLowerCase().includes(filters.region.toLowerCase())) return false
    return true
  })

  const handleSelect = (event) => {
    onSelectEvent(event)
    setExpanded(event.id === expanded ? null : event.id)
  }

  return (
    <div className="flex flex-col h-full bg-war-panel border-r border-war-border overflow-hidden" style={{ width: '340px', minWidth: '340px' }}>
      <div className="px-4 py-3 border-b border-war-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-war-cyan" />
            <span className="text-war-text font-mono font-bold text-sm tracking-wider uppercase">War Events</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-war-red/20 text-war-red text-xs font-mono font-bold">{filtered.length}</span>
          </div>
          <Filter className="w-3.5 h-3.5 text-war-subtext" />
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              className="flex-1 bg-war-bg border border-war-border text-war-subtext text-xs font-mono px-2 py-1.5 rounded focus:outline-none focus:border-war-cyan"
              value={filters.type}
              onChange={e => onFiltersChange({ ...filters, type: e.target.value })}
            >
              <option value={ALL_TYPES}>All Types</option>
              {Object.entries(EVENT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              className="flex-1 bg-war-bg border border-war-border text-war-subtext text-xs font-mono px-2 py-1.5 rounded focus:outline-none focus:border-war-cyan"
              value={filters.severity}
              onChange={e => onFiltersChange({ ...filters, severity: e.target.value })}
            >
              <option value={ALL_TYPES}>All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Filter by region..."
            className="w-full bg-war-bg border border-war-border text-war-text text-xs font-mono px-2 py-1.5 rounded focus:outline-none focus:border-war-cyan placeholder-war-muted"
            value={filters.region}
            onChange={e => onFiltersChange({ ...filters, region: e.target.value })}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-war-muted text-xs font-mono">No events match filters</div>
        )}
        {filtered.map(event => {
          const Icon = TYPE_ICONS[event.type] || Activity
          const color = EVENT_COLORS[event.type]
          const isSelected = selectedEvent?.id === event.id
          const isExpanded = expanded === event.id
          return (
            <div
              key={event.id}
              className={`border-b border-war-border cursor-pointer transition-all duration-150 ${
                isSelected ? 'bg-war-accent/60' : 'hover:bg-war-accent/30'
              }`}
              onClick={() => handleSelect(event)}
            >
              <div className="px-3 py-2.5">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                    <span className="text-war-text text-xs font-mono font-medium truncate leading-tight">{event.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {event.active && <span className="w-1.5 h-1.5 rounded-full bg-war-red flex-shrink-0 animate-pulse" />}
                    <span className={`px-1.5 py-0.5 rounded text-xs font-mono uppercase tracking-wider ${SEVERITY_BADGE[event.severity]}`}>
                      {event.severity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-war-muted text-xs font-mono">{event.region}</span>
                  <span className="text-war-subtext text-xs font-mono">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 border-t border-war-border/50 pt-2">
                  <p className="text-war-subtext text-xs font-mono leading-relaxed">{event.description}</p>
                  {event.flightImpact && (
                    <div className="rounded bg-war-bg/60 border border-war-border p-2">
                      <div className="text-war-cyan text-xs font-mono font-bold mb-0.5 uppercase tracking-wider">✈ Flight Impact</div>
                      <div className="text-war-text text-xs font-mono leading-relaxed">{event.flightImpact}</div>
                    </div>
                  )}
                  {event.casualties && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-war-red text-xs font-mono">⚠</span>
                      <span className="text-war-red text-xs font-mono">{event.casualties}</span>
                    </div>
                  )}
                  {event.sources && (
                    <div className="flex flex-wrap gap-1">
                      {event.sources.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-war-bg border border-war-border text-war-muted text-xs font-mono">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="border-t border-war-border p-3 flex-shrink-0 bg-war-bg/40">
        <div className="text-war-muted text-xs font-mono mb-2 uppercase tracking-wider">Legend</div>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(EVENT_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: EVENT_COLORS[type] }} />
              <span className="text-war-muted text-xs font-mono truncate">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}