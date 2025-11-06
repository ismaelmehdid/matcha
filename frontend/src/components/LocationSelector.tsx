import { useState } from 'react';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { getCurrentPosition, getGeolocationErrorMessage, type GeolocationError } from '../utils/geolocation';
import { userApi } from '@/api/user/user';

interface LocationSelectorProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
  currentLocation?: { latitude: number; longitude: number; cityName?: string; countryName?: string } | null;
  disabled?: boolean;
}

type LocationStatus = 'idle' | 'loading' | 'resolving' | 'success' | 'error';

export function LocationSelector({ onLocationSelect, currentLocation, disabled }: LocationSelectorProps) {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [resolvedLocation, setResolvedLocation] = useState<{ cityName: string; countryName: string } | null>(null);

  const handleGetLocation = async () => {
    setStatus('loading');
    setError(null);
    setResolvedLocation(null);

    try {
      // Step 1: Get GPS coordinates
      const position = await getCurrentPosition();

      // Step 2: Resolve city and country from coordinates
      setStatus('resolving');
      const locationData = await userApi.resolveLocationByCoordinates(position.latitude, position.longitude);

      setResolvedLocation(locationData);
      onLocationSelect(position.latitude, position.longitude);
      setStatus('success');
    } catch (err) {
      const geoError = err as GeolocationError;
      setError(getGeolocationErrorMessage(geoError));
      setStatus('error');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Your location helps us show you matches in your area. We'll use GPS or your IP address to determine your approximate location.
        </p>
      </div>

      {(currentLocation?.cityName && currentLocation?.countryName) || resolvedLocation ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm font-medium text-green-800">
            Current location: {resolvedLocation?.cityName || currentLocation?.cityName}, {resolvedLocation?.countryName || currentLocation?.countryName}
          </p>
          {currentLocation && (
            <p className="text-xs text-green-600 mt-1">
              Coordinates: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </p>
          )}
        </div>
      ) : null}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleGetLocation}
          disabled={disabled || status === 'loading' || status === 'resolving'}
          className="flex items-center gap-2"
        >
          {(status === 'loading' || status === 'resolving') && <Spinner className="h-4 w-4" />}
          {status === 'loading' ? 'Getting coordinates...' : status === 'resolving' ? 'Resolving location...' : 'Detect My Location'}
        </Button>

        {(currentLocation || resolvedLocation) && (
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            disabled={disabled || status === 'loading' || status === 'resolving'}
          >
            Update Location
          </Button>
        )}
      </div>

      {status === 'success' && resolvedLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            Location detected: {resolvedLocation.cityName}, {resolvedLocation.countryName}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Your location will be saved when you submit the form.
          </p>
        </div>
      )}

      {status === 'error' && error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm font-medium text-red-800 mb-1">Location Error</p>
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-red-500 mt-2">
            Don't worry - we'll try to detect your location using your IP address when you submit the form.
          </p>
        </div>
      )}

      {status === 'idle' && !currentLocation && !resolvedLocation && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-600">
            Click "Detect My Location" to automatically detect your location, or we'll use your IP address as a fallback.
          </p>
        </div>
      )}
    </div>
  );
}
