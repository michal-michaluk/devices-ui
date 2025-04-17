
import { useParams, useNavigate } from "react-router-dom";
import { useDevices } from "@/hooks/useDevices";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Upload, FileDown, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

const DeviceDetail = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const { devices, loading, error } = useDevices();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [dialogResponse, setDialogResponse] = useState("");
  
  // Find device from the list
  useEffect(() => {
    if (devices.length > 0 && deviceId) {
      const foundDevice = devices.find(d => d.id === deviceId);
      if (foundDevice) {
        setDevice(foundDevice);
      }
    }
  }, [devices, deviceId]);
  
  // Get background color based on status
  const getStatusColor = (status) => {
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
  const canEdit = user && (
    user.role === "engineer" || 
    user.role === "customer_service" ||
    user.role === "service_provider" ||
    (user.role === "owner" && device?.owner.id === user.id)
  );
  
  // Handle remote actions
  const handleRemoteAction = (action) => {
    setDialogAction(action);
    setDialogResponse("");
    setDialogOpen(true);
    
    // Simulate device response after a delay
    setTimeout(() => {
      let response = "";
      
      switch (action) {
        case "restart":
          response = "Device restart initiated successfully. Device will be back online in approximately 2 minutes.";
          break;
        case "update":
          response = "Firmware update process started. Current version: v2.3.2, Target version: v2.4.0. This may take up to 10 minutes to complete.";
          break;
        case "status":
          response = JSON.stringify({
            status: device?.status,
            uptime: "72h 15m",
            load: "23%",
            temperature: "35.2°C",
            memory: "412MB / 1024MB",
            lastCommunication: new Date().toISOString()
          }, null, 2);
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
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{device.name}</h1>
          <Badge className={`ml-2 ${getStatusColor(device.status)}`}>
            {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
          </Badge>
        </div>
        
        {canEdit && (
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => handleRemoteAction("restart")}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Restart
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {dialogAction === "restart" && "Restart Device"}
                    {dialogAction === "update" && "Update Firmware"}
                    {dialogAction === "status" && "Device Status"}
                  </DialogTitle>
                  <DialogDescription>
                    {dialogAction === "restart" && "The device will be restarted remotely."}
                    {dialogAction === "update" && "The device firmware will be updated to the latest version."}
                    {dialogAction === "status" && "Retrieving current device status..."}
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
                  <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={() => handleRemoteAction("update")}>
              <Upload className="mr-2 h-4 w-4" /> Update Firmware
            </Button>
            
            <Button variant="default" onClick={() => handleRemoteAction("status")}>
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
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
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
                      <h3 className="text-sm font-medium text-muted-foreground">Device ID</h3>
                      <p>{device.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Serial Number</h3>
                      <p>{device.serialNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                      <p>{device.type.charAt(0).toUpperCase() + device.type.slice(1)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Last Connection</h3>
                      <p>{format(new Date(device.lastConnected), "MMM d, yyyy HH:mm")}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                      <p>{format(new Date(device.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Updated</h3>
                      <p>{format(new Date(device.updatedAt), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ownership</CardTitle>
                  {canEdit && <CardDescription>Editable by administrators and device owners</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Owner</h3>
                      <p>{device.owner.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Contact Email</h3>
                      <p>{device.owner.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  {canEdit && <CardDescription>Editable by administrators and device owners</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Maintenance Interval (days)</h3>
                        <p>{device.settings.maintenanceInterval}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Power Limit (kW)</h3>
                        <p>{device.settings.powerLimit}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Auto Reboot</h3>
                        <p>{device.settings.autoReboot ? "Enabled" : "Disabled"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Operating Hours</h3>
                        <p>{device.settings.operatingHours.start} - {device.settings.operatingHours.end}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Network Configuration</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs text-muted-foreground">IP Address</h4>
                          <p>{device.settings.networkConfiguration.ipAddress || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Subnet</h4>
                          <p>{device.settings.networkConfiguration.subnet || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Gateway</h4>
                          <p>{device.settings.networkConfiguration.gateway || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">DNS</h4>
                          <p>{device.settings.networkConfiguration.dns || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Boot Notifications</CardTitle>
                  <CardDescription>History of device boot events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {device.bootNotifications.length > 0 ? (
                      device.bootNotifications.map(notification => (
                        <div key={notification.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Firmware: {notification.firmwareVersion}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(notification.timestamp), "MMM d, yyyy HH:mm")}
                              </p>
                            </div>
                            <Badge variant={notification.success ? "default" : "destructive"}>
                              {notification.success ? "Success" : "Failed"}
                            </Badge>
                          </div>
                          {notification.message && (
                            <p className="text-sm mt-2">{notification.message}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No boot notifications available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Status Notifications</CardTitle>
                  <CardDescription>Recent status change events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {device.statusNotifications.length > 0 ? (
                      device.statusNotifications.map(notification => (
                        <div key={notification.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Status: {notification.status}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(notification.timestamp), "MMM d, yyyy HH:mm")}
                              </p>
                            </div>
                            {notification.errorCode && (
                              <Badge variant="outline" className="text-red-500">
                                {notification.errorCode}
                              </Badge>
                            )}
                          </div>
                          {notification.info && (
                            <p className="text-sm mt-2">{notification.info}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No status notifications available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Device Messages</CardTitle>
                  <CardDescription>Communication log from the device</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {device.messages.length > 0 ? (
                      device.messages.map(message => (
                        <div key={message.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Type: {message.type}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(message.timestamp), "MMM d, yyyy HH:mm")}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{message.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No messages available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-[300px] bg-muted/40 rounded-md flex items-center justify-center mb-4">
                  <div className="text-center p-4">
                    <p className="text-sm text-muted-foreground mb-2">Map Preview</p>
                    <p className="font-medium">{device.location.latitude.toFixed(6)}, {device.location.longitude.toFixed(6)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <p>{device.location.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">City</h3>
                    <p>{device.location.city}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Postal Code</h3>
                    <p>{device.location.postalCode}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Country</h3>
                    <p>{device.location.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
