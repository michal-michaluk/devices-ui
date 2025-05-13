// Device status types
export type DeviceStatus = "online" | "offline" | "error" | "maintenance";

// Coordinates for location
export interface Coordinates {
    longitude: number;
    latitude: number;
}

// Location interface
export interface Location {
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
    state: string | null;
    country: string;
    coordinates: Coordinates;
}

// Ownership information
export interface Ownership {
    operator: string;
    provider: string;
}

// Opening hours configuration
export interface OpeningHours {
    alwaysOpen: boolean;
}

// Device settings
export interface DeviceSettings {
    autoStart: boolean;
    remoteControl: boolean;
    billing: boolean;
    reimbursement: boolean;
    showOnMap: boolean;
    publicAccess: boolean;
}

// Device violations
export interface Violations {
    operatorNotAssigned: boolean;
    providerNotAssigned: boolean;
    locationMissing: boolean;
    showOnMapButMissingLocation: boolean;
    showOnMapButNoPublicAccess: boolean;
}

// Visibility customer options
export type VisibilityForCustomer =
    | "INACCESSIBLE_AND_HIDDEN_ON_MAP"
    | "ACCESSIBLE_BUT_HIDDEN_ON_MAP"
    | "INACCESSIBLE_BUT_VISIBLE_ON_MAP"
    | "ACCESSIBLE_AND_VISIBLE_ON_MAP";

// Visibility settings
export interface Visibility {
    roamingEnabled: boolean;
    forCustomer: VisibilityForCustomer;
}

// Boot information
export interface BootInfo {
    protocol: string;
    vendor: string;
    model: string;
    serial: string;
    firmware: string;
}

// Full device interface
export interface Device {
    deviceId: string;
    ownership: Ownership;
    location: Location;
    openingHours: OpeningHours;
    settings: DeviceSettings;
    violations: Violations;
    visibility: Visibility;
    boot: BootInfo;
    status?: DeviceStatus;
}
