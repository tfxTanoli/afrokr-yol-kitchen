import React, { useState, useEffect, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Circle,
  Polygon,
  Polyline,
  ControlPosition,
  MapControl,
  useMap
} from '@vis.gl/react-google-maps';
import { 
  Truck, 
  MapPin, 
  Store, 
  Compass, 
  Layers, 
  Maximize2, 
  Phone, 
  Clock, 
  LocateFixed, 
  Play, 
  Pause, 
  PenTool,
  Save,
  RotateCcw,
  Undo2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  DollarSign
} from 'lucide-react';
import { DeliveryOrder, DeliveryZone, RestaurantStore } from '../data/deliveryData';

// Browser key supplied via VITE_GOOGLE_MAPS_API_KEY (.env.local / hosting env), never hardcoded
const GOOGLE_MAPS_API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export interface DeliveryMapProps {
  trackingOrder?: DeliveryOrder | null;
  zones: DeliveryZone[];
  restaurants?: RestaurantStore[];
  selectedRestaurant?: RestaurantStore | null;
  onSelectRestaurant?: (restaurant: RestaurantStore) => void;
  onSelectZone?: (zone: DeliveryZone) => void;
  onSaveDeliveryPolygon?: (restaurantId: string, polygon: { lat: number; lng: number }[]) => void;
  enablePolygonDrawing?: boolean;
  className?: string;
}

