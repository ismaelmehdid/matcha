import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent } from './ui/card';
import { Spinner } from './ui/spinner';
import { userApi } from '@/api/user/user';
import { MapPin } from 'lucide-react';

// Fix for default marker icon in React-Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (location: { latitude: number; longitude: number; cityName: string; countryName: string }) => void;
}

// Component to capture map instance
function MapController({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) {
  const map = useMapEvents({});

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
}

// Component to handle map click events
function LocationMarker({ position, onPositionChange }: {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.on('dragend', () => {
        const markerLatLng = marker.getLatLng();
        onPositionChange(markerLatLng.lat, markerLatLng.lng);
      });
    }
  }, [onPositionChange]);

  return (
    <Marker
      position={position}
      draggable={true}
      ref={markerRef}
    />
  );
}

export function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([latitude, longitude]);
  const [isResolving, setIsResolving] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  // Auto-detect location by IP on initial load
  useEffect(() => {
    const autoDetectByIp = async () => {
      try {
        // Get user's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;

        // Get coordinates from IP
        const coordinates = await userApi.resolveLocationByIpAddress(ipAddress);
        const newPosition: [number, number] = [coordinates.latitude, coordinates.longitude];
        setPosition(newPosition);

        // Center map on new position
        if (mapRef.current) {
          mapRef.current.setView(newPosition, 13);
        }
      } catch (error) {
        console.error('Failed to auto-detect location by IP:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    // Only auto-detect on initial load
    if (isInitialLoad) {
      autoDetectByIp();
    }
  }, [isInitialLoad]);

  // Debounce reverse geocoding to avoid too many requests
  // Call onLocationChange with updated location data when position changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsResolving(true);
      try {
        const data = await userApi.resolveLocationByCoordinates(position[0], position[1]);
        setLocationName(`${data.cityName}, ${data.countryName}`);

        // Notify parent about location change (but parent will decide when to save)
        onLocationChange({
          latitude: position[0],
          longitude: position[1],
          cityName: data.cityName,
          countryName: data.countryName,
        });
      } catch (error) {
        console.error('Failed to resolve location:', error);
        setLocationName(null);
      } finally {
        setIsResolving(false);
      }
    }, 500); // Wait 500ms after user stops moving marker

    return () => clearTimeout(timer);
  }, [position, onLocationChange]);

  const handlePositionChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
  };

  return (
    <div className="space-y-3">
      {/* Location display */}
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          {isResolving ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">Resolving location...</span>
            </div>
          ) : locationName ? (
            <div>
              <p className="text-sm font-medium">{locationName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden rounded-md">
          <div className="h-[400px] w-full relative">
            <MapContainer
              center={position}
              zoom={13}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController mapRef={mapRef} />
              <LocationMarker position={position} onPositionChange={handlePositionChange} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to select your location
      </p>
    </div>
  );
}
