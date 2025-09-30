import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { response } from "express";

function TelegramSetup({ userData }) {
    const { toast } = useToast();
    const [isChanging, setIsChanging] = useState(false);
    const { user, isLoading, error } = useAuth();


    console.log("The use is : ", user)

    const apiUrl = import.meta.env.VITE_API_URL;
    const getApiUrl = (path: string) => {
        if (!apiUrl) return path;
        return apiUrl.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
    };
    // Normalize state
    const [telegramData, setTelegramData] = useState({ "chatid": user?.chatid, "token": user?.token, "enabled": user?.enabled });


    const handleChange = async (e) => {
        await setTelegramData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        console.log(telegramData)

    };

    async function saveTelegramInfo() {

        if (!telegramData.token || !telegramData.chatid) {
            toast({
                title: "Both fields are required",
                description: "Please fill in both token and chat ID.",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch(getApiUrl("/api/auth/save-tel-info"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: telegramData.token,
                    chatid: telegramData.chatid,
                }),
            });

            const data = await response.json();
            if (!response.ok || data.success === false) {
                toast({ title: "Telegram info saved Failed", description: data.error, variant: "destructive" });
            }

            setTelegramData((prev) => ({ ...prev, enabled: true }));
            setIsChanging(false);

            toast({
                title: "Telegram info saved",
                description: data.message || "Your Telegram settings were updated.",
            });
        } catch (err) {
            toast({
                title: "Error updating Telegram info",
                description: err.message,
                variant: "destructive",
            });
        }
    }

    return (
        <Card>
            <div className="flex flex-col w-full sm:flex-row sm:items-center sm:justify-between px-4 py-8 gap-4">
                <div className="text-left w-full sm:w-auto">
                    <h6>Telegram OTP Verification</h6>
                    {telegramData.enabled ? (
                        <p className="text-green-600 text-sm mb-3">
                            Telegram OTP verification is <b>enabled</b>. You will receive OTPs
                            via Telegram.
                        </p>
                    ) : (
                        <p className="text-gray-600 text-sm mb-3">
                            Telegram OTP verification is <b>disabled</b>. Enable it to secure
                            your account and receive OTPs via Telegram.
                        </p>
                    )}
                </div>
                <div className="w-full sm:w-auto sm:text-right">
                    {telegramData.enabled ? (
                        <div className="grid grid-rows-2 gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                onClick={async () => {
                                    try {
                                        const response = await fetch(getApiUrl('/api/auth/telegram-message-disable'), {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                        })
                                        let data = await response.json();
                                        if (data.success === false) {
                                            toast({ title: "Failed to update", description: data.error })
                                            return;
                                        }
                                        toast({ title: "Telegram update success!", description: data.message })
                                        setTelegramData({ ...telegramData, ['enabled']: false })
                                    }
                                    catch (error) {

                                    }
                                }}
                            >
                                Disable
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                onClick={() => setIsChanging(true)}
                            >
                                Change
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-600"
                            onClick={() => setIsChanging(true)}
                        >
                            Enable
                        </Button>
                    )}
                </div>
            </div>

            {
                isChanging && (
                    <CardContent className="p-4 border-t border-gray-600">
                        <div
                            className="space-y-4"
                            style={{ maxWidth: "400px", margin: "0 auto" }}
                        >
                            <p className="text-sm text-gray-500">
                                Enter your Telegram Bot Token and Chat ID to receive OTPs.
                            </p>

                            <label className="text-sm">Telegram Token</label>
                            <Input
                                type="text"
                                placeholder="Enter your Telegram Bot Token"
                                value={telegramData.token}
                                name="token"
                                onChange={handleChange}
                            />

                            <label className="text-sm">Chat ID</label>
                            <Input
                                type="text"
                                placeholder="Enter your Telegram Chat ID"
                                value={telegramData.chatid}
                                name="chatid"
                                onChange={handleChange}
                            />

                            <div className="grid grid-rows-2 gap-1">
                                <Button onClick={() => saveTelegramInfo(true)}>Save Changes</Button>
                            </div>
                        </div>
                    </CardContent>
                )
            }
        </Card >
    );
}

export default TelegramSetup;
