import styles from './Map3DTiles.module.css';
import * as Cesium from 'cesium';
import { useContext, useEffect, useRef } from 'react';
import { MapContext } from '../../context/MapContext';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { SIDEBAR_WIDTH } from './Sidebar';

// type Map3DTilesProps = {
  
// }

export default function Map3DTiles() {
  const { map } = useContext(MapContext);
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer>();

  useEffect(() => {
    if (!cesiumContainerRef.current || !map) return;

    const initializeCesium = async () => {
      Cesium.Ion.defaultAccessToken = import.meta.env.VITE_API_KEY_CESIUM as string;
      cesiumViewerRef.current = new Cesium.Viewer(cesiumContainerRef.current as Element, {
        skyAtmosphere: new Cesium.SkyAtmosphere(),
        scene3DOnly: true,
        globe: false,
        sceneModePicker: false,
        selectionIndicator: false,
        baseLayerPicker: false,
        animation: false,
        timeline: false,
        navigationHelpButton: false,
        infoBox: false,
        geocoder: false,
        fullscreenButton: false,
        homeButton: false,
        vrButton: false,
        targetFrameRate: 60,
        showRenderLoopErrors: false,
      });
      const viewer = cesiumViewerRef.current;
      viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-73.860766, 40.713326, 15000.0),
        orientation: {
          heading: 90,
          pitch: 180,
          roll: 0.0,
        }
      });


      try {
        const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2275207);
        viewer.scene.primitives.add(tileset);
      } catch (error) {
        console.error(error);
      }
      viewer.resize();
      viewer.render();
    };
    initializeCesium();

    return () => {
      if (cesiumViewerRef.current) {
        cesiumViewerRef.current.destroy();
      }
    }
  }, [map]);

  return (
    <div
      ref={cesiumContainerRef}
      className={styles.container}
      style={{ left: SIDEBAR_WIDTH, width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}
    ></div>
  );
}