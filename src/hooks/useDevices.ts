
import { useState, useEffect } from "react";
import { Device, DeviceStatus } from "@/types/device";
import { useAuth } from "@/contexts/AuthContext";

// Mock device data
const MOCK_DEVICES: Device[] = [
  {
    id: "dev-001",
    name: "Charger Station Alpha",
    serialNumber: "CH001A2023",
    type: "charger",
    status: "online",
    owner: {
      id: "owner-1",
      name: "TechCorp Inc.",
      email: "support@techcorp.com"
    },
    tenantId: "tenant1",
    location: {
      address: "123 Energy Avenue",
      city: "San Francisco",
      postalCode: "94105",
      country: "USA",
      latitude: 37.7749,
      longitude: -122.4194
    },
    settings: {
      maintenanceInterval: 30,
      powerLimit: 22,
      autoReboot: true,
      operatingHours: {
        start: "06:00",
        end: "22:00"
      },
      networkConfiguration: {
        ipAddress: "192.168.1.100",
        subnet: "255.255.255.0",
        gateway: "192.168.1.1",
        dns: "8.8.8.8"
      }
    },
    bootNotifications: [
      {
        id: "boot-001",
        timestamp: "2023-05-15T08:30:00Z",
        firmwareVersion: "v2.3.1",
        success: true
      },
      {
        id: "boot-002",
        timestamp: "2023-06-20T14:15:00Z",
        firmwareVersion: "v2.3.2",
        success: true
      }
    ],
    statusNotifications: [
      {
        id: "status-001",
        timestamp: "2023-07-01T09:45:00Z",
        status: "online"
      },
      {
        id: "status-002",
        timestamp: "2023-07-03T16:20:00Z",
        status: "error",
        errorCode: "E-302",
        info: "Charging cable fault detected"
      },
      {
        id: "status-003",
        timestamp: "2023-07-03T18:10:00Z",
        status: "online"
      }
    ],
    messages: [
      {
        id: "msg-001",
        timestamp: "2023-07-02T10:15:00Z",
        type: "info",
        content: "Daily self-test completed successfully"
      },
      {
        id: "msg-002",
        timestamp: "2023-07-03T16:18:00Z",
        type: "error",
        content: "Error detected in charging cable connection"
      }
    ],
    lastConnected: "2023-07-10T14:30:00Z",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-07-10T14:30:00Z"
  },
  {
    id: "dev-002",
    name: "Sensor Node Beta",
    serialNumber: "SN002B2023",
    type: "sensor",
    status: "online",
    owner: {
      id: "owner-1",
      name: "TechCorp Inc.",
      email: "support@techcorp.com"
    },
    tenantId: "tenant1",
    location: {
      address: "456 Tech Boulevard",
      city: "Seattle",
      postalCode: "98101",
      country: "USA",
      latitude: 47.6062,
      longitude: -122.3321
    },
    settings: {
      maintenanceInterval: 60,
      powerLimit: 5,
      autoReboot: true,
      operatingHours: {
        start: "00:00",
        end: "23:59"
      },
      networkConfiguration: {
        ipAddress: "192.168.1.101",
        subnet: "255.255.255.0",
        gateway: "192.168.1.1",
        dns: "8.8.8.8"
      }
    },
    bootNotifications: [
      {
        id: "boot-003",
        timestamp: "2023-04-10T06:15:00Z",
        firmwareVersion: "v1.5.0",
        success: true
      }
    ],
    statusNotifications: [
      {
        id: "status-004",
        timestamp: "2023-06-25T11:30:00Z",
        status: "online"
      }
    ],
    messages: [
      {
        id: "msg-003",
        timestamp: "2023-06-25T11:35:00Z",
        type: "info",
        content: "Sensor calibration completed"
      }
    ],
    lastConnected: "2023-07-11T08:45:00Z",
    createdAt: "2023-02-20T00:00:00Z",
    updatedAt: "2023-07-11T08:45:00Z"
  },
  {
    id: "dev-003",
    name: "Gateway Node Delta",
    serialNumber: "GW003D2023",
    type: "gateway",
    status: "offline",
    owner: {
      id: "owner-2",
      name: "EcoEnergy Solutions",
      email: "support@ecoenergy.com"
    },
    tenantId: "tenant2",
    location: {
      address: "789 Green Street",
      city: "Austin",
      postalCode: "78701",
      country: "USA",
      latitude: 30.2672,
      longitude: -97.7431
    },
    settings: {
      maintenanceInterval: 45,
      powerLimit: 10,
      autoReboot: false,
      operatingHours: {
        start: "08:00",
        end: "20:00"
      },
      networkConfiguration: {
        ipAddress: "192.168.1.102",
        subnet: "255.255.255.0",
        gateway: "192.168.1.1",
        dns: "8.8.8.8"
      }
    },
    bootNotifications: [
      {
        id: "boot-004",
        timestamp: "2023-03-05T12:00:00Z",
        firmwareVersion: "v3.0.1",
        success: true
      }
    ],
    statusNotifications: [
      {
        id: "status-005",
        timestamp: "2023-07-08T16:40:00Z",
        status: "online"
      },
      {
        id: "status-006",
        timestamp: "2023-07-09T22:15:00Z",
        status: "offline"
      }
    ],
    messages: [
      {
        id: "msg-004",
        timestamp: "2023-07-09T22:10:00Z",
        type: "warning",
        content: "Battery level low, switching to power save mode"
      }
    ],
    lastConnected: "2023-07-09T22:10:00Z",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2023-07-09T22:15:00Z"
  }
];

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!user) {
          setDevices([]);
          return;
        }
        
        // Filter devices based on user's tenant
        let filteredDevices = MOCK_DEVICES;
        
        // If not admin, filter by tenant
        if (user.role !== "engineer" && user.role !== "customer_service") {
          filteredDevices = MOCK_DEVICES.filter(device => device.tenantId === user.tenantId);
        }
        
        setDevices(filteredDevices);
      } catch (err) {
        console.error("Error fetching devices:", err);
        setError("Failed to fetch devices. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDevices();
  }, [user]);

  // Function to update device status
  const updateDeviceStatus = async (deviceId: string, status: DeviceStatus) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId ? { ...device, status } : device
      )
    );
    
    // In a real app, this would make an API call to update the device
    return true;
  };

  return {
    devices,
    loading,
    error,
    updateDeviceStatus
  };
}
