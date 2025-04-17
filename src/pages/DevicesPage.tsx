
import { useDevices } from "@/hooks/useDevices";
import { DeviceList } from "@/components/devices/DeviceList";
import { useState } from "react";
import { Device } from "@/types/device";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const DevicesPage = () => {
  const { devices, loading, error } = useDevices();
  const [hoveredDevice, setHoveredDevice] = useState<Device | null>(null);

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
      <h1 className="text-3xl font-bold mb-6">Devices</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <DeviceList devices={devices} onDeviceHover={setHoveredDevice} />
      </div>
    </div>
  );
};

export default DevicesPage;
