Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZWNjMGY0My1kYjQ1LTQyNjktYjFiYi1hNmU2MDJmOGQ5NjgiLCJpZCI6Mjk3OTM1LCJpYXQiOjE3NjgwODE2MTd9.0xFmp3ZlwaSKrxxa7JD5iH4OIl1nOZAZkP5xarq9ZHg'; 

let viewer;
const selector = document.getElementById("sat-selector");

async function createViewer() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    shouldAnimate: true,
    timeline: false,
    animation: false, 
    homeButton: true,              
    sceneModePicker: false,          
    baseLayerPicker: true,          
    navigationHelpButton: false, 
    terrainProvider: await Cesium.createWorldTerrainAsync()
  });
  viewer.scene.globe.enableLighting = true;
  return viewer;
}


async function loadSatellites(viewer, option) {
  const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${option}&FORMAT=tle`;
  try {
    const response = await fetch(url);
    const data = await response.text();
    const lines = data.split('\n');

    for (let i = 0; i < lines.length - 3; i += 3) {
      const satRec = satellite.twoline2satrec(lines[i+1], lines[i+2]);

      viewer.entities.add({
        name: lines[i].trim(),
        customData: { satRec: satRec },
        position: new Cesium.CallbackProperty((time) => {
          const date = Cesium.JulianDate.toDate(time);
          const posVel = satellite.propagate(satRec, date);
          const gmst = satellite.gstime(date);

          if (posVel.position) {
            const posGd = satellite.eciToGeodetic(posVel.position, gmst);
            return Cesium.Cartesian3.fromDegrees(
              satellite.degreesLong(posGd.longitude),
              satellite.degreesLat(posGd.latitude),
              posGd.height * 1000
            );
          }
        }, false),
        model: {
          uri: 'satModel.glb', 
          scale: 0.5,
          minimumPixelSize: 130,
          maximumScale: 400
        }
      });
    }
  } catch (e) {
    console.error("Failed to load satellites:", e);
  }
}


function createFootprint(viewer) {
  return viewer.entities.add({
    ellipse: {
      material: Cesium.Color.GOLD.withAlpha(0.2),
      outline: true,
      outlineColor: Cesium.Color.WHITE,
      height: 0
    },
    show: false
  });
}

function setupClickHandler(viewer, footprint) {
  const R = 6371;
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction((click) => {
    const picked = viewer.scene.pick(click.position);
    if (Cesium.defined(picked) && picked.id.customData) {
      const entity = picked.id;

      viewer.trackedEntity = entity;
      document.getElementById('data-panel').style.display = 'block';
      footprint.show = true;

      footprint.position = new Cesium.CallbackProperty((time) => {
        const pos = entity.position.getValue(time);
        if (!pos) return undefined;
        const carto = Cesium.Cartographic.fromCartesian(pos);
        return Cesium.Cartesian3.fromDegrees(
          Cesium.Math.toDegrees(carto.longitude),
          Cesium.Math.toDegrees(carto.latitude),
          0
        );
      }, false);

      footprint.ellipse.semiMajorAxis = new Cesium.CallbackProperty((time) => {
        const pos = entity.position.getValue(time);
        if (!pos) return 0;

        const h = Cesium.Cartographic.fromCartesian(pos).height / 1000;
        let d = Math.sqrt(Math.pow(R + h, 2) - Math.pow(R, 2));
        let area = 2 * Math.PI * R * R * (h / (R + h));

        const maxVisualRadius = R * (Math.PI / 2) * 1000;
        let drawRadius = d * 1000;

        if (drawRadius > maxVisualRadius) {
          drawRadius = maxVisualRadius;
          document.getElementById('warning').style.display = 'block';
        } else {
          document.getElementById('warning').style.display = 'none';
        }

        document.getElementById('sat-name').innerText = entity.name;
        document.getElementById('sat-alt').innerText = h.toFixed(0);
        document.getElementById('sat-area').innerText = Math.round(area).toLocaleString();

        return drawRadius;
      }, false);

      footprint.ellipse.semiMinorAxis = footprint.ellipse.semiMajorAxis;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


selector.addEventListener("change", async () => {
  const option = selector.value || "active";
  if (!viewer) return;

  viewer.entities.removeAll(); 
  await loadSatellites(viewer, option);
});


(async function startGlobalRadar() {
  try {
    await createViewer();
    const initialOption = selector.value || "active";
    await loadSatellites(viewer, initialOption);
    const footprint = createFootprint(viewer);
    setupClickHandler(viewer, footprint);
  } catch (e) {
    console.error(e);
  }
})();
