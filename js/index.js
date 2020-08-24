
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

Array.from(document.getElementById('menu-facility-ul').children).forEach(li => {
    li.addEventListener('click', EVENT_HANDLE[li.id](li));

    /* clickイベントのstyle書き換えでcssのhover無効への対処 */
    li.addEventListener('mouseenter', _ => {
        li.style.color = "lightblue";
        if (!li.on) {
            li.style.border = "groove white";
            li.style["background-color"] = "rgba(240,240,240,0.8)";        
        }
    });
    li.addEventListener('mouseleave', _ => {
        li.style.color = "white";
        if (!li.on) {
            li.style.color = "grey";
            li.style.border = "";
            li.style["background-color"] = "rgba(240,240,240,0.8)";        
        }
    });
});

Array.from(document.getElementById('menu-control-ul').children).forEach(li => {
    EVENT_HANDLE[li.id](li);
});

addSelectBoxOptions('selectBaseMap', Array.from(BaseTileMap.keys()).map(key => {
    return {'value': key, 'text': key};
}));


// メニューボタンをクリックした時のイベントの登録
document.getElementById('menu-btn').addEventListener('click', _ => {
    if (MENU_LIST[0].style.display === "none") {
        MENU_LIST.forEach(list => {
            list.style.display ="inline-block";
        });
        return;
    }
    MENU_LIST.forEach(list => {
        list.style.display ="none";
    });
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

document.getElementById('mapid').addEventListener('click', _ => {
    // 検索ポップアップを隠す
    document.getElementById('filter-popup-div').style.display ="none";

    // メニューがCollapsedで開かれてる場合に隠す
    if (MENU_COLLAPSED && MENU_LIST[0].style.display === "inline-block") {
        MENU_LIST.forEach(list => {
            list.style.display ="none";
        });
    }
});

Array.from(document.getElementsByClassName('filter-ul')).forEach(ul => {
    Array.from(ul.children).forEach(li => {
        if (!li.id.includes("Time")) {
            li.addEventListener('click', _ => {
                if (li.on) {
                    li.on = false;
                    li.style['background-color'] = "rgba(245,245,245,1.0)";
                    return;
                }
                li.on = true;
                li.style['background-color'] = "lightgray";
            });
            /* clickイベントのstyle書き換えでcssのhover無効への対処 */
            li.addEventListener('mouseenter', _ => {
                if (!li.on) li.style["background-color"] = "rgba(235,235,235,1.0)";
            });
            li.addEventListener('mouseleave', _ => {
                if (!li.on) li.style["background-color"] = "rgba(245,245,245,1.0)";        
            });
        }
    });
});

const thisOnOff = (obj) => {
};


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
