import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapLocator = ({ onLocationSelect }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const CenterEthiopia = [38.753404313029705, 9.034289546287624];

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/basic/style.json?key=${mapboxgl.accessToken}`,
      center: CenterEthiopia, // Default center position
      zoom: 12, // Default zoom level
    });

    setMap(map);

    map.on("click", async (event) => {
      const { lngLat } = event;
      const [longitude, latitude] = lngLat.toArray();
      try {
        onLocationSelect("loading");
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features.length > 0) {
          const place = data.features;
          onLocationSelect(place);
        } else {
          onLocationSelect("error");
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    });

    return () => map.remove();
  }, [onLocationSelect]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "20rem" }} />
  );
};

export default MapLocator;
