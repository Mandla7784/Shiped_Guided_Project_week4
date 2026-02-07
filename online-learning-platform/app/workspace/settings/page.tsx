"use client"
import React from "react"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your preferences.</p>
      <div className="border rounded-lg p-6 bg-white max-w-md">
        <div className="flex items-center gap-2 text-gray-500">
          <Settings className="w-5 h-5" />
          <span>Settings options can be added here (notifications, theme, etc.).</span>
        </div>
      </div>
    </div>
  )
}