// Inner helper component to programmatically pan/zoom when driver, order or restaurant changes
function MapCameraController({ 
  center, 
  zoom 
}: { 
  center: { lat: number; lng: number }; 
  zoom: number; 
}) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center.lat, center.lng, zoom]);
  return null;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  trackingOrder,
  zones,
  restaurants = [],
  selectedRestaurant: externalSelectedRestaurant,
  onSelectRestaurant,
  onSelectZone,
  onSaveDeliveryPolygon,
  enablePolygonDrawing = false,
  className = ''
}) => {
  // Mode selection: 'tracking' | 'polygons' | 'zones' | 'draw'
  const [activeTab, setActiveTab] = useState<'tracking' | 'polygons' | 'zones' | 'draw'>(
    enablePolygonDrawing ? 'draw' : trackingOrder ? 'tracking' : 'polygons'
  );

  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [internalSelectedRestaurant, setInternalSelectedRestaurant] = useState<RestaurantStore | null>(
    externalSelectedRestaurant || restaurants[0] || null
  );

  const activeRestaurant = externalSelectedRestaurant || internalSelectedRestaurant;

  // Polygon Drawing State
  const [drawingTargetRestId, setDrawingTargetRestId] = useState<string>(
    activeRestaurant?.id || restaurants[0]?.id || 'rest-1'
  );
  const [drawnPoints, setDrawnPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const [infoWindowTarget, setInfoWindowTarget] = useState<'driver' | 'restaurant' | 'customer' | 'zone' | 'polygon' | null>(null);
  const [activePolygonRest, setActivePolygonRest] = useState<RestaurantStore | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // Sync drawing points when active restaurant changes in draw mode
  useEffect(() => {
    if (activeTab === 'draw') {
      const rest = restaurants.find(r => r.id === drawingTargetRestId);
      if (rest?.deliveryPolygon && rest.deliveryPolygon.length > 0) {
        setDrawnPoints(rest.deliveryPolygon);
      } else {
        setDrawnPoints([]);
      }
    }
  }, [drawingTargetRestId, activeTab, restaurants]);

  // Real-time GPS driver simulation
  const origin = useMemo(() => {
    if (trackingOrder) {
      const rest = restaurants.find(r => r.id === trackingOrder.restaurantId);
      return rest ? { lat: rest.lat, lng: rest.lng } : { lat: 48.891, lng: 2.348 };
    }
    if (activeRestaurant) {
      return { lat: activeRestaurant.lat, lng: activeRestaurant.lng };
    }
    return { lat: 48.883, lng: 2.348 };
  }, [trackingOrder, restaurants, activeRestaurant]);

  const destination = useMemo(() => {
    if (trackingOrder?.customerLatLng) {
      return trackingOrder.customerLatLng;
    }
    return { lat: 48.889, lng: 2.349 };
  }, [trackingOrder]);

  // Live driver position interpolated along route
  const [driverProgress, setDriverProgress] = useState<number>(0.45);
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(true);

  const currentDriverCoords = useMemo(() => {
    const lat = origin.lat + (destination.lat - origin.lat) * driverProgress;
    const curveOffset = Math.sin(driverProgress * Math.PI) * 0.003;
    const lng = origin.lng + (destination.lng - origin.lng) * driverProgress + curveOffset;
    return { lat, lng };
  }, [origin, destination, driverProgress]);

  // Simulated GPS animation tick
  useEffect(() => {
    if (!isSimulatingGps || !trackingOrder || trackingOrder.status === 'delivered') return;

    const interval = setInterval(() => {
      setDriverProgress(prev => {
        if (prev >= 0.95) return 0.15;
        return prev + 0.02;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulatingGps, trackingOrder]);

  // Computed route path points for Polyline
  const routePoints = useMemo(() => {
    const steps = 10;
    const pts: { lat: number; lng: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = origin.lat + (destination.lat - origin.lat) * t;
      const curve = Math.sin(t * Math.PI) * 0.003;
      const lng = origin.lng + (destination.lng - origin.lng) * t + curve;
      pts.push({ lat, lng });
    }
    return pts;
  }, [origin, destination]);

  const remainingMinutes = useMemo(() => {
    if (!trackingOrder) return 15;
    const base = trackingOrder.estimatedDeliveryMinutes || 15;
    return Math.max(2, Math.round(base * (1 - driverProgress)));
  }, [trackingOrder, driverProgress]);

  // Filtered zones by city
  const filteredZones = useMemo(() => {
    if (selectedCityFilter === 'All') return zones;
    return zones.filter(z => z.city === selectedCityFilter || (selectedCityFilter === 'Paris' && z.city === 'Île-de-France'));
  }, [zones, selectedCityFilter]);

  // Map center and zoom depending on active view
  const defaultCenter = useMemo(() => {
    if (activeTab === 'tracking') {
      return currentDriverCoords;
    }
    if (activeRestaurant) {
      return { lat: activeRestaurant.lat, lng: activeRestaurant.lng };
    }
    if (selectedZone) {
      return selectedZone.center;
    }
    if (filteredZones.length > 0) {
      return filteredZones[0].center;
    }
    return { lat: 48.883, lng: 2.348 };
  }, [activeTab, currentDriverCoords, activeRestaurant, selectedZone, filteredZones]);

  const [cameraState, setCameraState] = useState<{ center: { lat: number; lng: number }; zoom: number }>({
    center: defaultCenter,
    zoom: activeTab === 'tracking' ? 14 : 13
  });

  const recenterOnDriver = () => {
    setCameraState({
      center: currentDriverCoords,
      zoom: 15
    });
  };

  const recenterOnRestaurant = (rest: RestaurantStore) => {
    setInternalSelectedRestaurant(rest);
    onSelectRestaurant?.(rest);
    setCameraState({
      center: { lat: rest.lat, lng: rest.lng },
      zoom: 13
    });
  };

  const recenterOnTrajet = () => {
    const midLat = (origin.lat + destination.lat) / 2;
    const midLng = (origin.lng + destination.lng) / 2;
    setCameraState({
      center: { lat: midLat, lng: midLng },
      zoom: 13
    });
  };

  const handleSelectZone = (zone: DeliveryZone) => {
    setSelectedZone(zone);
    setCameraState({
      center: zone.center,
      zoom: 13
    });
    setInfoWindowTarget('zone');
    onSelectZone?.(zone);
  };

  // Handle map click for drawing polygon perimeter
  const handleMapClick = (e: any) => {
    if (activeTab !== 'draw') return;
    const clickedLatLng = e.detail?.latLng || (e.latLng ? { lat: e.latLng.lat(), lng: e.latLng.lng() } : null);
    if (!clickedLatLng) return;

    setDrawnPoints(prev => [...prev, { lat: clickedLatLng.lat, lng: clickedLatLng.lng }]);
  };

  const handleUndoPoint = () => {
    setDrawnPoints(prev => prev.slice(0, -1));
  };

  const handleClearPoints = () => {
    setDrawnPoints([]);
  };

  const handleGenerateDefaultPolygon = () => {
    const rest = restaurants.find(r => r.id === drawingTargetRestId) || activeRestaurant;
    if (!rest) return;
    // Generate an authentic 6-point perimeter around the restaurant
    const deltaLat = 0.015;
    const deltaLng = 0.022;
    const sample = [
      { lat: rest.lat + deltaLat, lng: rest.lng - deltaLng * 0.7 },
      { lat: rest.lat + deltaLat * 0.9, lng: rest.lng + deltaLng * 0.8 },
      { lat: rest.lat - deltaLat * 0.2, lng: rest.lng + deltaLng * 1.1 },
      { lat: rest.lat - deltaLat, lng: rest.lng + deltaLng * 0.4 },
      { lat: rest.lat - deltaLat * 0.9, lng: rest.lng - deltaLng * 0.8 },
      { lat: rest.lat + deltaLat * 0.1, lng: rest.lng - deltaLng * 1.0 },
    ];
    setDrawnPoints(sample);
  };

  const handleSavePolygon = () => {
    if (drawnPoints.length < 3) {
      alert('Veuillez placer au moins 3 points sur la carte pour fermer le polygone de livraison.');
      return;
    }
    onSaveDeliveryPolygon?.(drawingTargetRestId, drawnPoints);
    setSaveSuccessMsg(`Polygone de livraison (${drawnPoints.length} sommets) enregistré avec succès !`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 ${className}`}>
      
      {/* Top Header Navigation Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Mode Switcher */}
        <div className="pointer-events-auto flex items-center p-1 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 max-w-full overflow-x-auto">
          {/* Suivi live */}
          {trackingOrder && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('tracking');
                recenterOnDriver();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                activeTab === 'tracking'
                  ? 'bg-[#FF4E27] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Suivi Live</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping ml-0.5" />
            </button>
          )}

          {/* Polygones Restaurants */}
          <button
            type="button"
            onClick={() => setActiveTab('polygons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              activeTab === 'polygons'
                ? 'bg-gradient-to-r from-[#FF4E27] to-[#FF7849] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Périmètres Polygones ({restaurants.length})</span>
          </button>

          {/* Zones Circulaires */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('zones');
              if (filteredZones[0]) {
                setCameraState({ center: filteredZones[0].center, zoom: 12 });
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              activeTab === 'zones'
                ? 'bg-[#0F3E2E] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Zones ({zones.length})</span>
          </button>

          {/* Mode Dessin Polygone */}
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              activeTab === 'draw'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
            title="Tracer ou ajuster un polygone de zone de livraison"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>✏️ Dessiner Périmètre</span>
          </button>
        </div>

        {/* Right: GPS / Status Badge */}
        <div className="pointer-events-auto flex items-center gap-2">
          {activeTab === 'tracking' && trackingOrder && (
            <button
              type="button"
              onClick={() => setIsSimulatingGps(!isSimulatingGps)}
              title={isSimulatingGps ? 'Pause GPS' : 'Reprendre le suivi GPS'}
              className="p-2 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 shadow-md border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {isSimulatingGps ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Pause GPS</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Activer GPS</span>
                </>
              )}
            </button>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-[11px] font-mono border border-white/20 flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium hidden sm:inline">Google Maps Interactive</span>
            <span className="text-[10px] text-emerald-400 font-bold">4G Live</span>
          </div>
        </div>
      </div>

      {/* Floating Toolbar when in DRAW MODE */}
      {activeTab === 'draw' && (
        <div className="absolute top-16 left-3 right-3 z-10 pointer-events-auto">
          <div className="p-3 rounded-2xl bg-slate-900/95 text-white backdrop-blur-md shadow-2xl border border-amber-500/40 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-black">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-400">
                    Éditeur Interactif de Polygone de Livraison
                  </h4>
                  <p className="text-[10px] text-slate-300">
                    Cliquez sur la carte Google Maps pour déposer les sommets du périmètre (minimum 3 points).
                  </p>
                </div>
              </div>

              {/* Restaurant Selector for drawing */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Restaurant :</span>
                <select
                  value={drawingTargetRestId}
                  onChange={(e) => {
                    setDrawingTargetRestId(e.target.value);
                    const rest = restaurants.find(r => r.id === e.target.value);
                    if (rest) {
                      setCameraState({ center: { lat: rest.lat, lng: rest.lng }, zoom: 13 });
                    }
                  }}
                  className="bg-slate-800 text-white border border-slate-700 text-xs font-bold rounded-xl px-2.5 py-1 focus:outline-none"
                >
                  {restaurants.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.countryFlag} {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons for Drawing */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  {drawnPoints.length} sommets tracés
                </span>
                <button
                  type="button"
                  onClick={handleUndoPoint}
                  disabled={drawnPoints.length === 0}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Annuler point</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearPoints}
                  disabled={drawnPoints.length === 0}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Effacer</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateDefaultPolygon}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Générer périmètre quartier</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {saveSuccessMsg && (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {saveSuccessMsg}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSavePolygon}
                  disabled={drawnPoints.length < 3}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-black shadow-lg flex items-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer le polygone</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Main Container */}
      <div className="h-[420px] sm:h-[480px] w-full">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'geometry']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={cameraState.center}
            defaultZoom={cameraState.zoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeId={mapType}
            internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            onClick={handleMapClick}
            className="w-full h-full cursor-crosshair"
          >
            <MapCameraController center={cameraState.center} zoom={cameraState.zoom} />

            {/* ============================================================ */}
            {/* 1. DELIVERY POLYGONS (RESTAURANT SERVICE PERIMETERS)         */}
            {/* ============================================================ */}
            {(activeTab === 'polygons' || activeTab === 'tracking') && restaurants.map(restaurant => {
              if (!restaurant.deliveryPolygon || restaurant.deliveryPolygon.length < 3) return null;
              const isSelected = activeRestaurant?.id === restaurant.id;

              return (
                <React.Fragment key={`rest-poly-${restaurant.id}`}>
                  {/* Visually Delimiting Delivery Perimeter Polygon */}
                  <Polygon
                    paths={restaurant.deliveryPolygon}
                    strokeColor={isSelected ? '#FF4E27' : '#0F3E2E'}
                    strokeOpacity={isSelected ? 0.95 : 0.65}
                    strokeWeight={isSelected ? 3.5 : 2}
                    fillColor={isSelected ? '#FF4E27' : '#10B981'}
                    fillOpacity={isSelected ? 0.22 : 0.08}
                    onClick={() => {
                      recenterOnRestaurant(restaurant);
                      setActivePolygonRest(restaurant);
                      setInfoWindowTarget('polygon');
                    }}
                  />

                  {/* Polygon Center Badge / Label */}
                  <AdvancedMarker
                    position={{
                      lat: restaurant.deliveryPolygon.reduce((acc, p) => acc + p.lat, 0) / restaurant.deliveryPolygon.length,
                      lng: restaurant.deliveryPolygon.reduce((acc, p) => acc + p.lng, 0) / restaurant.deliveryPolygon.length
                    }}
                    title={`Périmètre de livraison : ${restaurant.name}`}
                    onClick={() => {
                      recenterOnRestaurant(restaurant);
                      setActivePolygonRest(restaurant);
                      setInfoWindowTarget('polygon');
                    }}
                  >
                    <div className={`cursor-pointer px-2.5 py-1 rounded-xl text-[10px] font-black shadow-lg border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#FF4E27] text-white border-white scale-110 shadow-[#FF4E27]/40 ring-2 ring-white/50'
                        : 'bg-white/95 text-slate-800 border-slate-200 hover:scale-105'
                    }`}>
                      <span>{restaurant.countryFlag}</span>
                      <span>Périmètre {restaurant.name.split(' ')[0]}</span>
                      <span className="px-1 rounded bg-black/20 text-[9px]">
                        ~{restaurant.deliveryRadiusKm || 3}km
                      </span>
                    </div>
                  </AdvancedMarker>
                </React.Fragment>
              );
            })}

            {/* In DRAW MODE: Active preview of drawn polygon */}
            {activeTab === 'draw' && (
              <>
                {drawnPoints.length >= 3 && (
                  <Polygon
                    paths={drawnPoints}
                    strokeColor="#F59E0B"
                    strokeOpacity={0.95}
                    strokeWeight={3}
                    fillColor="#F59E0B"
                    fillOpacity={0.25}
                  />
                )}

                {/* Polyline connecting points if fewer than 3 */}
                {drawnPoints.length >= 2 && drawnPoints.length < 3 && (
                  <Polyline
                    path={drawnPoints}
                    options={{
                      strokeColor: '#F59E0B',
                      strokeOpacity: 0.9,
                      strokeWeight: 3
                    }}
                  />
                )}

                {/* Markers on each drawn point with vertex number */}
                {drawnPoints.map((pt, idx) => (
                  <AdvancedMarker key={`draw-pt-${idx}`} position={pt}>
                    <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-slate-900 text-slate-900 text-[10px] font-black flex items-center justify-center shadow-lg -translate-x-3 -translate-y-3">
                      {idx + 1}
                    </div>
                  </AdvancedMarker>
                ))}
              </>
            )}

            {/* Restaurant Pins */}
            {restaurants.map(rest => {
              const isSelected = activeRestaurant?.id === rest.id;
              return (
                <AdvancedMarker
                  key={`rest-pin-${rest.id}`}
                  position={{ lat: rest.lat, lng: rest.lng }}
                  title={rest.name}
                  onClick={() => recenterOnRestaurant(rest)}
                >
                  <div className="cursor-pointer flex flex-col items-center">
                    <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md border whitespace-nowrap mb-0.5 ${
                      isSelected
                        ? 'bg-[#FF4E27] text-white border-white scale-105'
                        : 'bg-slate-900 text-white border-white/20'
                    }`}>
                      {rest.countryFlag} {rest.name}
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${
                      isSelected ? 'bg-[#FF4E27] text-white' : 'bg-[#0F3E2E] text-white'
                    }`}>
                      <Store className="w-4 h-4" />
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* ============================================================ */}
            {/* 2. CIRCULAR ZONES                                            */}
            {/* ============================================================ */}
            {activeTab === 'zones' && filteredZones.map(zone => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <React.Fragment key={`zone-geom-${zone.id}`}>
                  <Circle
                    center={zone.center}
                    radius={zone.radius}
                    options={{
                      strokeColor: zone.color || '#FF4E27',
                      strokeOpacity: isSelected ? 0.9 : 0.6,
                      strokeWeight: isSelected ? 3 : 2,
                      fillColor: zone.color || '#FF4E27',
                      fillOpacity: isSelected ? 0.25 : 0.12,
                      clickable: true
                    }}
                    onClick={() => handleSelectZone(zone)}
                  />
                  <AdvancedMarker
                    position={zone.center}
                    title={zone.name}
                    onClick={() => handleSelectZone(zone)}
                  >
                    <div className={`cursor-pointer px-2.5 py-1 rounded-xl text-xs font-black shadow-lg border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isSelected
                        ? 'bg-slate-900 text-white border-white scale-110'
                        : 'bg-white/95 text-slate-800 border-slate-200 hover:scale-105'
                    }`}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                      <span>{zone.name.split('(')[0].trim()}</span>
                      <span className="text-[10px] px-1 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                        {zone.baseFee}€
                      </span>
                    </div>
                  </AdvancedMarker>
                </React.Fragment>
              );
            })}

            {/* ============================================================ */}
            {/* 3. LIVE ROUTE & TRACKING OVERLAYS                            */}
            {/* ============================================================ */}
            {activeTab === 'tracking' && trackingOrder && (
              <>
                <Polyline
                  path={routePoints}
                  options={{
                    strokeColor: '#FF4E27',
                    strokeOpacity: 0.85,
                    strokeWeight: 4,
                    geodesic: true
                  }}
                />

                <AdvancedMarker
                  position={origin}
                  title={trackingOrder.restaurantName}
                  onClick={() => setInfoWindowTarget('restaurant')}
                >
                  <div className="cursor-pointer flex flex-col items-center">
                    <div className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[10px] font-black shadow-md border border-white/20 whitespace-nowrap mb-1">
                      🏢 {trackingOrder.restaurantName}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#0F3E2E] border-2 border-white text-white flex items-center justify-center shadow-lg">
                      <Store className="w-4 h-4" />
                    </div>
                  </div>
                </AdvancedMarker>

                <AdvancedMarker
                  position={currentDriverCoords}
                  title={`Livreur: ${trackingOrder.driver?.name || 'Moussa'}`}
                  onClick={() => setInfoWindowTarget('driver')}
                >
                  <div className="cursor-pointer flex flex-col items-center -translate-y-2">
                    <div className="px-2.5 py-1 rounded-xl bg-[#FF4E27] text-white text-[11px] font-black shadow-xl whitespace-nowrap mb-1 flex items-center gap-1 border border-white/50 animate-bounce duration-1000">
                      <Truck className="w-3.5 h-3.5 fill-current" />
                      <span>{trackingOrder.driver?.name?.split(' ')[0] || 'Livreur'} · {remainingMinutes} min</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-[#FF4E27]/40 rounded-full animate-ping" />
                      <div className="relative w-10 h-10 rounded-full bg-white border-2 border-[#FF4E27] text-[#FF4E27] flex items-center justify-center shadow-2xl">
                        <Truck className="w-5 h-5 fill-current" />
                      </div>
                    </div>
                  </div>
                </AdvancedMarker>

                <AdvancedMarker
                  position={destination}
                  title={trackingOrder.customerAddress}
                  onClick={() => setInfoWindowTarget('customer')}
                >
                  <div className="cursor-pointer flex flex-col items-center">
                    <div className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-md border border-white/20 whitespace-nowrap mb-1">
                      📍 {trackingOrder.customerAddress.split(',')[0]}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                </AdvancedMarker>

                {infoWindowTarget === 'driver' && (
                  <InfoWindow
                    position={currentDriverCoords}
                    onCloseClick={() => setInfoWindowTarget(null)}
                  >
                    <div className="p-1 max-w-[220px]">
                      <div className="flex items-center gap-2">
                        <img
                          src={trackingOrder.driver?.avatar}
                          alt="Livreur"
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{trackingOrder.driver?.name}</h4>
                          <p className="text-[10px] text-slate-500">{trackingOrder.driver?.vehicle} · 4.9⭐</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-bold mt-2">
                        Arrivée estimée dans ~{remainingMinutes} minutes
                      </p>
                      <a
                        href={`tel:${trackingOrder.driver?.phone}`}
                        className="mt-2 w-full py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Appeler le livreur</span>
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </>
            )}

            {/* Polygon Info Window */}
            {infoWindowTarget === 'polygon' && activePolygonRest && (
              <InfoWindow
                position={{ lat: activePolygonRest.lat, lng: activePolygonRest.lng }}
                onCloseClick={() => setInfoWindowTarget(null)}
              >
                <div className="p-1.5 max-w-[240px] text-slate-900">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{activePolygonRest.countryFlag}</span>
                    <h4 className="font-black text-xs text-slate-900 truncate">
                      {activePolygonRest.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {activePolygonRest.deliveryZoneName || 'Périmètre de livraison certifié'}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Frais : {activePolygonRest.deliveryFee.toFixed(2)}€</span>
                    <span className="text-emerald-700 font-black">
                      Commission : {(activePolygonRest.deliveryCommissionRate ? (activePolygonRest.deliveryCommissionRate * 100) : 12)}%
                    </span>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Custom Map Controls */}
            <MapControl position={ControlPosition.RIGHT_BOTTOM}>
              <div className="flex flex-col gap-1.5 mr-3 mb-14 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200">
                <button
                  type="button"
                  onClick={recenterOnDriver}
                  title="Recentrer sur le livreur"
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <LocateFixed className="w-4 h-4 text-[#FF4E27]" />
                </button>
                <button
                  type="button"
                  onClick={recenterOnTrajet}
                  title="Voir tout le trajet"
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <Maximize2 className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  type="button"
                  onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
                  title="Basculer vue Satellite / Plan"
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                >
                  <Layers className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </MapControl>

          </Map>
        </APIProvider>
      </div>

      {/* Bottom Information Drawer */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200">
        {activeTab === 'tracking' && trackingOrder ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF4E27]/10 text-[#FF4E27] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Livreur en approche
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {Math.round(driverProgress * 100)}% parcouru
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                  {trackingOrder.driver?.name} ({trackingOrder.driver?.vehicle})
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Temps restant</span>
                <span className="text-sm font-black text-[#FF4E27] flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5" />
                  ~{remainingMinutes} min
                </span>
              </div>
              <a
                href={`tel:${trackingOrder.driver?.phone}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        ) : activeTab === 'polygons' || activeTab === 'draw' ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FF4E27]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Périmètres de Livraison des Restaurants (Polygones Visuels)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Cliquez sur un polygone pour zoomer sur la zone du restaurant
              </span>
            </div>

            {/* Restaurant Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
              {restaurants.map(rest => {
                const isSelected = activeRestaurant?.id === rest.id;
                return (
                  <button
                    key={`poly-card-${rest.id}`}
                    type="button"
                    onClick={() => recenterOnRestaurant(rest)}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-[#FF4E27]'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold" style={{ color: isSelected ? '#FF7849' : '#0F3E2E' }}>
                          {rest.countryFlag} {rest.cuisine.split('&')[0]}
                        </span>
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {rest.deliveryFee.toFixed(2)}€
                        </span>
                      </div>
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {rest.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-200/40 text-[10px]">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>
                        Rayon: ~{rest.deliveryRadiusKm || 3.5} km
                      </span>
                      <span className="text-emerald-500 font-bold">
                        Commission: {(rest.deliveryCommissionRate ? rest.deliveryCommissionRate * 100 : 12)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#0F3E2E]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Zones de livraison desservies ({zones.length})
                </h4>
              </div>
              
              <div className="flex items-center gap-1">
                {['All', 'Paris', 'Dakar', 'Abidjan'].map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCityFilter(city)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      selectedCityFilter === city
                        ? 'bg-[#0F3E2E] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {city === 'All' ? 'Toutes' : city}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {filteredZones.map(zone => {
                const isSelected = selectedZone?.id === zone.id;
                return (
                  <button
                    key={`zone-card-${zone.id}`}
                    type="button"
                    onClick={() => handleSelectZone(zone)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase" style={{ color: isSelected ? '#FF7849' : zone.color }}>
                        ● {zone.city}
                      </span>
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {zone.baseFee}€ · {zone.estMinutes}m
                      </span>
                    </div>
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {zone.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
