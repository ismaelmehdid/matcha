import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { getCurrentPosition, getGeolocationErrorMessage, type GeolocationError } from '../utils/geolocation';
import { userApi } from '@/api/user/user';
import { useUpdateLocation } from '@/hooks/useUpdateLocation';
import { toast } from 'sonner';
import { MapPicker } from './MapPicker';
import { Map } from 'lucide-react';

interface LocationSelectorProps {
  onLocationSelect?: (location: { latitude: number; longitude: number; cityName: string; countryName: string }) => void;
  currentLocation?: { latitude: number; longitude: number; cityName?: string; countryName?: string } | null;
  disabled?: boolean;
  standalone?: boolean;
  showLabel?: boolean;
}

type LocationStatus = 'idle' | 'loading' | 'resolving' | 'success' | 'error';

export function LocationSelector({
  onLocationSelect,
  currentLocation,
  disabled,
  standalone = false,
  showLabel = false
}: LocationSelectorProps) {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resolvedLocation, setResolvedLocation] = useState<{ cityName: string; countryName: string } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [pendingMapLocation, setPendingMapLocation] = useState<{ latitude: number; longitude: number; cityName: string; countryName: string } | null>(null);

  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation();

  const getButtonText = () => {
    if (status === 'loading') return 'Getting coordinates...';
    if (status === 'resolving') return 'Resolving location...';
    if (isUpdating) return 'Updating...';
    return 'Share Location';
  };

  const handleGetLocation = async () => {
    setStatus('loading');
    setError(null);
    setResolvedLocation(null);

    try {
      // Step 1: Try to get GPS coordinates
      const position = await getCurrentPosition();

      // Step 2: Resolve city and country from coordinates
      setStatus('resolving');
      const locationData = await userApi.resolveLocationByCoordinates(position.latitude, position.longitude);

      setResolvedLocation(locationData);

      // If standalone mode, update location directly via API
      if (standalone) {
        updateLocation({ latitude: position.latitude, longitude: position.longitude });
      } else if (onLocationSelect) {
        // Otherwise, call the callback for form integration
        onLocationSelect({
          latitude: position.latitude,
          longitude: position.longitude,
          cityName: locationData.cityName,
          countryName: locationData.countryName,
        });
      }

      setStatus('success');
    } catch (gpsError) {
      // GPS failed, try IP-based location as fallback
      console.log('GPS failed, trying IP-based location...');

      try {
        setStatus('resolving');

        // Get user's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipAddress = ipData.ip;

        // Get coordinates from IP
        const coordinates = await userApi.resolveLocationByIpAddress(ipAddress);

        // Resolve city and country from coordinates
        const locationData = await userApi.resolveLocationByCoordinates(coordinates.latitude, coordinates.longitude);

        setResolvedLocation(locationData);

        // If standalone mode, update location directly via API
        if (standalone) {
          updateLocation({ latitude: coordinates.latitude, longitude: coordinates.longitude });
        } else if (onLocationSelect) {
          // Otherwise, call the callback for form integration
          onLocationSelect({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            cityName: locationData.cityName,
            countryName: locationData.countryName,
          });
        }

        setStatus('success');
      } catch (ipError) {
        // Both GPS and IP failed
        const geoError = gpsError as GeolocationError;
        const errorMessage = getGeolocationErrorMessage(geoError);
        setError(errorMessage);
        setStatus('error');

        if (standalone) {
          toast.error('Failed to detect location. Please try again or enable location permissions.');
        }
      }
    }
  };

  const handleMapLocationChange = useCallback((location: { latitude: number; longitude: number; cityName: string; countryName: string }) => {
    // Just store the pending location, don't update yet
    setPendingMapLocation(location);
    setResolvedLocation({ cityName: location.cityName, countryName: location.countryName });
  }, []);

  const handleCloseMap = () => {
    setShowMap(false);

    // Only update when closing the map
    if (pendingMapLocation) {
      // If standalone mode, update location directly via API
      if (standalone) {
        updateLocation({ latitude: pendingMapLocation.latitude, longitude: pendingMapLocation.longitude });
      } else if (onLocationSelect) {
        // Otherwise, call the callback for form integration
        onLocationSelect(pendingMapLocation);
      }

      setStatus('success');
      setPendingMapLocation(null);
    }
  };

  return (
    <div className="space-y-4">
      {showLabel && (
        <div>
          <label className="text-sm leading-snug font-semibold">
            Where are you now?
          </label>
          <p className="text-sm text-gray-500 mb-3 mt-1">
            We'll use your location to find matches around you
          </p>
        </div>
      )}

      {((currentLocation?.cityName && currentLocation?.countryName) || (resolvedLocation?.cityName && resolvedLocation?.countryName)) && !showMap ? (
        <div className="bg-accent/50 border border-border rounded-md p-3">
          <p className="text-sm font-medium text-foreground">
            Current location: {resolvedLocation?.cityName || currentLocation?.cityName}, {resolvedLocation?.countryName || currentLocation?.countryName}
          </p>
        </div>
      ) : null}

      {showMap ? (
        <div className="space-y-3">
          <MapPicker
            latitude={currentLocation?.latitude || 0}
            longitude={currentLocation?.longitude || 0}
            onLocationChange={handleMapLocationChange}
          />
          <Button
            type="button"
            variant="default"
            onClick={handleCloseMap}
            className="w-full"
          >
            Confirm Location
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={handleGetLocation}
            disabled={disabled || status === 'loading' || status === 'resolving' || isUpdating}
            className="flex items-center gap-2 flex-1"
          >
            {(status === 'loading' || status === 'resolving' || isUpdating) && <Spinner className="h-4 w-4" />}
            {getButtonText()}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMap(true)}
            disabled={disabled}
            className="flex items-center gap-2 flex-1"
          >
            <Map className="h-4 w-4" />
            Select on Map
          </Button>
        </div>
      )}

      {status === 'error' && error && !showMap && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3">
          <p className="text-sm font-medium text-destructive mb-1">Location Error</p>
          <p className="text-sm text-destructive/90">{error}</p>
        </div>
      )}
    </div>
  );
}
