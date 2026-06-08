import React, { useState } from 'react'
import Header from './components/Header.jsx'
import EventPanel from './components/EventPanel.jsx'
import FlightPanel from './components/FlightPanel.jsx'
import MapView from './components/MapView.jsx'
import StatsBar from './components/StatsBar.jsx'
import { warEvents } from './data/events.js'

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showFlights, setShowFlights] = useState(true)
  const [showNoFlyZones, setShowNoFlyZones] = useState(true)
  const [showFlightPanel, setShowFlightPanel] = useState(true)
  const [filters, setFilters] = useState({ type: 'all', severity: 'all', region: '' })

  const criticalCount = warEvents.filter(e => e.severity === 'critical' && e.active).length
  const activeEvents = warEvents.filter(e => e.active).length

  return (
    <div className="flex flex-col h-screen bg-war-bg overflow-hidden">
      <Header activeEvents={activeEvents} criticalCount={criticalCount} />

      <StatsBar
        showNoFlyZones={showNoFlyZones}
        onToggleNoFlyZones={() => setShowNoFlyZones(v => !v)}
        showFlights={showFlights}
        onToggleFlights={() => setShowFlights(v => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <EventPanel
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <MapView
          selectedEvent={selectedEvent}
          selectedFlight={selectedFlight}
          onSelectEvent={setSelectedEvent}
          showFlights={showFlights}
          showNoFlyZones={showNoFlyZones}
        />

        {showFlightPanel && (
          <FlightPanel
            selectedFlight={selectedFlight}
            onSelectFlight={setSelectedFlight}
            showFlights={showFlights}
            onToggleFlights={() => setShowFlights(v => !v)}
          />
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-1 bg-war-panel border-t border-war-border flex-shrink-0">
        <div className="text-war-muted text-xs font-mono">
          ⚠ Data for informational/educational purposes only · Sources: ICAO, EUROCONTROL, UN OCHA, ACLED, OSINT aggregators
        </div>
        <div className="flex items-center gap-4">
          <button
            className="text-war-muted text-xs font-mono hover:text-war-subtext transition-colors"
            onClick={() => setShowFlightPanel(v => !v)}
          >
            {showFlightPanel ? 'Hide' : 'Show'} Flights Panel
          </button>
          <div className="text-war-muted text-xs font-mono">
            Click any marker for details
          </div>
        </div>
      </div>
    </div>
  )
}