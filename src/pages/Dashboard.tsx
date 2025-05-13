import { DeviceList } from "@/components/devices/DeviceList";
import GoogleMapComponent from "@/components/map/GoogleMapComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GOOGLE_MAPS_API_KEY } from "@/config/maps";
import { useAuth } from "@/contexts/AuthContext";
import { useDevices } from "@/hooks/useDevices";
import { Device } from "@/types/device";
import { Activity, AlertCircle, PlugZap } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
    const { devices, loading, error } = useDevices();
    const [hoveredDevice, setHoveredDevice] = useState<Device | null>(null);
    const { user } = useAuth();

    // Filter devices that have location data and should be shown on map
    const visibleDevices = devices.filter(
        (device) =>
            device.settings.showOnMap &&
            device.location?.coordinates?.latitude &&
            device.location?.coordinates?.longitude
    );

    // Count devices by status
    const onlineCount = devices.filter((d) => d.status === "online").length;
    const offlineCount = devices.filter((d) => d.status === "offline").length;
    const errorCount = devices.filter((d) => d.status === "error").length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-lg">Loading devices...</div>
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
            <h1 className="text-3xl font-bold mb-6">Device Dashboard</h1>

            {user && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Stats cards */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Devices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <PlugZap className="h-5 w-5 text-primary mr-2" />
                                <div className="text-2xl font-bold">
                                    {devices.length}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Online
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Activity className="h-5 w-5 text-green-500 mr-2" />
                                <div className="text-2xl font-bold">
                                    {onlineCount}
                                </div>
                                <div className="text-xs text-muted-foreground ml-2">
                                    (
                                    {Math.round(
                                        (onlineCount / devices.length) * 100
                                    )}
                                    %)
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Issues
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                                <div className="text-2xl font-bold">
                                    {errorCount}
                                </div>
                                <div className="text-xs text-muted-foreground ml-2">
                                    (
                                    {Math.round(
                                        (errorCount / devices.length) * 100
                                    )}
                                    %)
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[600px]">
                    <h2 className="text-xl font-semibold mb-4">Device List</h2>
                    <DeviceList
                        devices={devices}
                        onDeviceHover={setHoveredDevice}
                    />
                </div>

                <div className="h-[600px]">
                    <h2 className="text-xl font-semibold mb-4">Device Map</h2>
                    <Card className="h-full">
                        <CardContent className="p-0 h-full">
                            {GOOGLE_MAPS_API_KEY ? (
                                <GoogleMapComponent
                                    devices={visibleDevices}
                                    selectedDevice={hoveredDevice}
                                    apiKey={GOOGLE_MAPS_API_KEY}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-8 bg-muted/40">
                                    <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                                    <h3 className="text-lg font-medium mb-2">
                                        Google Maps API Key Missing
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-center">
                                        To display the map, you need to provide
                                        a Google Maps API key in the environment
                                        variable VITE_GOOGLE_MAPS_API_KEY.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
