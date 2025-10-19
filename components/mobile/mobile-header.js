"use client"

import { useState } from "react"
import { Filter, X, Maximize2 } from "lucide-react"
import Logo from "../ui/logo"
export function MobileHeader({ onFilterClick, onCloseMap, showMapControls = true }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50">
      {/* 🔹 Header ชมพู */}
      <nav className="bg-[#FF77C1] border-b border-pink-400 shadow text-white">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#ec407a] font-bold text-xl"><Logo /></span>
            </div>
            <h2 className="font-bold text-xl">เทศบาลนครตรัง</h2>
          </div>

          {/* Hamburger */}
          <button
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="bg-[#FF77C1] px-4 py-3 space-y-2">
            <a href="#map" className="block py-2 text-white">🗺️ แผนที่</a>
            <a href="#services" className="block py-2 text-white">🏛️ บริการประชาชน</a>
            <a href="#news" className="block py-2 text-white">📰 ข่าวสาร</a>
          </div>
        )}
      </nav>

      {/* 🔹 Filter / Map Controls (พื้นหลังขาว) */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onFilterClick}
            className="flex items-center gap-2 text-purple-600 font-medium"
          >
            <Filter size={18} />
            Filter
          </button>
          <button
            onClick={onCloseMap}
            className="flex items-center gap-2 text-gray-600"
          >
            Close map
            <X size={18} />
          </button>
        </div>

        {showMapControls && (
          <div className="flex items-center justify-between">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="px-3 py-1 bg-white rounded-md shadow-sm text-sm font-medium">
                Map
              </button>
              <button className="px-3 py-1 text-sm text-gray-600">
                Satellite
              </button>
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Maximize2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
