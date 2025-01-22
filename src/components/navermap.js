import React, { useEffect, useState } from "react";

const NaverMap = ({ long, lat }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadNaverMapScript = () => {
      if (window.naver) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=hq3ckh6dee`;
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => console.error("Failed to load Naver Maps script");
      document.body.appendChild(script);
    };

    loadNaverMapScript();
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.naver) {
      const { naver } = window;

      const mapOptions = {
        center: new naver.maps.LatLng(lat, long), // lat first, then long
        zoom: 14, // Zoom level
      };

      const map = new naver.maps.Map("map", mapOptions);

      // Add marker
      new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, long),
        map: map,
        title: "Selected Location",
      });
    }
  }, [scriptLoaded, long, lat]);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
    >
      {!scriptLoaded && <p>Loading Naver Map...</p>}
    </div>
  );
};

export default NaverMap;