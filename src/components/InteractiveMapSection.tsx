import React, { useEffect, useRef, useState } from 'react';
import { COMPANY } from '../config/company.ts';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Car,
  Bike,
  Footprints,
  Info
} from 'lucide-react';
import L from 'leaflet';
import { ChromaticBox } from './ChromaticBox.tsx';

interface InteractiveMapSectionProps {
  compact?: boolean;
}

export const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({ compact = false }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMinutes: number;
    mode: 'car' | 'bike' | 'walk';
  } | null>(null);
  const [travelMode, setTravelMode] = useState<'car' | 'bike' | 'walk'>('car');
  const [locationError, setLocationError] = useState<string | null>(null);

  const studioLat = COMPANY.address.coordinates.lat;
  const studioLng = COMPANY.address.coordinates.lng;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: [studioLat, studioLng],
      zoom: 15,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // High quality Carto dark architectural cartography tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom studio pin marker with amber radiance
    const studioIcon = L.divIcon({
      className: 'custom-studio-pin',
      html: `
        <div style="background-color: #0F1118; border: 2px solid #F59E0B; color: #F8FAFC; padding: 6px 10px; border-radius: 8px; box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35); display: flex; align-items: center; gap: 6px; white-space: nowrap; font-family: sans-serif; font-size: 11px; font-weight: 700;">
          <span style="color: #F59E0B;">🏛️</span>
          <span>Ultimate Design Studio</span>
        </div>
      `,
      iconSize: [175, 36],
      iconAnchor: [87, 18],
    });

    const marker = L.marker([studioLat, studioLng], { icon: studioIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px; color: #16161A;">
        <h4 style="font-weight: bold; margin-bottom: 2px;">${COMPANY.name}</h4>
        <p style="font-size: 11px; color: #666; margin-bottom: 4px;">Flat No. 2, Second Floor (Near M.S. Junior College)</p>
        <p style="font-size: 11px; color: #D97706; font-weight: 600;">${COMPANY.hours.dailySummary}</p>
      </div>
    `);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [studioLat, studioLng]);

  // Request user live location and compute OSRM directions
  const handleGetDirections = (originLat?: number, originLng?: number) => {
    setIsLocating(true);
    setLocationError(null);

    const calculateRoute = async (startLat: number, startLng: number) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      try {
        if (routeLayerRef.current) map.removeLayer(routeLayerRef.current);
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);

        const osrmMode = travelMode === 'walk' ? 'foot' : travelMode === 'bike' ? 'bicycle' : 'driving';
        const url = `https://router.project-osrm.org/route/v1/${osrmMode}/${startLng},${startLat};${studioLng},${studioLat}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

          const polyline = L.polyline(coordinates, {
            color: '#F59E0B',
            weight: 5,
            opacity: 0.9,
            dashArray: travelMode === 'walk' ? '6, 8' : undefined,
          }).addTo(map);

          routeLayerRef.current = polyline;

          const userIcon = L.divIcon({
            className: 'custom-user-pin',
            html: `
              <div style="background-color: #F59E0B; color: white; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(245, 158, 11, 0.8);"></div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          userMarkerRef.current = L.marker([startLat, startLng], { icon: userIcon }).addTo(map);

          map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

          setRouteInfo({
            distanceKm: Number((route.distance / 1000).toFixed(1)),
            durationMinutes: Math.round(route.duration / 60),
            mode: travelMode,
          });
        }
      } catch (err) {
        console.warn('[Routing Service Notice]', err);
        const straightLine = L.polyline([[startLat, startLng], [studioLat, studioLng]], {
          color: '#F59E0B',
          weight: 4,
          dashArray: '5, 5',
        }).addTo(map);
        routeLayerRef.current = straightLine;
        map.fitBounds(straightLine.getBounds(), { padding: [40, 40] });
      } finally {
        setIsLocating(false);
      }
    };

    if (originLat && originLng) {
      calculateRoute(originLat, originLng);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please select a preset starting point below.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        calculateRoute(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLocating(false);
        setLocationError('Location permission was denied. Choose a landmark below to calculate distance.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(COMPANY.address.fullFormatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareStudioLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: COMPANY.name,
        text: `Visit Ultimate Design and Consultant studio in Hyderabad: ${COMPANY.address.fullFormatted}`,
        url: COMPANY.reputation.googleDirectionsUrl,
      });
    } else {
      copyAddress();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="bg-[#12141D] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Map Header & Actions */}
      <div className="p-4 sm:p-6 hairline-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141624]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
            Studio Directions &amp; Navigation
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#F8FAFC] mt-0.5">
            Visit Our Gudimalkapur Office
          </h3>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Landmark: Near M.S. Junior College, Santosh Nagar (Plus Code: {COMPANY.address.plusCode})</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Travel Mode Toggle */}
          <div className="flex items-center bg-[#171926] p-1 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setTravelMode('car')}
              className={`p-1.5 rounded-md transition-all ${
                travelMode === 'car' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Drive by Car"
            >
              <Car className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTravelMode('bike')}
              className={`p-1.5 rounded-md transition-all ${
                travelMode === 'bike' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Ride by Two-Wheeler"
            >
              <Bike className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTravelMode('walk')}
              className={`p-1.5 rounded-md transition-all ${
                travelMode === 'walk' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Walking"
            >
              <Footprints className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleGetDirections()}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:scale-105 transition-all disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Finding...' : 'Get Directions'}</span>
          </button>

          <a
            href={COMPANY.reputation.googleDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/15 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* Calculated Route Banner */}
      {routeInfo && (
        <div className="px-6 py-2.5 bg-emerald-950/80 hairline-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">
              Route Calculated: {routeInfo.distanceKm} km · Approx. {routeInfo.durationMinutes} mins by {routeInfo.mode}
            </span>
          </div>
          <span className="text-[11px] text-emerald-300 hidden sm:inline">
            Follow the highlighted golden line to our studio entrance.
          </span>
        </div>
      )}

      {/* Geolocation fallback presets */}
      {locationError && (
        <div className="px-6 py-3 bg-amber-950/50 text-xs text-amber-200 hairline-b border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>{locationError}</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">From:</span>
            {[
              { name: 'Mehdipatnam', lat: 17.3916, lng: 78.4411 },
              { name: 'Banjara Hills', lat: 17.4156, lng: 78.4357 },
              { name: 'Gachibowli', lat: 17.4401, lng: 78.3489 },
            ].map((loc) => (
              <button
                key={loc.name}
                onClick={() => handleGetDirections(loc.lat, loc.lng)}
                className="px-2 py-0.5 bg-white/10 rounded border border-amber-400/40 hover:bg-amber-400 hover:text-black text-[11px] transition-colors"
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Map Canvas */}
      <div
        ref={mapContainerRef}
        className={`w-full ${compact ? 'h-[320px]' : 'h-[440px]'} z-10`}
      />

      {/* Footer Address & Quick Utility Actions */}
      <div className="p-4 sm:p-5 bg-[#0C0E14] hairline-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-start gap-2 max-w-xl">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">{COMPANY.address.fullFormatted}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Open Daily · 09:30 AM to 08:00 PM · Dedicated Client Parking Available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyAddress}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 hover:border-amber-400 text-white rounded-lg text-xs transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Address'}</span>
          </button>
          <button
            onClick={shareStudioLocation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 hover:border-amber-400 text-white rounded-lg text-xs transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shared ? 'Link Copied' : 'Share Location'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
