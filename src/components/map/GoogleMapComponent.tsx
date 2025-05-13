import { Device } from "@/types/device";
import {
    GoogleMap,
    InfoWindow,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";

// Define the container style for the map
const containerStyle = {
    width: "100%",
    height: "100%",
};

// Default center location (can be adjusted based on your needs)
const defaultCenter = {
    lat: 51.1, // Center around Wrocław, Poland
    lng: 17.0,
};

// Map options
const defaultOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    clickableIcons: false,
    keyboardShortcuts: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    fullscreenControl: true,
};

interface GoogleMapComponentProps {
    devices: Device[];
    onDeviceSelect?: (device: Device | null) => void;
    selectedDevice?: Device | null;
    apiKey: string;
}

const GoogleMapComponent = ({
    devices,
    onDeviceSelect,
    selectedDevice,
    apiKey,
}: GoogleMapComponentProps) => {
    // Load the Google Maps JavaScript API
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: apiKey,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [infoWindowDevice, setInfoWindowDevice] = useState<Device | null>(
        null
    );
    const mapRef = useRef<google.maps.Map | null>(null);

    // Callback for when the map is loaded
    const onLoad = useCallback(
        (map: google.maps.Map) => {
            mapRef.current = map;
            setMap(map);

            // Fit bounds to include all markers if there are devices
            if (devices.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                devices.forEach((device) => {
                    bounds.extend({
                        lat: device.location.coordinates.latitude,
                        lng: device.location.coordinates.longitude,
                    });
                });
                map.fitBounds(bounds);
            }
        },
        [devices]
    );

    // Callback for when the map unmounts
    const onUnmount = useCallback(() => {
        mapRef.current = null;
        setMap(null);
    }, []);

    // Handle marker click
    const handleMarkerClick = (device: Device) => {
        setInfoWindowDevice(device);
        if (onDeviceSelect) {
            onDeviceSelect(device);
        }
    };

    // Handle info window close
    const handleInfoWindowClose = () => {
        setInfoWindowDevice(null);
    };

    // Get marker icon based on device status
    const getMarkerIcon = (status?: string) => {
        switch (status) {
            case "online":
                return {
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                };
            case "offline":
                return {
                    url: "http://maps.google.com/mapfiles/ms/icons/gray-dot.png",
                };
            case "error":
                return {
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                };
            default:
                return {
                    url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                };
        }
    };

    if (loadError) {
        return (
            <div className="text-destructive">
                Map cannot be loaded: {loadError.message}
            </div>
        );
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={defaultOptions}
        >
            {devices.map((device) => (
                <Marker
                    key={device.deviceId}
                    position={{
                        lat: device.location.coordinates.latitude,
                        lng: device.location.coordinates.longitude,
                    }}
                    onClick={() => handleMarkerClick(device)}
                    icon={getMarkerIcon(device.status)}
                    animation={
                        selectedDevice?.deviceId === device.deviceId
                            ? google.maps.Animation.BOUNCE
                            : undefined
                    }
                />
            ))}

            {infoWindowDevice && (
                <InfoWindow
                    position={{
                        lat: infoWindowDevice.location.coordinates.latitude,
                        lng: infoWindowDevice.location.coordinates.longitude,
                    }}
                    onCloseClick={handleInfoWindowClose}
                >
                    <div className="p-2 max-w-xs">
                        <h3 className="font-medium text-base">
                            {infoWindowDevice.boot.vendor}{" "}
                            {infoWindowDevice.boot.model}
                        </h3>
                        <p className="text-sm mb-1">
                            {infoWindowDevice.location.street}{" "}
                            {infoWindowDevice.location.houseNumber}
                        </p>
                        <p className="text-sm">
                            {infoWindowDevice.location.city},{" "}
                            {infoWindowDevice.location.country}
                        </p>
                        <div className="mt-2">
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    infoWindowDevice.status === "online"
                                        ? "bg-green-100 text-green-800"
                                        : infoWindowDevice.status === "offline"
                                        ? "bg-gray-100 text-gray-800"
                                        : infoWindowDevice.status === "error"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                                {infoWindowDevice.status}
                            </span>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    ) : (
        <div className="animate-pulse flex items-center justify-center h-full">
            <p>Loading Map...</p>
        </div>
    );
};

export default GoogleMapComponent;
