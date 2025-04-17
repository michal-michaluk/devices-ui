
import { DeviceCard } from "./DeviceCard";
import { Device } from "@/types/device";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeviceListProps {
  devices: Device[];
  onDeviceHover: (device: Device) => void;
}

export function DeviceList({ devices, onDeviceHover }: DeviceListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter devices based on search term and filters
  const filteredDevices = devices.filter(device => {
    // Search term filter
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === "all" || device.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-1/2">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="charger">Chargers</SelectItem>
              <SelectItem value="sensor">Sensors</SelectItem>
              <SelectItem value="gateway">Gateways</SelectItem>
              <SelectItem value="controller">Controllers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {filteredDevices.length > 0 ? (
          <div className="grid gap-4">
            {filteredDevices.map(device => (
              <DeviceCard 
                key={device.id} 
                device={device} 
                onHover={() => onDeviceHover(device)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div>
              <p className="text-sm text-muted-foreground">No devices found</p>
              <p className="text-xs text-muted-foreground mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
