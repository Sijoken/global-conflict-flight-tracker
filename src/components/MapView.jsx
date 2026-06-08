import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { warEvents, EVENT_COLORS, EVENT_LABELS } from '../data/events.js'
import { flightPaths, flightStatusColors } from '../data/flights.js'
import { noFlyZones } from '../data/events.js'
import { formatDistanceToNow } from 'date-fns'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createEventIcon(type, severity, active) {
  const color = EVENT_COLORS[type] || '#a0aec0'
  const size = severity === 'critical' ? 16 : severity === 'high' ? 13 : 11
  const pulse = (active && (severity === 'critical' || severity === 'high'))
    ? `<circle cx="${size}" cy="${size}" r="${size - 2}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"><animate attributeName="r" values="${size - 2};${size + 8};${size - 2}" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite"/></circle>`
    : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 2}" viewBox="0 0 ${size * 2} ${size * 2}">${pulse}<circle cx="${size}" cy="${size}" r="${Math.max(size - 4, 4)}" fill="${color}" opacity="0.9"/><circle cx="${size}" cy="${size}" r="${Math.max(size - 6, 2)}" fill="${color}" opacity="0.4"/></svg>`
  return L.divIcon({ html: svg, className: '', iconSize: [size * 2, size * 2], iconAnchor: [size, size], popupAnchor: [0, -size] })
}

