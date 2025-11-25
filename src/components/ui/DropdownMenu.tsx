// src/components/ui/DropdownMenu.tsx
'use client'

import { useState, useRef, useEffect } from 'react'

interface DropdownMenuProps {
  showDropdown: boolean
  setShowDropdown: (show: boolean) => void
}

export default function DropdownMenu({ showDropdown, setShowDropdown }: DropdownMenuProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowDropdown])

  const menuItems = [
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1890FF">
          <path d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" strokeWidth="1.2"/>
        </svg>
      ), 
      label: 'Save Post' 
    },
    { 
      icon: (
        <svg width="20" height="22" viewBox="0 0 20 22" fill="#377DFF">
          <path d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" fillRule="evenodd"/>
        </svg>
      ), 
      label: 'Turn On Notification' 
    },
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1890FF">
          <path d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" strokeWidth="1.2"/>
        </svg>
      ), 
      label: 'Hide' 
    },
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1890FF">
          <path d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" strokeWidth="1.2"/>
        </svg>
      ), 
      label: 'Edit Post' 
    },
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#1890FF">
          <path d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" strokeWidth="1.2"/>
        </svg>
      ), 
      label: 'Delete Post' 
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger - Exact same as HTML */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <svg 
          width="4" 
          height="17" 
          viewBox="0 0 4 17" 
          fill="none" 
          className="text-gray-400"
        >
          <circle cx="2" cy="2" r="2" fill="currentColor"/>
          <circle cx="2" cy="8.5" r="2" fill="currentColor"/>
          <circle cx="2" cy="15" r="2" fill="currentColor"/>
        </svg>
      </button>

      {/* Dropdown Menu - Exact same as HTML */}
      {showDropdown && (
        <div className="absolute right-0 top-8 w-80 bg-white shadow-xl border border-gray-200 rounded-lg z-50 py-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left group"
              onClick={() => {
                console.log(`${item.label} clicked`)
                setShowDropdown(false)
              }}
            >
              <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
                {item.icon}
              </span>
              <span className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}