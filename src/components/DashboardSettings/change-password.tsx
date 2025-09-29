import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";

function ChangePassword(props) {
    const { toast } = useToast();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isChanging, setIsChanging] = useState(false);

    return (
        <>
            {/* Change password for your account to enhance security. */}
            <Card>
                <div className="flex flex-col w-full sm:flex-row sm:items-center sm:justify-between px-4 py-8 gap-4 w-full">
                    <div className="text-left w-full sm:w-auto">
                        <h6>Change Account Password</h6>
                        <p className="text-gray-600 text-sm mb-3">
                            Change your account password to enhance security.</p>
                    </div>
                    <div className="w-full sm:w-auto sm:text-right">
                        {isChanging && <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600" onClick={() => setIsChanging(false)}>Cancle</Button>}
                        {!isChanging && <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-600" onClick={() => setIsChanging(true)}>Change</Button>}
                    </div>
                </div>
                {isChanging && (
                    <CardContent className="p-4 border-t border-gray-600">
                        
                        <div className="space-y-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
                             <p className="text-sm text-gray-500">
                                Ensure your new password is strong and unique.</p>
                            <p className="p-0 m-0">Current Password</p>
                            <Input
                                type="password"
                                placeholder="••••••••••••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <p className="p-0 m-0">New Password</p>

                            <Input
                                type="password"
                                placeholder="••••••••••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                           
                            <div className="grid grid-rows-2 gap-1">

                            <Link href="/forgot-password" target="_black" className="text-tech-light hover:underline"> Forgot Password? </Link>
                            <Button
                                onClick={async () => {
                                    if (!currentPassword || !newPassword) {
                                        toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
                                        return;
                                    }
                                    // Call API to change password here
                                    // Example:
                                    const response = await fetch("/api/auth/change-password", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ currentPassword, newPassword }),
                                    });
                                    const data = await response.json();
                                    // Handle response...
                                    if (data.success === false) {
                                        toast({ title: "Password Update Failed", description: data.error, variant: "destructive" });
                                        return;
                                    }
                                    toast({ title: "Success", description: "Password changed successfully!", variant: "success" });
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setIsChanging(false);
                                }}
                            >
                                Change Password
                            </Button>
                            </div>

                        </div>
                    </CardContent>
                )}

            </Card >
        </>
    )
}

export default ChangePassword

