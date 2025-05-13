import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Device } from "@/types/device";
import { Eye, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface DeviceCardProps {
    device: Device;
    onHover?: () => void;
}

export function DeviceCard({ device, onHover }: DeviceCardProps) {
    // Get status color based on device status
    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case "online":
                return "bg-green-500";
            case "offline":
                return "bg-gray-500";
            case "error":
                return "bg-red-500";
            case "maintenance":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    // Get formatted device name based on boot information
    const getDeviceName = (device: Device) => {
        return `${device.boot.vendor} ${device.boot.model}`;
    };

    return (
        <Card
            className="transition-all duration-200 hover:shadow-md"
            onMouseEnter={onHover}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">
                            {getDeviceName(device)}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground mt-1">
                            ID: {device.boot.serial}
                        </div>
                    </div>
                    <Badge
                        variant={
                            device.status === "online" ? "default" : "outline"
                        }
                    >
                        <span
                            className={`inline-block w-2 h-2 rounded-full mr-1.5 ${getStatusColor(
                                device.status
                            )}`}
                        ></span>
                        {device.status
                            ? device.status.charAt(0).toUpperCase() +
                              device.status.slice(1)
                            : "Unknown"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Protocol:</span>
                        <span>{device.boot.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Operator:</span>
                        <span>{device.ownership.operator}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider:</span>
                        <span>{device.ownership.provider}</span>
                    </div>
                    <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-right">
                            {device.location.city}, {device.location.country}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Public access:
                        </span>
                        <span>
                            {device.settings.publicAccess ? "Yes" : "No"}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link to={`/devices/${device.deviceId}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
