import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";


function TopActions(props) {
    const { toast } = useToast();


    return (
        <div>
            <div>
                {/* Change password for your account to enhance security. */}
                <Card>
                    <div className="flex flex-col w-full sm:flex-row sm:items-center sm:justify-between px-4 gap-4 w-full">

                        {/* <!-- HTML Switches --> */}
                        <label className="toggle-switch theme-toggle-1 my-1">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>

                        <label className="toggle-switch theme-toggle-2">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>

                        <label className="toggle-switch theme-toggle-3">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>

                        <label className="toggle-switch theme-toggle-4">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>

                </Card>
            </div>
        </div>
    )
}


export default TopActions

