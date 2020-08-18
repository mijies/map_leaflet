
const map = L.map('mapid', {
    // Map State Options
    center: [INIT_LONGITUDE, INIT_LATITUDE],
    maxBounds: setLatLngBounds(),
    maxZoom: INIT_ZOOM_MAX,
    minZoom: INIT_ZOOM_MIN,
    zoom: INIT_ZOOM_LEVEL,
    layers: BaseMapDict[INIT_MAP],
    // Interaction Options
    bounceAtZoomLimits: false
});

loadNurseryFacilities(map);
loadSchools(map);


L.control.scale({'imperial': false}).addTo(map);
L.control.locate({"keepCurrentZoomLevel": true}).addTo(map);
// L.control.layers(TileLayersObjs).addTo(map);
// map.removeControl();

Array.from(document.getElementsByClassName('layer-btn')).forEach(btn => {
    btn.on = true;
    btn.addEventListener('click', e => {
        if (btn.on) {
            map.removeLayer(NURSERY_LAYERS[btn.id]);
            btn.style = "color: grey; background-color: rgba(240,240,240,0.8)";
            btn.on = false;
            return;
        }
        map.addLayer(NURSERY_LAYERS[btn.id]);
        btn.style = "";
        btn.on = true;
    });
    /* clickイベントのstyle書き換えでcssのhover無効への対処 */
    btn.addEventListener('mouseenter', _ => {
        if (!btn.on) btn.style = "color: lightblue; background-color: rgba(240,240,240,0.8);border: groove white;";
    });
    btn.addEventListener('mouseleave', _ => {
        if (!btn.on) btn.style = "color: grey; background-color: rgba(240,240,240,0.8);";
    });
});

// TODO: should be excuted in async
Array.from(document.getElementsByClassName('layer-btn-school')).forEach(btn => {
    btn.style = "color: grey; background-color: rgba(240,240,240,0.8)";
    btn.on = false;
    btn.addEventListener('click', _ => {
        if (btn.on) {
            map.removeLayer(SCHOOL_LAYERS[btn.id]);
            btn.style = "color: grey; background-color: rgba(240,240,240,0.8)";
            btn.on = false;
            return;
        }
        map.addLayer(SCHOOL_LAYERS[btn.id]);
        btn.style = "";
        btn.on = true;
    });
    /* clickイベントのstyle書き換えでcssのhover無効への対処 */
    btn.addEventListener('mouseenter', _ => {
        if (!btn.on) btn.style = "color: lightblue; background-color: rgba(240,240,240,0.8);border: groove white;";
    });
    btn.addEventListener('mouseleave', _ => {
        if (!btn.on) btn.style = "color: grey; background-color: rgba(240,240,240,0.8);";
    });
});


addSelectBoxOptions('selectBaseMap', Object.keys(BaseMapDict).map(key => {
    return {'value': key, 'text': key};
}));

 
document.getElementById('selectBaseMap').addEventListener('change', e => {
    Object.keys(BaseMapDict).forEach(key => {
        if (map.hasLayer(BaseMapDict[key])) {
            if (key === e.target.value) return;
            map.removeLayer(BaseMapDict[key]);
        }
    });
    map.addLayer(BaseMapDict[e.target.value]);
});

document.getElementById('btnHelp').addEventListener('click', _ => {
    window.open('howto.html');
});



// map.on('locationfound', e => {
//     const [lat, lng] = [e.latlng.lat, e.latlng.lng];
//     if (lat > SOUTH_BOUND && lat < NORTH_BOUND && lng > WEST_BOUND && lng < EAST_BOUND) {
//         map.setView(e.latlng);
//     }
// });

// map.on('locationerror', e => alert(e.message));

// map.locate();

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
