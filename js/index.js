
const map = L.map('mapid', {
    // Map State Options
    center: [INIT_LONGITUDE, INIT_LATITUDE],
    maxBounds: setLatLngBounds(),
    maxZoom: INIT_ZOOM_MAX,
    minZoom: INIT_ZOOM_MIN,
    zoom: INIT_ZOOM_LEVEL,
    layers: BaseTileMap.get(INIT_MAP),
    
    // Interaction Options
    bounceAtZoomLimits: false
});

loadNurseryFacilities(map);
loadSchools(map);
loadStations(map);


L.control.scale({'imperial': false}).addTo(map);
L.control.locate({"keepCurrentZoomLevel": true}).addTo(map);
// L.control.layers(TileLayersObjs).addTo(map);
// map.removeControl();

Array.from(document.getElementsByClassName('layer-btn')).forEach(btn => {
    btn.on = true;
    btn.addEventListener('click', e => {
        if (btn.on) {
            map.removeLayer(NURSERY_LAYERS[btn.id]);
            btn.style.color = "grey";
            btn.style["background-color"] = "rgba(240,240,240,0.8)";
            btn.on = false;
            return;
        }
        map.addLayer(NURSERY_LAYERS[btn.id]);
        btn.style.color = "white";
        btn.style["background-color"] = "";
        btn.on = true;
    });
    /* clickイベントのstyle書き換えでcssのhover無効への対処 */
    btn.addEventListener('mouseenter', _ => {
        btn.style.color = "lightblue";
        if (!btn.on) {
            btn.style.border = "groove white";
            btn.style["background-color"] = "rgba(240,240,240,0.8)";        
        }
    });
    btn.addEventListener('mouseleave', _ => {
        btn.style.color = "white";
        if (!btn.on) {
            btn.style.color = "grey";
            btn.style.border = "";
            btn.style["background-color"] = "rgba(240,240,240,0.8)";        
        }
    });
});

Array.from(document.getElementsByClassName('layer-btn-school')).forEach(btn => {
    btn.style.color = "grey";
    btn.style["background-color"] = "rgba(240,240,240,0.8)";
    btn.on = false;
    btn.addEventListener('click', _ => {
        if (btn.on) {
            map.removeLayer(SCHOOL_LAYERS[btn.id]);
            btn.style.color = "grey";
            btn.style["background-color"] = "rgba(240,240,240,0.8)";
            btn.on = false;
            return;
        }
        map.addLayer(SCHOOL_LAYERS[btn.id]);
        btn.style.color = "";
        btn.style["background-color"] = "";
        btn.on = true;
    });
    /* clickイベントのstyle書き換えでcssのhover無効への対処 */
    btn.addEventListener('mouseenter', _ => {
        btn.style.color = "lightblue";
        if (!btn.on) {
            btn.style.border = "groove white";
            btn.style["background-color"] = "rgba(240,240,240,0.8)";    
        }
    });
    btn.addEventListener('mouseleave', _ => {
        btn.style.color = "white";
        if (!btn.on) {
            btn.style.color = "grey";
            btn.style.border = "";
            btn.style["background-color"] = "rgba(240,240,240,0.8)";          
        }
    });
});

document.getElementById('btnFilter').addEventListener('click', _ => {
    console.log(111)
    document.getElementById("filter-popup-div").style.display = "block";
});

addSelectBoxOptions('selectBaseMap', Array.from(BaseTileMap.keys()).map(key => {
    return {'value': key, 'text': key};
}));

document.getElementById('selectBaseMap').addEventListener('change', e => {
    for (const [key, tile] of BaseTileMap) {
        if (map.hasLayer(tile)) {
            if (key === e.target.value) return;
            map.removeLayer(tile);
        }       
    }
    map.addLayer(BaseTileMap.get(e.target.value));
});

document.getElementById('selectStation').addEventListener('change', e => {
    if (CURRENT_STATION_NAME === e.target.value) return;
    if (CURRENT_STATION) map.removeLayer(CURRENT_STATION);
    for (const stations of STATION_MAP.values()) {
        stations.forEach(station => {
            if (station.name === e.target.value) {
                const latLng = [station.lat, station.lng];
                CURRENT_STATION_NAME = station.name;
                CURRENT_STATION = L.marker(latLng, {zIndexOffset: 200}).addTo(map);
                map.setView(latLng);
                return;
            }
        });
    }
});

document.getElementById('btnHelp').addEventListener('click', _ => {
    window.open('howto.html');
});

// メニューボタンをクリックした時のイベントの登録
document.getElementById('menu-btn').addEventListener('click', _ => {
    const li = document.getElementsByClassName("menu-li");
    if (li[0].style.display === "none") {
        li[0].style.display ="inline-block";
        li[1].style.display ="inline-block";
        return;
    }
    li[0].style.display ="none";
    li[1].style.display ="none";
});

// Windowsサイズの変更時のイベントを登録
const menuResizer = menuResizeHandle();
menuResizer();
window.addEventListener('resize', _ => {
    if (RESIZE_TIMER !== null) {
        clearTimeout(RESIZE_TIMER);
    }
    RESIZE_TIMER = setTimeout(menuResizer, 100);
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
