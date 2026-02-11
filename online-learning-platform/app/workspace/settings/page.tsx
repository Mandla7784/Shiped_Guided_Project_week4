"use client"
import React, { useState, useEffect } from "react"
import { Settings, Moon, Sun, Monitor, Bell, Globe, Shield, Palette, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/context/ThemeContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    courseUpdates: true,
    marketing: false,
  })
  const [language, setLanguage] = useState("en")
  const [autoSave, setAutoSave] = useState(true)

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        if (parsed.notifications) setNotifications(parsed.notifications)
        if (parsed.language) setLanguage(parsed.language)
        if (parsed.autoSave !== undefined) setAutoSave(parsed.autoSave)
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }, [])

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('settings', JSON.stringify({
      notifications,
      language,
      autoSave,
    }))
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your preferences and account settings.</p>
      </div>

      {/* Appearance Section */}
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="text-base">Theme</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred color scheme
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
                className="gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('system')}
                className="gap-2"
              >
                <Monitor className="w-4 h-4" />
                System
              </Button>
            </div>
          </div>
          
          <div className="pt-2 border-t dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current theme: <span className="font-semibold capitalize">{resolvedTheme}</span>
              {theme === 'system' && ' (following system preference)'}
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive browser push notifications
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="course-updates">Course Updates</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified about new course content
              </p>
            </div>
            <Switch
              id="course-updates"
              checked={notifications.courseUpdates}
              onCheckedChange={(checked) => setNotifications({ ...notifications, courseUpdates: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing Emails</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive promotional emails and updates
              </p>
            </div>
            <Switch
              id="marketing"
              checked={notifications.marketing}
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold">General</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="w-full">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <SelectValue placeholder="Select language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-save Progress</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically save your learning progress
              </p>
            </div>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold">Privacy & Security</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Visibility</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Control who can see your profile
              </p>
            </div>
            <Select defaultValue="public">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