function buildPopupContent(event) {
  const color = EVENT_COLORS[event.type] || '#a0aec0'
  const label = EVENT_LABELS[event.type] || event.type
  const timeAgo = formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })
  return `<div style="font-family:'JetBrains Mono',monospace;min-width:280px;max-width:320px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0;"></span><span style="color:#e2e8f0;font-weight:700;font-size:13px;line-height:1.3;">${event.title}</span></div><div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;"><span style="padding:2px 8px;border-radius:3px;background:${color}22;color:${color};border:1px solid ${color}44;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${label}</span><span style="padding:2px 8px;border-radius:3px;background:#1e2d4a;color:#a0aec0;border:1px solid #1e2d4a;font-size:10px;letter-spacing:0.5px;">${event.region}</span><span style="padding:2px 8px;border-radius:3px;background:#1e2d4a;color:#4a5568;border:1px solid #1e2d4a;font-size:10px;">${timeAgo}</span></div><p style="color:#a0aec0;font-size:11px;line-height:1.6;margin:0 0 8px 0;">${event.description}</p>${event.flightImpact ? `<div style="background:#0a0e1a;border:1px solid #1e2d4a;border-left:3px solid #00b5d8;border-radius:4px;padding:8px;margin-bottom:6px;"><div style="color:#00b5d8;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">✈ Flight Impact</div><div style="color:#e2e8f0;font-size:11px;line-height:1.5;">${event.flightImpact}</div></div>` : ''}${event.casualties ? `<div style="color:#e53e3e;font-size:10px;margin-bottom:4px;">⚠ ${event.casualties}</div>` : ''}${event.sources ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">${event.sources.map(s => `<span style="padding:1px 6px;border-radius:3px;background:#0a0e1a;border:1px solid #1e2d4a;color:#4a5568;font-size:10px;">${s}</span>`).join('')}</div>` : ''}</div>`
}

function buildFlightPopup(flight) {
  const color = flightStatusColors[flight.status] || '#a0aec0'
  return `<div style="font-family:'JetBrains Mono',monospace;min-width:260px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="color:${color};font-weight:700;font-size:14px;">✈ ${flight.callsign}</span><span style="padding:2px 8px;border-radius:3px;background:${color}22;color:${color};border:1px solid ${color}44;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${flight.status}</span></div><div style="color:#a0aec0;font-size:11px;margin-bottom:6px;">${flight.airline}</div><div style="color:#e2e8f0;font-size:11px;margin-bottom:2px;"><span style="color:#4a5568;">FROM</span> ${flight.from}</div><div style="color:#e2e8f0;font-size:11px;margin-bottom:8px;"><span style="color:#4a5568;">TO &nbsp;&nbsp;</span> ${flight.to}</div><p style="color:#a0aec0;font-size:11px;line-height:1.5;margin:0 0 6px 0;">${flight.rerouting}</p>${flight.extraTime ? `<div style="display:flex;gap:12px;"><span style="color:#dd6b20;font-size:11px;font-weight:700;">+${flight.extraTime} delay</span>${flight.extraFuel ? `<span style="color:#4a5568;font-size:11px;">${flight.extraFuel} extra fuel</span>` : ''}</div>` : ''}</div>`
}

export default function MapView({ selectedEvent, selectedFlight, onSelectEvent, showFlights, showNoFlyZones }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const flightLayersRef = useRef([])
  const nfzLayersRef = useRef([])
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (mapInstanceRef.current) return
    const map = L.map(mapRef.current, { center: [30, 35], zoom: 3, minZoom: 2, maxZoom: 12, zoomControl: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 18 }).addTo(map)
    mapInstanceRef.current = map
    setMapReady(true)
    return () => { map.remove(); mapInstanceRef.current = null }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return
    const map = mapInstanceRef.current
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    warEvents.forEach(event => {
      const icon = createEventIcon(event.type, event.severity, event.active)
      const marker = L.marker([event.lat, event.lng], { icon }).addTo(map).bindPopup(buildPopupContent(event), { maxWidth: 340, className: 'war-popup' })
      marker.on('click', () => onSelectEvent(event))
      markersRef.current.push(marker)
    })
  }, [mapReady])

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return
    const map = mapInstanceRef.current
    nfzLayersRef.current.forEach(l => l.remove())
    nfzLayersRef.current = []
    if (!showNoFlyZones) return
    noFlyZones.forEach(zone => {
      const poly = L.polygon(zone.coords, { color: zone.color, fillColor: zone.fillColor, fillOpacity: zone.fillOpacity, weight: 1, dashArray: '6 4', opacity: 0.6 }).addTo(map)
      poly.bindTooltip(`<span style="font-family:monospace;font-size:11px;color:${zone.color}">${zone.name}</span>`, { permanent: false, direction: 'center' })
      nfzLayersRef.current.push(poly)
    })
  }, [mapReady, showNoFlyZones])

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return
    const map = mapInstanceRef.current
    flightLayersRef.current.forEach(l => l.remove())
    flightLayersRef.current = []
    if (!showFlights) return
    flightPaths.forEach(flight => {
      const color = flightStatusColors[flight.status] || '#a0aec0'
      const isSelected = selectedFlight?.id === flight.id
      if (flight.originalPath) {
        const origLine = L.polyline(flight.originalPath, { color: '#4a5568', weight: 1, opacity: 0.4, dashArray: '4 6' }).addTo(map)
        origLine.bindTooltip(`<span style="font-family:monospace;font-size:10px;color:#4a5568">Original route: ${flight.callsign}</span>`, { direction: 'top' })
        flightLayersRef.current.push(origLine)
      }
      const line = L.polyline(flight.currentPath, { color, weight: isSelected ? 3 : 1.5, opacity: isSelected ? 1 : 0.7, dashArray: flight.status === 'humanitarian' ? '8 4' : flight.status === 'rerouted' ? '5 3' : null }).addTo(map)
      line.bindPopup(buildFlightPopup(flight), { maxWidth: 300 })
      const path = flight.currentPath
      const midIdx = Math.floor(path.length / 2)
      const mid = path[midIdx]
      const planeIcon = L.divIcon({ html: `<div style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;background:${color}22;border:1px solid ${color}66;border-radius:50%;font-size:10px;color:${color};cursor:pointer;">✈</div>`, className: '', iconSize: [20, 20], iconAnchor: [10, 10] })
      const planeMarker = L.marker(mid, { icon: planeIcon }).addTo(map).bindPopup(buildFlightPopup(flight), { maxWidth: 300 })
      planeMarker.bindTooltip(`<span style="font-family:monospace;font-size:10px;color:${color}">${flight.callsign} — ${flight.from.split('(')[1]?.replace(')', '') || '?'} → ${flight.to.split('(')[1]?.replace(')', '') || '?'}</span>`, { direction: 'top', offset: [0, -12] })
      flightLayersRef.current.push(line, planeMarker)
    })
  }, [mapReady, showFlights, selectedFlight])

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !selectedEvent) return
    mapInstanceRef.current.flyTo([selectedEvent.lat, selectedEvent.lng], 6, { duration: 1.2, easeLinearity: 0.5 })
  }, [selectedEvent, mapReady])

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !selectedFlight) return
    const path = selectedFlight.currentPath
    if (path && path.length > 0) {
      const bounds = L.latLngBounds(path)
      mapInstanceRef.current.flyToBounds(bounds, { padding: [60, 60], duration: 1.2 })
    }
  }, [selectedFlight, mapReady])

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div className="scanline pointer-events-none" />
      <div className="absolute top-3 left-3 pointer-events-none z-10">
        <div className="text-war-cyan/30 text-xs font-mono">LAT {mapInstanceRef.current ? mapInstanceRef.current.getCenter().lat.toFixed(4) : '30.0000'}</div>
        <div className="text-war-cyan/30 text-xs font-mono">LNG {mapInstanceRef.current ? mapInstanceRef.current.getCenter().lng.toFixed(4) : '35.0000'}</div>
      </div>
      <div className="absolute top-3 right-16 pointer-events-none z-10">
        <div className="text-war-cyan/30 text-xs font-mono text-right">TACTICAL VIEW</div>
        <div className="text-war-cyan/20 text-xs font-mono text-right">OSINT OVERLAY</div>
      </div>
    </div>
  )
}