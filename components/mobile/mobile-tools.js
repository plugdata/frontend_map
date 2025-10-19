"use client"

import { useState } from "react"
import { MapPin, Navigation, Phone, Share2, Menu, X } from "lucide-react"

export function MobileTools({ selectedLocation, onToolSelect }) {
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  const tools = [
    { id: "directions", icon: Navigation, label: "Directions", color: "bg-blue-500" },
    { id: "location", icon: MapPin, label: "Location", color: "bg-pink-500" },
    { id: "call", icon: Phone, label: "Call", color: "bg-orange-500" },
    { id: "share", icon: Share2, label: "Share", color: "bg-green-500" },
  ]

  const handleToolClick = (toolId) => {
    onToolSelect?.(toolId, selectedLocation)
    console.log(`[v0] Tool selected: ${toolId}`)
  }

  return (
    <>
      {/* Mobile Tools Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="text-center mb-3">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">LOCATION</p>
        </div>

        <div className="flex justify-center space-x-6">
          {tools.map((tool) => {
            const IconComponent = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className={`${tool.color} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow`}
                aria-label={tool.label}
              >
                <IconComponent size={20} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsToolsOpen(!isToolsOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-lg"
      >
        {isToolsOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isToolsOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsToolsOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Tools & Options</h2>
            </div>
            <div className="p-4 space-y-3">
              {tools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      handleToolClick(tool.id)
                      setIsToolsOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`${tool.color} w-10 h-10 rounded-full flex items-center justify-center text-white`}>
                      <IconComponent size={18} />
                    </div>
                    <span className="font-medium">{tool.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
