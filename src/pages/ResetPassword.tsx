import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, User, Key } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "../lib/supabase";


export default function ResetPassword() {
    const { toast } = useToast();

    const authtoken = new URLSearchParams(window.location.search).get("token");
    const email = new URLSearchParams(window.location.search).get("email");
    
    const [newPassword, setPassword] = useState({ password: "", confirmPassword: ""});
    console.log("Email from URL:", email);
    console.log("Auth token from URL:", authtoken);

    const setNewPassword = async (e) => {
        e.preventDefault();

        if (newPassword.password.length === 0 || newPassword.confirmPassword.length === 0) {
            toast({ title: "Please fill in all fields", description: "Both password fields are required.", variant: "destructive" });
            return;
        }

        if ((newPassword.password !== newPassword.confirmPassword)) {
            toast({ title: "Passwords do not match", description: "Please ensure both fields match.", variant: "destructive" });
            return;
        }

        try {
            console.log("Sending reset password request with token:", newPassword.password, authtoken);

            const response = await fetch(getApiUrl("/api/auth/reset-password"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newPassword: newPassword.password, token: authtoken,email: email }),
            });
            const data = await response.json();
            if (!data.success) {
                toast({ title: "Password update failed", description: data.message, variant: "destructive" });
                return;
            }
            toast({ title: "Password Changed Success!", description: data.message, variant: "success" });

            console.log("Response from forgot password API:", data);

        }
        catch (error) {
            console.error("Error sending reset password request:", error);
            // toast({ title: "Error", description: "Failed to send reset link. Please try again.", variant: "destructive" });
            return;
        }


        // toast({ title: "Reset link sent to your email!", description: "Please check your inbox.",variant: "success" });
    }

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-tech-blue/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-tech-blue to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-inter font-bold gradient-text mb-2">TECH2SAINI</h1>
                    <p className="text-gray-400">Admin Portal</p>
                </div>


                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <Card className="glass-morphism border-tech-light/20">
                        <CardHeader>
                            <CardTitle className="text-white text-center">Set Your Password</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={setNewPassword}>
                                <div>
                                    <Label htmlFor="email" className="text-white">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <Input
                                            id="email"
                                            type="password"
                                            name="password"
                                            value={newPassword.password}
                                            onChange={(e) => setPassword({ ...newPassword, ['password']: e.target.value })}
                                            placeholder="••••••••••••••••••••••••"
                                            className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-white">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <Input
                                            id="email"
                                            type="password"
                                            name="confirmPassword"
                                            value={newPassword.confirmPassword}
                                            onChange={(e) => setPassword({ ...newPassword, ['confirmPassword']: e.target.value })}
                                            placeholder="••••••••••••••••••••••••"
                                            className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r my-5 from-tech-blue to-tech-light hover:shadow-lg hover:shadow-tech-light/50"
                                >Change Password</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>


                <div className="mt-6 text-center">
                    <Link href="/admin/login" className="text-gray-400 hover:text-tech-light transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}