import * as Location from "expo-location";

export type BreakdownLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export const MAX_GPS_ACCURACY_METERS = 50;

export async function getCurrentBreakdownLocation(): Promise<BreakdownLocation> {
  // Check whether location services are enabled.
  const servicesEnabled = await Location.hasServicesEnabledAsync();

  if (!servicesEnabled) {
    throw new Error(
      "Your device location is turned off. Please enable GPS or use the manual location option.",
    );
  }

  // Request permission only when the rider needs to share their location.
  const permission = await Location.requestForegroundPermissionsAsync();

  if (!permission.granted) {
    throw new Error(
      "Location permission was denied. Please allow location access or use the manual location option.",
    );
  }

  // Request a high-accuracy GPS reading.
  let position: Location.LocationObject;

  try {
    position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch {
    throw new Error(
      "We couldn't get your current location. Please try again or use the manual location option.",
    );
  }

  const { latitude, longitude, accuracy } = position.coords;

  // Validate the GPS coordinates and accuracy.
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Your device returned invalid GPS coordinates.");
  }

  if (accuracy === null || !Number.isFinite(accuracy)) {
    throw new Error(
      "GPS accuracy is unavailable. Please try again or use the manual location option.",
    );
  }

  if (accuracy > MAX_GPS_ACCURACY_METERS) {
    throw new Error(
      `Your GPS signal is not accurate enough yet (${Math.round(accuracy)}m). Please move to an area with a clearer GPS signal and try again.`,
    );
  }

  return {
    latitude,
    longitude,
    accuracy,
  };
}
