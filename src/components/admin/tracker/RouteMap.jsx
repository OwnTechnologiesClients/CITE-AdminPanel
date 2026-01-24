"use client";

import { MapPin, Navigation } from "lucide-react";

export default function RouteMap({ polyline, startLat, startLong, endLat, endLong, gpsPoints }) {
  if (!polyline || polyline.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No route data available</p>
      </div>
    );
  }

  // Calculate center point for display
  const centerLat = polyline.length > 0 
    ? polyline.reduce((sum, coord) => sum + coord[0], 0) / polyline.length
    : startLat || 0;
  const centerLng = polyline.length > 0
    ? polyline.reduce((sum, coord) => sum + coord[1], 0) / polyline.length
    : startLong || 0;

  return (
    <div className="relative w-full h-[400px] bg-muted rounded-lg border overflow-hidden">
      {/* Placeholder Map */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-2">
          <Navigation className="size-12 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Route Map</p>
          <p className="text-xs text-muted-foreground">
            Route coordinates: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
          </p>
          <p className="text-xs text-muted-foreground">
            Points: {polyline.length}
          </p>
        </div>
      </div>

      {/* Route visualization overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Start marker */}
        {startLat && startLong && (
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
        {endLat && endLong && (
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
            points={polyline.map((coord, index) => {
              const x = 20 + (index / polyline.length) * 60 + "%";
              const y = 30 + (index / polyline.length) * 40 + "%";
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            opacity="0.8"
          />
        </svg>
      </div>
    </div>
  );
}

