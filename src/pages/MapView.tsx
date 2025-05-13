import { DeviceCard } from "@/components/devices/DeviceCard";
import { Card, CardContent } from "@/components/ui/card";
import { useDevices } from "@/hooks/useDevices";
import { Device } from "@/types/device";
import { AlertCircle, MapPin } from "lucide-react";
import { useState } from "react";

const MapView = () => {
    const { devices, loading, error } = useDevices();
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

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

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Map View</h1>

            <div className="grid grid-cols-1 gap-6">
                <Card className="h-[600px]">
                    <CardContent className="p-0 h-full flex items-center justify-center bg-muted/40 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <MapPin className="h-64 w-64" />
                        </div>

                        <div className="text-center p-8 w-full">
                            <h3 className="text-lg font-medium">
                                Google Maps Integration
                            </h3>
                            <p className="text-sm text-muted-foreground mt-2 mb-8">
                                The map will display all devices from your
                                account
                            </p>

                            {/* Map device markers simulation */}
                            <div className="flex justify-center gap-4">
                                {devices.map((device) => (
                                    <div
                                        key={device.deviceId}
                                        className="relative group"
                                        onClick={() =>
                                            setSelectedDevice(device)
                                        }
                                    >
                                        <div
                                            className={`h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all
                        ${
                            device.status === "online"
                                ? "bg-green-500"
                                : device.status === "offline"
                                ? "bg-gray-500"
                                : device.status === "error"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                        } 
                        ${
                            selectedDevice?.deviceId === device.deviceId
                                ? "ring-4 ring-primary"
                                : ""
                        }
                      `}
                                        >
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                                            {device.boot.vendor.split(" ")[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Selected device info */}
                            {selectedDevice && (
                                <div className="mt-16 max-w-md mx-auto">
                                    <DeviceCard device={selectedDevice} />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MapView;
