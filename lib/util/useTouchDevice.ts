"use client"

import { useEffect, useState } from 'react'

/**
 * Detects if the user is on a touch device
 * Combines multiple detection methods for better accuracy
 */
export function useTouchDevice(): boolean | null {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null)

  useEffect(() => {
    // Check multiple indicators of touch capability
    const hasTouchPoints = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0
    const hasTouchEvent = 'ontouchstart' in window
    const hasTouchMedia = window.matchMedia('(pointer: coarse)').matches
    
    // Additional checks for mobile devices
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Consider it a touch device if any of these are true
    const isTouch = hasTouchPoints || hasTouchEvent || hasTouchMedia || isMobileUserAgent
    
    setIsTouchDevice(isTouch)
  }, [])

  return isTouchDevice
}
