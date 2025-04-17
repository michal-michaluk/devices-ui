
// Device status types
export type DeviceStatus = "online" | "offline" | "error" | "maintenance";

// Device types
export type DeviceType = "charger" | "sensor" | "gateway" | "controller";

// Device boot notification
export interface BootNotification {
  id: string;
  timestamp: string;
  firmwareVersion: string;
  success: boolean;
  message?: string;
}

// Device status notification
export interface StatusNotification {
  id: string;
  timestamp: string;
  status: DeviceStatus;
  errorCode?: string;
  info?: string;
}

// Device message
export interface DeviceMessage {
  id: string;
  timestamp: string;
  type: string;
  content: string;
}

// Device settings
export interface DeviceSettings {
  maintenanceInterval: number;
  powerLimit: number;
  autoReboot: boolean;
  operatingHours: {
    start: string;
    end: string;
  };
  networkConfiguration: {
    ipAddress?: string;
    subnet?: string;
    gateway?: string;
    dns?: string;
  };
}

// Device location
export interface DeviceLocation {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Full device interface
export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  type: DeviceType;
  status: DeviceStatus;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  tenantId: string;
  location: DeviceLocation;
  settings: DeviceSettings;
  bootNotifications: BootNotification[];
  statusNotifications: StatusNotification[];
  messages: DeviceMessage[];
  lastConnected: string;
  createdAt: string;
  updatedAt: string;
}
