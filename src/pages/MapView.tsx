import { DeviceCard } from "@/components/devices/DeviceCard";
import GoogleMapComponent from "@/components/map/GoogleMapComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { GOOGLE_MAPS_API_KEY } from "@/config/maps";
import { useDevices } from "@/hooks/useDevices";
import { Device } from "@/types/device";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

const MapView = () => {
    const { devices, loading, error } = useDevices();
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const { toast } = useToast();

    // Filter devices that have location data and should be shown on map
    const visibleDevices = devices.filter(
        (device) =>
            device.settings.showOnMap &&
            device.location?.coordinates?.latitude &&
            device.location?.coordinates?.longitude
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-lg">Loading map...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-destructive flex items-center gap-2">
                    <AlertCircle />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    const handleDeviceSelect = (device: Device | null) => {
        setSelectedDevice(device);
        if (device) {
            toast({
                title: "Device Selected",
                description: `${device.boot.vendor} ${device.boot.model} - ${device.status}`,
                duration: 3000,
            });
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Map View</h1>

            <div className="grid grid-cols-1 gap-6">
                <Card className="h-[600px]">
                    <CardContent className="p-0 h-full">
                        {!GOOGLE_MAPS_API_KEY ? (
                            <div className="flex flex-col items-center justify-center h-full p-8">
                                <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                    Google Maps API Key Missing
                                </h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    To display the map, you need to provide a
                                    Google Maps API key in the environment
                                    variable VITE_GOOGLE_MAPS_API_KEY.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        window.open(
                                            "https://developers.google.com/maps/documentation/javascript/get-api-key",
                                            "_blank"
                                        )
                                    }
                                >
                                    Get API Key
                                </Button>
                            </div>
                        ) : (
                            <GoogleMapComponent
                                devices={visibleDevices}
                                onDeviceSelect={handleDeviceSelect}
                                selectedDevice={selectedDevice}
                                apiKey={GOOGLE_MAPS_API_KEY}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Selected device info */}
                {selectedDevice && (
                    <div className="mt-4">
                        <DeviceCard device={selectedDevice} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapView;
