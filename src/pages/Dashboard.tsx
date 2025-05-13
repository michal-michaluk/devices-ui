import { DeviceList } from "@/components/devices/DeviceList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useDevices } from "@/hooks/useDevices";
import { Device } from "@/types/device";
import { Activity, AlertCircle, MapPin, PlugZap } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
    const { devices, loading, error } = useDevices();
    const [hoveredDevice, setHoveredDevice] = useState<Device | null>(null);
    const { user } = useAuth();

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
                        <CardContent className="p-0 h-full flex items-center justify-center bg-muted/40 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <MapPin className="h-64 w-64" />
                            </div>
                            <div className="text-center p-8">
                                <h3 className="text-lg font-medium">
                                    Google Maps Integration
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    The map will show device locations from your
                                    account
                                </p>
                                {hoveredDevice && (
                                    <div className="mt-8 border rounded-lg p-4 bg-card max-w-xs mx-auto text-left">
                                        <h4 className="font-semibold">
                                            {hoveredDevice.boot.vendor}{" "}
                                            {hoveredDevice.boot.model}
                                        </h4>
                                        <div className="mt-2 text-sm">
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Status:
                                                </span>{" "}
                                                {hoveredDevice.status ||
                                                    "Unknown"}
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Location:
                                                </span>{" "}
                                                {hoveredDevice.location.city},{" "}
                                                {hoveredDevice.location.country}
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Coordinates:
                                                </span>{" "}
                                                {hoveredDevice.location.coordinates.latitude.toFixed(
                                                    4
                                                )}
                                                ,{" "}
                                                {hoveredDevice.location.coordinates.longitude.toFixed(
                                                    4
                                                )}
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Operator:
                                                </span>{" "}
                                                {
                                                    hoveredDevice.ownership
                                                        .operator
                                                }
                                            </p>
                                            <p>
                                                <span className="text-muted-foreground">
                                                    Public Access:
                                                </span>{" "}
                                                {hoveredDevice.settings
                                                    .publicAccess
                                                    ? "Yes"
                                                    : "No"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
