
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

Array.from(document.getElementById('menu-facility-ul').children, li => {
    li.addEventListener('click', EVENT_HANDLE[li.id](li));
});

Array.from(document.getElementById('menu-control-ul').children, li => {
    EVENT_HANDLE[li.id](li);
});

addSelectBoxOptions('selectBaseMap', Array.from(BaseTileMap.keys(), key => {
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

Array.from(document.getElementsByClassName('filter-ul'), ul => {
    Array.from(ul.children, li => {
        if (li.id) {
            li.addEventListener('click', _ => {
                if (li.on) {
                    li.on = false;
                    li.classList.remove('cls-filter-on');
                    return;
                }
                li.on = true;
                li.classList.add('cls-filter-on');
            });
        }
    });
});

const OpenTimeList = [];
for (let hour = OPEN_TIME_START; hour < OPEN_TIME_END; hour++) {
    OpenTimeList.push({'value': hour + ':00', 'text': hour + ':00以前'});
    OpenTimeList.push({'value': hour + ':15', 'text': hour + ':15以前'});
    OpenTimeList.push({'value': hour + ':30', 'text': hour + ':30以前'});
    OpenTimeList.push({'value': hour + ':45', 'text': hour + ':45以前'});
}
OpenTimeList.push({'value': OPEN_TIME_END + ':00', 'text': OPEN_TIME_END + ':00以前'});

Array.from(document.getElementById("filter-popup-div").querySelectorAll("select"), slt => {
    addSelectBoxOptions(slt.id, OpenTimeList);
});

document.getElementById('filterApply').addEventListener('click', _ => {
    // 新規園ボタンをオフ
    $('#btnNewSchool').css('background-color', '#f6f6f6');
    document.getElementById("btnNewSchool").enaled = false;

    // メニューがCollapsedで開かれてる場合に隠す
    if (MENU_COLLAPSED && MENU_LIST[0].style.display === "inline-block") {
        MENU_LIST.forEach(list => {
            list.style.display ="none";
        });
    }
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
