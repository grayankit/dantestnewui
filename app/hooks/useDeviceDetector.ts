"use client";

import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tab" | "desktop";

const getDeviceType = (width: number): DeviceType => {
  const mobileBreakpoint = 768;
  const tabBreakpoint = 1024;

  if (width < mobileBreakpoint) {
    return "mobile";
  } else if (width < tabBreakpoint) {
    return "tab";
  } else {
    return "desktop";
  }
};

const useDeviceDetector = (): DeviceType => {
  const isClient = typeof window === "object";

  const [deviceType, setDeviceType] = useState<DeviceType>(() =>
    isClient?
    getDeviceType(window.innerWidth):"desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
};

export default useDeviceDetector;
