"use client";

import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure default Leaflet marker icons work with bundlers like Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: (markerIcon2x && markerIcon2x.src) || markerIcon2x,
  iconUrl: (markerIcon && markerIcon.src) || markerIcon,
  shadowUrl: (markerShadow && markerShadow.src) || markerShadow,
});

export default function RouteMap({ polyline, startLat, startLong, endLat, endLong, gpsPoints }) {
  // Normalize data: prefer polyline; fall back to gpsPoints
  const routePoints =
    (Array.isArray(polyline) && polyline.length > 0
      ? polyline.map((p) => ({ lat: p[0], lng: p[1] }))
      : Array.isArray(gpsPoints)
      ? gpsPoints.map((p) => ({
          lat: p.latitude ?? p.lat,
          lng: p.longitude ?? p.lng,
        }))
      : []
    ).filter((p) => typeof p.lat === "number" && typeof p.lng === "number");

  if (!routePoints || routePoints.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No route data available</p>
      </div>
    );
  }

  const centerLat =
    routePoints.reduce((sum, p) => sum + p.lat, 0) / routePoints.length;
  const centerLng =
    routePoints.reduce((sum, p) => sum + p.lng, 0) / routePoints.length;

  const start =
    typeof startLat === "number" &&
    typeof startLong === "number" &&
    !Number.isNaN(startLat) &&
    !Number.isNaN(startLong)
      ? { lat: startLat, lng: startLong }
      : routePoints[0];

  const end =
    typeof endLat === "number" &&
    typeof endLong === "number" &&
    !Number.isNaN(endLat) &&
    !Number.isNaN(endLong)
      ? { lat: endLat, lng: endLong }
      : routePoints[routePoints.length - 1];

  return (
    <div className="relative w-full h-[400px] rounded-lg border overflow-hidden">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={17}
        maxZoom={22}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={22}
        />

        <Polyline
          positions={routePoints.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: "#3b82f6", weight: 4 }}
        />

        {start && (
          <Marker position={[start.lat, start.lng]}>
            <Popup>Start</Popup>
          </Marker>
        )}

        {end && (
          <Marker position={[end.lat, end.lng]}>
            <Popup>End</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}


