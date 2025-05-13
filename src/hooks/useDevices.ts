import { useAuth } from "@/contexts/AuthContext";
import { Device, DeviceStatus } from "@/types/device";
import { useEffect, useState } from "react";

// Mock device data based on the API schema
const MOCK_DEVICES: Device[] = [
    {
        deviceId: "dev-001",
        ownership: {
            operator: "Devicex.nl",
            provider: "public-devices",
        },
        location: {
            street: "Rakietowa",
            houseNumber: "1A",
            city: "Wrocław",
            postalCode: "54-621",
            state: null,
            country: "POL",
            coordinates: {
                longitude: 51.09836221719513,
                latitude: 16.931752852309156,
            },
        },
        openingHours: {
            alwaysOpen: true,
        },
        settings: {
            autoStart: false,
            remoteControl: true,
            billing: true,
            reimbursement: false,
            showOnMap: true,
            publicAccess: true,
        },
        violations: {
            operatorNotAssigned: false,
            providerNotAssigned: false,
            locationMissing: false,
            showOnMapButMissingLocation: false,
            showOnMapButNoPublicAccess: false,
        },
        visibility: {
            roamingEnabled: true,
            forCustomer: "ACCESSIBLE_AND_VISIBLE_ON_MAP",
        },
        boot: {
            protocol: "IoT16",
            vendor: "Garo",
            model: "CPF25 Family",
            serial: "891234A56711",
            firmware: "1.13",
        },
        status: "online", // Added for UI compatibility
    },
    {
        deviceId: "dev-002",
        ownership: {
            operator: "Devicex.nl",
            provider: "private-devices",
        },
        location: {
            street: "Tech Boulevard",
            houseNumber: "456",
            city: "Seattle",
            postalCode: "98101",
            state: "WA",
            country: "USA",
            coordinates: {
                longitude: 47.6062,
                latitude: -122.3321,
            },
        },
        openingHours: {
            alwaysOpen: false,
        },
        settings: {
            autoStart: true,
            remoteControl: true,
            billing: true,
            reimbursement: true,
            showOnMap: true,
            publicAccess: false,
        },
        violations: {
            operatorNotAssigned: false,
            providerNotAssigned: false,
            locationMissing: false,
            showOnMapButMissingLocation: false,
            showOnMapButNoPublicAccess: true,
        },
        visibility: {
            roamingEnabled: false,
            forCustomer: "ACCESSIBLE_BUT_HIDDEN_ON_MAP",
        },
        boot: {
            protocol: "IoT16",
            vendor: "Tesla",
            model: "Powerwall",
            serial: "SN002B2023",
            firmware: "v1.5.0",
        },
        status: "online", // Added for UI compatibility
    },
    {
        deviceId: "dev-003",
        ownership: {
            operator: "EcoEnergy Solutions",
            provider: "green-energy",
        },
        location: {
            street: "Green Street",
            houseNumber: "789",
            city: "Austin",
            postalCode: "78701",
            state: "TX",
            country: "USA",
            coordinates: {
                longitude: 30.2672,
                latitude: -97.7431,
            },
        },
        openingHours: {
            alwaysOpen: false,
        },
        settings: {
            autoStart: false,
            remoteControl: false,
            billing: true,
            reimbursement: false,
            showOnMap: false,
            publicAccess: false,
        },
        violations: {
            operatorNotAssigned: false,
            providerNotAssigned: false,
            locationMissing: false,
            showOnMapButMissingLocation: false,
            showOnMapButNoPublicAccess: false,
        },
        visibility: {
            roamingEnabled: false,
            forCustomer: "INACCESSIBLE_AND_HIDDEN_ON_MAP",
        },
        boot: {
            protocol: "IoT15",
            vendor: "EcoSmart",
            model: "Gateway Pro",
            serial: "GW003D2023",
            firmware: "v3.0.1",
        },
        status: "offline", // Added for UI compatibility
    },
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
                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (!user) {
                    setDevices([]);
                    return;
                }

                // Filter devices based on user's tenant
                let filteredDevices = MOCK_DEVICES;

                // If not admin, filter by ownership provider
                if (
                    user.role !== "engineer" &&
                    user.role !== "customer_service"
                ) {
                    filteredDevices = MOCK_DEVICES.filter(
                        (device) => device.ownership.provider === user.tenantId
                    );
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
    const updateDeviceStatus = async (
        deviceId: string,
        status: DeviceStatus
    ) => {
        setDevices((prevDevices) =>
            prevDevices.map((device) =>
                device.deviceId === deviceId ? { ...device, status } : device
            )
        );

        // In a real app, this would make an API call to update the device
        return true;
    };

    return {
        devices,
        loading,
        error,
        updateDeviceStatus,
    };
}
