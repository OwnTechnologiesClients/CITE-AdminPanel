"use client";

import { useEffect, useRef } from "react";

export default function RouteMap({ polyline, startLat, startLong, endLat, endLong, gpsPoints }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !polyline || polyline.length === 0) return;

    // Initialize map using Leaflet (you can replace with Google Maps, Mapbox, etc.)
    const initMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        // Remove existing map if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Calculate bounds
        const latlngs = polyline.map((coord) => [coord[0], coord[1]]);
        const bounds = L.latLngBounds(latlngs);

        // Create map
        const map = L.map(mapRef.current, {
          zoomControl: true,
        }).fitBounds(bounds);

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Add route polyline
        const routePolyline = L.polyline(latlngs, {
          color: "#3b82f6",
          weight: 4,
          opacity: 0.8,
        }).addTo(map);

        // Add start marker
        if (startLat && startLong) {
          L.marker([startLat, startLong], {
            icon: L.divIcon({
              className: "custom-marker",
              html: `<div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #10b981;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          })
            .addTo(map)
            .bindPopup("Start");
        }

        // Add end marker
        if (endLat && endLong) {
          L.marker([endLat, endLong], {
            icon: L.divIcon({
              className: "custom-marker",
              html: `<div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #ef4444;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          })
            .addTo(map)
            .bindPopup("End");
        }

        // Optional: Add speed-colored segments if GPS points available
        if (gpsPoints && gpsPoints.length > 1) {
          for (let i = 1; i < gpsPoints.length; i++) {
            const prev = gpsPoints[i - 1];
            const curr = gpsPoints[i];
            const speed = curr.speed || 0;

            // Determine color based on speed
            let color = "#10b981"; // Green - Low
            if (speed >= 4.56) {
              color = "#ef4444"; // Red - High
            } else if (speed >= 2.34) {
              color = "#f59e0b"; // Yellow - Moderate
            }

            L.polyline(
              [
                [prev.latitude, prev.longitude],
                [curr.latitude, curr.longitude],
              ],
              {
                color,
                weight: 3,
                opacity: 0.7,
              }
            ).addTo(map);
          }
        }

        mapInstanceRef.current = map;
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [polyline, startLat, startLong, endLat, endLong, gpsPoints]);

  if (!polyline || polyline.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No route data available</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-lg border"
      style={{ zIndex: 0 }}
    />
  );
}

