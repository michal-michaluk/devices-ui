import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useDevices } from "@/hooks/useDevices";
import { Device } from "@/types/device";
import {
    AlertCircle,
    ArrowLeft,
    FileDown,
    RefreshCw,
    Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeviceDetail = () => {
    const { deviceId } = useParams<{ deviceId: string }>();
    const { devices, loading, error } = useDevices();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [device, setDevice] = useState<Device | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState("");
    const [dialogResponse, setDialogResponse] = useState("");

    // Find device from the list
    useEffect(() => {
        if (devices.length > 0 && deviceId) {
            const foundDevice = devices.find((d) => d.deviceId === deviceId);
            if (foundDevice) {
                setDevice(foundDevice);
            }
        }
    }, [devices, deviceId]);

    // Get background color based on status
    const getStatusColor = (status?: string) => {
        switch (status) {
            case "online":
                return "bg-green-500/10 text-green-600 border-green-200";
            case "offline":
                return "bg-gray-500/10 text-gray-600 border-gray-200";
            case "error":
                return "bg-red-500/10 text-red-600 border-red-200";
            case "maintenance":
                return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
            default:
                return "bg-gray-500/10 text-gray-600 border-gray-200";
        }
    };

    // Determine if user can edit based on role
    const canEdit =
        user &&
        (user.role === "engineer" ||
            user.role === "customer_service" ||
            (user.role === "service_provider" &&
                device?.ownership.provider === user.tenantId));

    // Handle remote actions
    const handleRemoteAction = (action: string) => {
        setDialogAction(action);
        setDialogResponse("");
        setDialogOpen(true);

        // Simulate device response after a delay
        setTimeout(() => {
            let response = "";

            switch (action) {
                case "restart":
                    response =
                        "Device restart initiated successfully. Device will be back online in approximately 2 minutes.";
                    break;
                case "update":
                    response = `Firmware update process started. Current version: ${
                        device?.boot.firmware
                    }, Target version: ${
                        parseFloat(device?.boot.firmware || "1.0") + 0.1
                    }. This may take up to 10 minutes to complete.`;
                    break;
                case "status":
                    response = JSON.stringify(
                        {
                            status: device?.status,
                            uptime: "72h 15m",
                            protocol: device?.boot.protocol,
                            vendor: device?.boot.vendor,
                            model: device?.boot.model,
                            publicAccess: device?.settings.publicAccess,
                            roamingEnabled: device?.visibility.roamingEnabled,
                            violations: device?.violations,
                        },
                        null,
                        2
                    );
                    break;
                default:
                    response = "Unknown command";
            }

            setDialogResponse(response);
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-lg">Loading device...</div>
            </div>
        );
    }

    if (error || !device) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-full">
                <div className="text-destructive flex items-center gap-2">
                    <AlertCircle />
                    <span>{error || "Device not found"}</span>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        );
    }

    // Get device display name
    const deviceName = `${device.boot.vendor} ${device.boot.model}`;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">{deviceName}</h1>
                    {device.status && (
                        <Badge
                            className={`ml-2 ${getStatusColor(device.status)}`}
                        >
                            {device.status.charAt(0).toUpperCase() +
                                device.status.slice(1)}
                        </Badge>
                    )}
                </div>

                {canEdit && (
                    <div className="flex gap-2">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        handleRemoteAction("restart")
                                    }
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />{" "}
                                    Restart
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {dialogAction === "restart" &&
                                            "Restart Device"}
                                        {dialogAction === "update" &&
                                            "Update Firmware"}
                                        {dialogAction === "status" &&
                                            "Device Status"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {dialogAction === "restart" &&
                                            "The device will be restarted remotely."}
                                        {dialogAction === "update" &&
                                            "The device firmware will be updated to the latest version."}
                                        {dialogAction === "status" &&
                                            "Retrieving current device status..."}
                                    </DialogDescription>
                                </DialogHeader>
                                {dialogResponse ? (
                                    <div className="bg-muted p-4 rounded text-sm font-mono whitespace-pre overflow-auto max-h-[300px]">
                                        {dialogResponse}
                                    </div>
                                ) : (
                                    <div className="flex justify-center p-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            onClick={() => handleRemoteAction("update")}
                        >
                            <Upload className="mr-2 h-4 w-4" /> Update Firmware
                        </Button>

                        <Button
                            variant="default"
                            onClick={() => handleRemoteAction("status")}
                        >
                            <FileDown className="mr-2 h-4 w-4" /> Get Status
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="details">
                        <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                            <TabsTrigger value="visibility">
                                Visibility
                            </TabsTrigger>
                        </TabsList>

                        {/* Details Tab */}
                        <TabsContent value="details" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Device Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Device ID
                                            </h3>
                                            <p>{device.deviceId}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Serial Number
                                            </h3>
                                            <p>{device.boot.serial}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Vendor
                                            </h3>
                                            <p>{device.boot.vendor}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Model
                                            </h3>
                                            <p>{device.boot.model}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Protocol
                                            </h3>
                                            <p>{device.boot.protocol}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Firmware
                                            </h3>
                                            <p>{device.boot.firmware}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Ownership</CardTitle>
                                    {canEdit && (
                                        <CardDescription>
                                            Editable by administrators and
                                            service providers
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Operator
                                            </h3>
                                            <p>{device.ownership.operator}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Provider
                                            </h3>
                                            <p>{device.ownership.provider}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Location</CardTitle>
                                    {canEdit && (
                                        <CardDescription>
                                            Editable by administrators and
                                            service providers
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Street
                                                </h3>
                                                <p>
                                                    {device.location.street}{" "}
                                                    {
                                                        device.location
                                                            .houseNumber
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    City
                                                </h3>
                                                <p>{device.location.city}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Postal Code
                                                </h3>
                                                <p>
                                                    {device.location.postalCode}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Country
                                                </h3>
                                                <p>{device.location.country}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Coordinates
                                                </h3>
                                                <p>
                                                    {
                                                        device.location
                                                            .coordinates
                                                            .latitude
                                                    }
                                                    ,{" "}
                                                    {
                                                        device.location
                                                            .coordinates
                                                            .longitude
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Device Settings</CardTitle>
                                    {canEdit && (
                                        <CardDescription>
                                            Editable by administrators and
                                            service providers
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Auto Start
                                                </h3>
                                                <p>
                                                    {device.settings.autoStart
                                                        ? "Enabled"
                                                        : "Disabled"}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Remote Control
                                                </h3>
                                                <p>
                                                    {device.settings
                                                        .remoteControl
                                                        ? "Enabled"
                                                        : "Disabled"}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Billing
                                                </h3>
                                                <p>
                                                    {device.settings.billing
                                                        ? "Enabled"
                                                        : "Disabled"}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Reimbursement
                                                </h3>
                                                <p>
                                                    {device.settings
                                                        .reimbursement
                                                        ? "Enabled"
                                                        : "Disabled"}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Show On Map
                                                </h3>
                                                <p>
                                                    {device.settings.showOnMap
                                                        ? "Enabled"
                                                        : "Disabled"}
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                    Public Access
                                                </h3>
                                                <p>
                                                    {device.settings
                                                        .publicAccess
                                                        ? "Enabled"
                                                        : "Disabled"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Opening Hours</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">
                                            Always Open
                                        </h3>
                                        <p>
                                            {device.openingHours.alwaysOpen
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Violations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Object.entries(device.violations).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${
                                                            value
                                                                ? "bg-red-500"
                                                                : "bg-green-500"
                                                        }`}
                                                    ></div>
                                                    <p className="capitalize">
                                                        {key
                                                            .replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )
                                                            .toLowerCase()}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Visibility Tab */}
                        <TabsContent value="visibility" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Visibility Settings</CardTitle>
                                    {canEdit && (
                                        <CardDescription>
                                            Editable by administrators and
                                            service providers
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Roaming Enabled
                                            </h3>
                                            <p>
                                                {device.visibility
                                                    .roamingEnabled
                                                    ? "Yes"
                                                    : "No"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                Visibility For Customer
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className="mt-1"
                                            >
                                                {device.visibility.forCustomer
                                                    .replace(/_/g, " ")
                                                    .toLowerCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Side Panel */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => handleRemoteAction("restart")}
                            >
                                <RefreshCw className="mr-2 h-4 w-4" /> Restart
                                Device
                            </Button>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => handleRemoteAction("update")}
                            >
                                <Upload className="mr-2 h-4 w-4" /> Update
                                Firmware
                            </Button>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => handleRemoteAction("status")}
                            >
                                <FileDown className="mr-2 h-4 w-4" /> Get Status
                                Report
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Status
                                </h3>
                                <Badge
                                    className={`mt-1 ${getStatusColor(
                                        device.status
                                    )}`}
                                >
                                    {device.status
                                        ? device.status
                                              .charAt(0)
                                              .toUpperCase() +
                                          device.status.slice(1)
                                        : "Unknown"}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Protocol
                                </h3>
                                <p>{device.boot.protocol}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Firmware
                                </h3>
                                <p>{device.boot.firmware}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Public Access
                                </h3>
                                <p>
                                    {device.settings.publicAccess
                                        ? "Enabled"
                                        : "Disabled"}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Location
                                </h3>
                                <p>
                                    {device.location.city},{" "}
                                    {device.location.country}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetail;
