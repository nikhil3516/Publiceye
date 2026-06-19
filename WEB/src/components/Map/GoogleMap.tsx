import React, { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { Navigation, AlertCircle, RefreshCw, Route, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const libraries: Libraries = ["places", "geometry"];

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0px'
};

const defaultCenter = {
  lat: 13.0827, // Chennai
  lng: 80.2707
};

// Premium Map Styles
const mapStyles = {
  light: [
    { "featureType": "administrative.land_parcel", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "poi", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] },
    { "featureType": "poi.business", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road.local", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
  ],
  dark: [
    { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
  ]
};

interface MapProps {
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  initialLocation?: { lat: number, lng: number };
  showDirections?: boolean;
  destination?: { lat: number, lng: number };
  markers?: Array<{ id: string, lat: number, lng: number, title: string }>;
  interactive?: boolean;
  showRouteButton?: boolean;
  showLocationButton?: boolean;
}

export function PublicEyeMap({ 
  onLocationSelect, 
  initialLocation, 
  showDirections = false, 
  destination, 
  markers = [],
  interactive = true,
  showRouteButton = false,
  showLocationButton = true
}: MapProps) {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDs5hRftoLjmhUoBwQhcQoTCCmG9fj_jCE",
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(initialLocation || null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [isDirectionsMode, setIsDirectionsMode] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const userIcon = isLoaded ? {
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" fill="%230ea5e9" stroke="white" stroke-width="3"/><circle cx="14" cy="14" r="5" fill="white"/></svg>',
    scaledSize: new window.google.maps.Size(28, 28),
    anchor: new window.google.maps.Point(14, 14)
  } : undefined;

  // Auto-center when initialLocation is provided
  useEffect(() => {
    if (initialLocation && initialLocation.lat !== 0 && map) {
      const timer = setTimeout(() => {
        setMarkerPosition(initialLocation);
      }, 0);
      map.panTo(initialLocation);
      return () => clearTimeout(timer);
    }
  }, [initialLocation, map]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!interactive || !e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPos = { lat, lng };
    setMarkerPosition(newPos);
    
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: newPos }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        onLocationSelect?.(lat, lng, results[0].formatted_address);
      } else {
        onLocationSelect?.(lat, lng, `Pinned at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });
  }, [interactive, onLocationSelect]);

  const centerToMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMarkerPosition(newPos);
          map?.panTo(newPos);
          map?.setZoom(17);
          
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: newPos }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              onLocationSelect?.(newPos.lat, newPos.lng, results[0].formatted_address);
            }
          });
        },
        () => toast.error("Location permission denied"),
        { enableHighAccuracy: true }
      );
    }
  };

  const getDirections = () => {
    if (!markerPosition || !isLoaded) return;
    
    if (isDirectionsMode) {
      setDirections(null);
      setIsDirectionsMode(false);
      setUserLocation(null);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(origin);
          const directionsService = new google.maps.DirectionsService();
          
          directionsService.route(
            {
              origin: origin,
              destination: markerPosition,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                setDirections(result);
                setIsDirectionsMode(true);
                toast.success("Route calculated!");
              } else {
                toast.error("Could not calculate route");
              }
            }
          );
        },
        () => toast.error("Location permission denied to calculate route"),
        { enableHighAccuracy: true }
      );
    }
  };

  // Handle directions calculation when triggered by parent component props
  useEffect(() => {
    if (isLoaded && showDirections && markerPosition && destination) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: markerPosition,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            setUserLocation(markerPosition);
            setIsDirectionsMode(true);
          }
        }
      );
    }
  }, [isLoaded, showDirections, markerPosition, destination]);

  // Clean up directions if showDirections prop is explicitly set to false
  useEffect(() => {
    if (isLoaded && !showDirections && destination) {
      const timer = setTimeout(() => {
        setDirections(null);
        setIsDirectionsMode(false);
        setUserLocation(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [showDirections, isLoaded, destination]);

  if (loadError) {
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">Google Maps Error</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
          Please ensure <strong>Maps JavaScript API</strong> and <strong>Places API</strong> are enabled in your Google Cloud Console.
        </p>
        <Button variant="outline" className="mt-6 rounded-xl flex items-center gap-2" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  return isLoaded ? (
    <div className="relative w-full h-full group">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || defaultCenter}
        zoom={14}
        onLoad={setMap}
        onClick={onMapClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: isDarkMode ? mapStyles.dark : mapStyles.light,
          gestureHandling: interactive ? 'greedy' : 'none'
        }}
      >
        {markerPosition && (
          <Marker 
            position={markerPosition} 
            animation={window.google?.maps.Animation.DROP}
          />
        )}

        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={userIcon}
            title="Starting Point"
          />
        )}

        {markers.map(m => (
          <Marker 
            key={m.id} 
            position={{ lat: m.lat, lng: m.lng }} 
            title={m.title}
          />
        ))}

        {directions && (
          <DirectionsRenderer 
            directions={directions} 
            options={{ 
              polylineOptions: { strokeColor: '#0d9488', strokeWeight: 6, strokeOpacity: 0.8 },
              suppressMarkers: true 
            }} 
          />
        )}
      </GoogleMap>

      {/* Floating Route Summary Card */}
      {directions && directions.routes[0]?.legs[0] && (
        <div className="absolute bottom-6 left-6 right-24 md:right-auto z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom duration-300 max-w-[280px] md:max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Route</p>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {directions.routes[0].legs[0].duration?.text || 'Calculating...'}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  ({directions.routes[0].legs[0].distance?.text || '...'})
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-bold text-xs h-9 border-slate-200 dark:border-slate-700"
              onClick={() => {
                setDirections(null);
                setIsDirectionsMode(false);
                setUserLocation(null);
              }}
            >
              Clear Route
            </Button>
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs h-9 shadow-md"
              onClick={() => {
                const leg = directions.routes[0]?.legs[0];
                if (leg) {
                  const originLat = leg.start_location.lat();
                  const originLng = leg.start_location.lng();
                  const destLat = leg.end_location.lat();
                  const destLng = leg.end_location.lng();
                  window.open(`https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`, '_blank');
                }
              }}
            >
              Open in Maps
            </Button>
          </div>
        </div>
      )}

      {interactive && (
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
          {showRouteButton && (
            <Button
              onClick={getDirections}
              className={`shadow-2xl rounded-2xl h-14 w-14 p-0 transition-all active:scale-90 border-2 border-slate-100 dark:border-slate-700 ${
                isDirectionsMode 
                  ? 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700' 
                  : 'bg-white dark:bg-slate-800 hover:bg-teal-500 dark:hover:bg-teal-600 text-teal-600 dark:text-teal-400 hover:text-white'
              }`}
            >
              {isDirectionsMode ? <X className="w-6 h-6" /> : <Route className="w-6 h-6" />}
            </Button>
          )}
          {showLocationButton && (
            <Button
              onClick={centerToMyLocation}
              className="bg-white dark:bg-slate-800 hover:bg-teal-500 dark:hover:bg-teal-600 text-teal-600 dark:text-teal-400 hover:text-white shadow-2xl rounded-2xl h-14 w-14 p-0 transition-all active:scale-90 border-2 border-slate-100 dark:border-slate-700"
            >
              <Navigation className="w-6 h-6" />
            </Button>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-[1.5rem]">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Loading Maps...</p>
    </div>
  );
}
