import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
// import QRCode from "qrcode.react";

export default function AuthCode() {
    const { toast } = useToast();
    const [enabled, setEnabled] = useState(1);
    const [alreadyEnabled, setalreadyEnabled] = useState(false);
    const [secret, setSecret] = useState("");
    const [qrUrl, setQrUrl] = useState("");
    const [token, setToken] = useState("");
    const [isQrcode, setIsQrcode] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const getApiUrl = (path: string) => {
        if (!apiUrl) return path;
        return apiUrl.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
    };

    const authuser = async () => {
        const res = await fetch(getApiUrl("/api/auth/user"), { method: "GET" });
        const data = await res.json();
        if (data.success === false) {
            return false
        }
        return data;
    }
    useEffect(() => {
        (async () => {
            let data = await authuser();
            console.log("Auth user data:", data);
            setalreadyEnabled(data.twoFactorEnabled);
            setEnabled(data.twoFactorEnabled ? 3 : 1);
            setSecret(data.secret || "ddddddd");
            setQrUrl(data.qrcode || "");
        })();
    }, []);

    const handleEnable = async (e) => {
        let text = e.target.innerText;
        e.target.innerText = text + "ing...";
        e.target.disabled = true;

        // 🔹 Call backend to generate secret + otpauth URL
    const res = await fetch(getApiUrl("/api/auth/setup-2fa"), { method: "POST" });
        const data = await res.json();
        if (data.success === false) {
            toast({ title: "Error", description: data.error, variant: "destructive" });
            return;
        }
        // 🔹 Set the secret and QR code URL
        setSecret(data.secret);
        setQrUrl(data.qrCode);
        setEnabled(2);
        toast({ title: "Success", description: "2FA setup initiated. Please scan the QR code.", variant: "success" });
        // 🔹 If already enabled, set alreadyEnabled to true
        e.target.innerText = text;
        e.target.disabled = false;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        let text = e.target.innerText;
        e.target.innerText = text + "ing...";
        e.target.disabled = true;

        const res = await fetch(getApiUrl("/api/auth/verify-2fa"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, secret }),
        });
        const data = await res.json();

        if (data.success === false) {
            // console.error("Error verifying 2FA:", data.error);
            toast({ title: "Error", description: data.error, variant: "destructive" });
            e.target.innerText = text;
            e.target.disabled = false;
            return;
        }

        console.log("Verification response:", data);

        if (data.success) {
            // alert("✅ Two-Factor Authentication Enabled!");
            setToken("");
            setEnabled(3);
            setSecret("");
            setQrUrl("");
            setalreadyEnabled(true);
            toast({ title: "Success", description: "Two-Factor Authentication Enabled!", variant: "success" });
        } else {
            // alert("❌ Invalid Code, try again.");
            toast({ title: "Error", description: "Invalid Code, try again.", variant: "destructive" });
        }
        e.target.innerText = text;
        e.target.disabled = false;
    };

    const handleDisable = async (e) => {
        e.preventDefault();
        let text = e.target.innerText;
        e.target.innerText = text + "ing...";
        e.target.disabled = true;

    const response = await fetch(getApiUrl("/api/auth/disable-2fa"), { method: "POST" });
        const data = await response.json();
        if (data.success === false) {
            toast({ title: "Error", description: data.error, variant: "destructive" });
            return;
        }
        setEnabled(1);
        setSecret("");
        setQrUrl("");
        setToken("");
        setalreadyEnabled(false);
        toast({ title: "Success", description: "Two-Factor Authentication Disabled!", variant: "success" });

        e.target.innerText = text;
        e.target.disabled = false;
    };

    const cancleAuth = async (e) => {
        let text = e.target.innerText;
        e.target.innerText = text + "ing...";
        e.target.disabled = true;

        setEnabled(1);
        setSecret("");
        setQrUrl("");
        setToken("");
        setalreadyEnabled(false);
        toast({ title: "Success", description: "Two-Factor Authentication Canceled!", variant: "success" });
        e.target.innerText = text;
        e.target.disabled = false;
    };

    return (
        <>
            {/* Enable Two-Factor Authentication (2FA) to enhance your account security. */}
            <Card>
                <div className="flex flex-col w-full sm:flex-row sm:items-center sm:justify-between px-4 py-3 pt-5 gap-2 w-full">
                    <div className="text-left w-full sm:w-auto">
                        <h6>Two-Factor Authentication (2FA)</h6>
                        {alreadyEnabled ? (
                            <p className="text-green-600 text-sm mb-3">
                                Advanced security layer enabled for your account.
                            </p>
                        ) : (
                            <p className="text-gray-600 text-sm mb-3">
                                Add an extra layer of security to your account by enabling 2FA.
                            </p>
                        )}


                    </div>
                    <div className="w-full sm:w-auto sm:text-right">
                        {enabled === 2 && <Button variant="destructive" className="w-full sm:w-auto" onClick={cancleAuth}>Cancle</Button>}
                        {enabled === 1 && <Button onClick={handleEnable}>Enable 2FA</Button>}
                        {alreadyEnabled && <Button variant="destructive" className="w-full sm:w-auto" onClick={handleDisable} >Disable 2FA</Button>}
                    </div>
                </div>
                {alreadyEnabled && (
                    <p className="text-sm text-gray-500 break-all p-2">
                        {(qrUrl && isQrcode) && (
                            <div className="flex justify-center my-2">
                                <img src={qrUrl} alt="QR Code" className="w-44 h-44" />
                            </div>
                        )}
                        <span className="border bg-gray-900 p-1 rounded">{secret}</span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="ml-2"
                            onClick={() => {
                                navigator.clipboard.writeText(secret);
                                toast({ title: "Copied", description: "Secret copied to clipboard.", variant: "success" });
                            }}
                        >
                            Copy
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="ml-2"
                            onClick={(e) => {
                                if (isQrcode) {
                                    setIsQrcode(false)
                                    e.target.innerText = "Qr Code"
                                }
                                else {
                                    setIsQrcode(true)
                                    e.target.innerText = "Hide Qr Code"

                                };
                            }}
                        >
                            Qr Code
                        </Button>
                    </p>
                )}
                {enabled === 2 && (
                    <div className="text-sm text-gray-500 mt-2 mx-auto px-4">
                        <div className="space-y-4">
                            <p className="text-gray-600 text-sm">
                                Scan this QR Code with Google Authenticator or Authy:
                            </p>
                            {qrUrl && (
                                <div className="flex justify-center">
                                    <img src={qrUrl} alt="QR Code" className="w-44 h-44" />
                                </div>
                            )}

                        </div>
                        <p className="text-sm text-gray-500 break-all">
                            Or enter this secret manually: {secret}
                            <Button
                                size="sm"
                                variant="outline"
                                className="ml-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(secret);
                                    toast({ title: "Copied", description: "Secret copied to clipboard.", variant: "success" });
                                }}
                            >
                                Copy
                            </Button>

                        </p>
                        <div className="grid grid-cols-2 gap-5 items-center justify-between my-4">
                            <Input placeholder="Enter 6-digit code"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                            <Button className="w-full" onClick={handleVerify}>
                                Verify & Enable
                            </Button>
                        </div>
                    </div>
                )
                }
            </Card >
        </>

    );
}