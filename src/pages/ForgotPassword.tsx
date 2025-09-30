import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, User, Key } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";


export default function ForgotPassword() {
    const { toast } = useToast();

    const [email, setEmail] = useState("");

    const sendResetLink = async (e) => {
        e.preventDefault();
        try {

            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!data.success) {
                toast({ title: "Password reset failed", description: data.message, variant: "destructive" });
                return
            }
            toast({ title: "Reset link sent!", description: "Please check your email for the reset link.", variant: "success" });

            console.log("Response from forgot password API:", data);

        }
        catch (error) {
            toast({ title: "Error", description: "Failed to send reset link. Please try again.", variant: "destructive" });
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
                            <CardTitle className="text-white text-center">Reset Your Password</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={sendResetLink}>
                                <div>
                                    <Label htmlFor="email" className="text-white">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@tech2saini.com"
                                            className="pl-12 bg-dark-bg/50 border-gray-600 text-white placeholder-gray-400 focus:border-tech-light"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r my-5 from-tech-blue to-tech-light hover:shadow-lg hover:shadow-tech-light/50"
                                >Send Reset Link</Button>
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