import styles from './Map.module.css';
import * as THREE from 'three';
import { useContext, useEffect, useRef } from "react";
import * as mapbox from "../../services/mapbox";
import { useLocation } from 'react-router-dom';
import { pathToSection } from '../../utils/utils';
import { MapContext } from '../../context/MapContext';
import { mapSections } from '../../constants/mapConstants';
import { Section } from '../../constants/surveyConstants';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';
import { SIDEBAR_WIDTH } from './Sidebar';
import { create3DLayer } from '../../services/three';

/**
 * Mapbox map component.
 */
export default function Map() {
  const { map, setMap, setParentLayer, setColor } = useContext(MapContext);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Create a map instance on component mount.
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const temp = mapbox.createMap(mapContainerRef.current.id);
    temp.on("load", () => {
      setMap(temp);
    });

    // Cleanup function to remove the map instance on component unmount
    return () => {
      map && mapbox.removeMap(map);
      setMap(undefined);
    };
  }, []);

  
  useEffectAfterMount(() => {
    if (!map) return;

      // Update the map layers of the current page.
      const section: Section = pathToSection(location.pathname);
      mapbox.setLayers(section, map);

      // Update the map parent layer and color of the current page.
      const mapSection = mapSections.find((sec) => sec.id === section)!;
      setParentLayer(mapSection.parentLayer);
      setColor(mapSection.color);

  }, [location.pathname, map, setColor, setParentLayer]);


  useEffectAfterMount(() => {
    if (!map) return;

    // Create Three.js custom style layer to the map.
    create3DLayer(map);

  }, [map]);

  return (
    <div
      id="map"
      ref={mapContainerRef}
      className={styles.map}
      style={{
        left: SIDEBAR_WIDTH,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      }}
    ></div>
  );
}