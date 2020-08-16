
const map = L.map('mapid', {
    // Map State Options
    center: [INIT_LONGITUDE, INIT_LATITUDE],
    maxBounds: setLatLngBounds(),
    maxZoom: INIT_ZOOM_MAX,
    minZoom: INIT_ZOOM_MIN,
    zoom: INIT_ZOOM_LEVEL,
    layers: BingLayer,
    // Interaction Options
    bounceAtZoomLimits: false
});

loadJSON('data/nurseryFacilities.geojson', (response) => {
    Nursery_Facilities = JSON.parse(response);
    AddNurseryLayers(Nursery_Facilities);
});

L.control.scale({'imperial': false}).addTo(map);
L.control.layers(TileLayersObjs).addTo(map);



// function onLocationFound(e) {
//     var radius = e.accuracy;

//     L.marker(e.latlng).addTo(map)
//         .bindPopup("You are within " + radius + " meters from this point").openPopup();

//     L.circle(e.latlng, radius).addTo(map);
// }

// function onLocationError(e) {
//     alert(e.message);
// }

// map.on('locationfound', onLocationFound);
// map.on('locationerror', onLocationError);
// map.locate({setView: true, maxZoom: 16});
