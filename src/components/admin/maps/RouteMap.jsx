"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";

/**
 * RouteMap Component
 * Displays a route on a map (using placeholder for now)
 * In production, this would integrate with Google Maps, Mapbox, or similar
 */
export default function RouteMap({ route, startLocation, endLocation, isLive = false }) {
  // Calculate center point for map
  const centerLat = route && route.length > 0 
    ? route.reduce((sum, point) => sum + point.lat, 0) / route.length
    : startLocation?.lat || 40.7128;
  const centerLng = route && route.length > 0
    ? route.reduce((sum, point) => sum + point.lng, 0) / route.length
    : startLocation?.lng || -74.0060;

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
          {/* Placeholder Map - In production, replace with actual map library */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Navigation className="size-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isLive ? "Live Map View" : "Route Map"}
              </p>
              <p className="text-xs text-muted-foreground">
                Map integration: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Route visualization overlay (simplified) */}
          {route && route.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Start marker */}
              {startLocation && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: "20%",
                    top: "30%",
                  }}
                >
                  <div className="bg-green-500 rounded-full p-2 shadow-lg">
                    <MapPin className="size-4 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-white px-2 py-1 rounded shadow">
                    Start
                  </div>
                </div>
              )}

              {/* End marker */}
              {endLocation && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: "80%",
                    top: "70%",
                  }}
                >
                  <div className="bg-red-500 rounded-full p-2 shadow-lg">
                    <MapPin className="size-4 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-white px-2 py-1 rounded shadow">
                    End
                  </div>
                </div>
              )}

              {/* Route path (simplified line) */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <polyline
                  points={route.map((point, index) => {
                    const x = 20 + (index / route.length) * 60 + "%";
                    const y = 30 + (index / route.length) * 40 + "%";
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke={isLive ? "#3b82f6" : "#10b981"}
                  strokeWidth="3"
                  strokeDasharray={isLive ? "5,5" : "none"}
                  opacity="0.8"
                />
              </svg>

              {/* Current location marker (for live tracking) */}
              {isLive && route.length > 0 && (
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{
                    left: `${20 + ((route.length - 1) / route.length) * 60}%`,
                    top: `${30 + ((route.length - 1) / route.length) * 40}%`,
                  }}
                >
                  <div className="bg-blue-500 rounded-full p-3 shadow-lg">
                    <div className="bg-blue-400 rounded-full p-1">
                      <Navigation className="size-3 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

