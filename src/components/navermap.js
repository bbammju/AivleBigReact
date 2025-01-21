import React, { useEffect } from 'react';

const NaverMap = (long, lat) => {
  useEffect(() => {
    const { naver } = window;
    if (!naver) return;

    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(long, lat),
      zoom: 10,
    });
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default NaverMap;