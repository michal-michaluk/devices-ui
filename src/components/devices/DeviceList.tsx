import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Device } from "@/types/device";
import { useState } from "react";
import { DeviceCard } from "./DeviceCard";

interface DeviceListProps {
    devices: Device[];
    onDeviceHover: (device: Device) => void;
}

export function DeviceList({ devices, onDeviceHover }: DeviceListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [visibilityFilter, setVisibilityFilter] = useState<string>("all");

    // Filter devices based on search term and filters
    const filteredDevices = devices.filter((device) => {
        // Search term filter
        const matchesSearch =
            device.boot.vendor
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            device.boot.model
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            device.boot.serial
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            device.location.city
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus =
            statusFilter === "all" || device.status === statusFilter;

        // Visibility filter
        const matchesVisibility =
            visibilityFilter === "all" ||
            (visibilityFilter === "public" && device.settings.publicAccess) ||
            (visibilityFilter === "private" && !device.settings.publicAccess);

        return matchesSearch && matchesStatus && matchesVisibility;
    });

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4 space-y-2">
                <Input
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
                <div className="flex gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="maintenance">
                                Maintenance
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={visibilityFilter}
                        onValueChange={setVisibilityFilter}
                    >
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Devices</SelectItem>
                            <SelectItem value="public">
                                Public Access
                            </SelectItem>
                            <SelectItem value="private">
                                Private Access
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {filteredDevices.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredDevices.map((device) => (
                            <DeviceCard
                                key={device.deviceId}
                                device={device}
                                onHover={() => onDeviceHover(device)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-8 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                No devices found
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
