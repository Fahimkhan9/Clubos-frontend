"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UAParser } from "ua-parser-js";
import { Laptop, Smartphone, Tablet } from "lucide-react";

type Session = {
  _id: string;
  ip?: string;
  userAgent?: string;
  lastActive: string;
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function LoggedinDevices() {
  const { data, mutate, isLoading } = useSWR("/sessions", fetcher);

  const [openDialog, setOpenDialog] = useState(false);
  const [targetSessionId, setTargetSessionId] = useState<string | null>(null);
  const [logoutAll, setLogoutAll] = useState(false);

  if (isLoading) return <p>Loading sessions...</p>;

  const sessions: Session[] = data?.sessions || [];

  const currentToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  const confirmLogout = (sessionId?: string) => {
    if (sessionId) {
      setLogoutAll(false); // logout single device
      setTargetSessionId(sessionId);
    } else {
      setLogoutAll(true); // logout all devices
      setTargetSessionId(null);
    }
    setOpenDialog(true);
  };

  const handleConfirmLogout = async () => {
    try {
      if (logoutAll) {
        await api.delete("/sessions");
        toast.success("Logged out from all devices");
      } else if (targetSessionId) {
        await api.delete(`/sessions/${targetSessionId}`);
        toast.success("Logged out from device");
      }
      mutate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to logout");
    } finally {
      setOpenDialog(false);
      setTargetSessionId(null);
      setLogoutAll(false);
    }
  };

  const getDeviceIcon = (uaString?: string) => {
    if (!uaString) return <Laptop className="w-5 h-5 mr-2" />;
    const parser = new UAParser(uaString);
    const deviceType = parser.getDevice().type;
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="w-5 h-5 mr-2" />;
      case "tablet":
        return <Tablet className="w-5 h-5 mr-2" />;
      default:
        return <Laptop className="w-5 h-5 mr-2" />;
    }
  };

  const getBrowserName = (uaString?: string) => {
    if (!uaString) return "Unknown Browser";
    const parser = new UAParser(uaString);
    return parser.getBrowser().name || "Unknown Browser";
  };

  const targetSession = sessions.find((s) => s._id === targetSessionId);
  const isTargetCurrent =
    targetSession?._id === data?.sessionId ||
    targetSession?._id === currentToken;

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Active Logged-in Devices</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 && <p>No active sessions found</p>}
          {sessions.map((session) => {
            const isCurrent =
              session._id === data?.sessionId || currentToken === session._id;

            return (
              <div
                key={session._id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {getDeviceIcon(session.userAgent)}
                    <p className="font-medium">
                      {session.userAgent || "Unknown Device"} -{" "}
                      {getBrowserName(session.userAgent)}
                      {isCurrent && (
                        <span className="ml-2 text-sm text-green-600 font-semibold">
                          (Current Device)
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    IP: {session.ip || "Unknown"} | Last Active:{" "}
                    {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
                {!isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmLogout(session._id)}
                  >
                    Logout
                  </Button>
                )}
              </div>
            );
          })}

          {sessions.length > 0 && (
            <>
              <Separator className="my-4" />
              <Button variant="destructive" onClick={() => confirmLogout()}>
                Logout from All Devices
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              {logoutAll ? (
                "Are you sure you want to logout from all devices?"
              ) : (
                <>
                  Are you sure you want to logout from this device?
                  <div className="mt-2 ml-7 text-sm text-muted-foreground">
                    {targetSession && (
                      <>
                        {getDeviceIcon(targetSession.userAgent)}
                        {targetSession.userAgent || "Unknown Device"} -{" "}
                        {getBrowserName(targetSession.userAgent)}
                        {isTargetCurrent && (
                          <span className="ml-2 text-sm text-green-600 font-semibold">
                            (Current Device)
                          </span>
                        )}
                        <div>
                          IP: {targetSession.ip || "Unknown"} | Last Active:{" "}
                          {new Date(targetSession.lastActive).toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
