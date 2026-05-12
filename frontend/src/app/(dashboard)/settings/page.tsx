"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Bell, Shield, Key } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const { email } = useAuthStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-zinc-400" />
          Settings
        </h1>
        <p className="text-zinc-400 mt-2">
          Manage your account preferences, global API keys, and notification settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="flex flex-col space-y-1">
          <Button variant="ghost" className="justify-start bg-zinc-800 text-white hover:bg-zinc-800 hover:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-400 hover:bg-zinc-800/50 hover:text-white">
            <Key className="w-4 h-4 mr-2" />
            Global API Keys
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-400 hover:bg-zinc-800/50 hover:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </Button>
          <Button variant="ghost" className="justify-start text-zinc-400 hover:bg-zinc-800/50 hover:text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-zinc-400">
                Update your account's profile information and email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                <Input 
                  disabled 
                  value={email || "loading..."} 
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-500">Your email address cannot be changed at this time.</p>
              </div>
              
              <div className="grid gap-2 pt-4">
                <label className="text-sm font-medium text-zinc-300">Role</label>
                <Input 
                  disabled 
                  value="USER" 
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-500 cursor-not-allowed font-mono"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Danger Zone</CardTitle>
              <CardDescription className="text-zinc-400">
                Irreversible and destructive actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-500">Delete Account</h4>
                  <p className="text-sm text-zinc-500 mt-1">Permanently delete your account and all hosted models.</p>
                </div>
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
