
const menuListFacilityClickEvent = (li) => {
    li.on = true;
    return () => {
        if (li.on) {
            map.removeLayer(NURSERY_LAYERS[li.id]);
            li.on = false;
            li.classList.add('cls-layer-off');
            return;
        }
        map.addLayer(NURSERY_LAYERS[li.id]);
        li.on = true;
        li.classList.remove('cls-layer-off');
    };
};

const menuListSchoolClickEvent = (li) => {
    li.on = false;
    li.classList.add('cls-layer-off');
    return () => {
        if (li.on) {
            map.removeLayer(SCHOOL_LAYERS[li.id]);
            li.on = false;
            li.classList.add('cls-layer-off');
            return;
        }
        map.addLayer(SCHOOL_LAYERS[li.id]);
        li.on = true;
        li.classList.remove('cls-layer-off');
    };
};

const menuListFilterEvent = (li) => {
    li.addEventListener('click', _ => {
        FILTER_POPUP_DIV.style.display = "block";
    });
};

const menuListNewSchoolEvent = (li) => {
    li.addEventListener('click', _ => {
        if (li.on) {
            li.on = false; // リセット前であること
            li.classList.remove('cls-layer-on');
            document.getElementById('filterReset').click();
            return;
        }
        document.getElementById('filterReset').click();
        FMGR = FMGR || new FilterManager(map);
        FMGR.filterNewSchool();
        li.on = true; // リセットと新設園フィルター適用後であること
        console.log(li.classList)
        li.classList.add('cls-layer-on');
        console.log(li.classList)
    }); 
};

const menuListBaseMapEvent = (_) => {
    document.getElementById('selectBaseMap').addEventListener('change', e => {
        for (const [key, tile] of BaseTileMap) {
            if (map.hasLayer(tile)) {
                if (key === e.target.value) return;
                map.removeLayer(tile);
            }       
        }
        map.addLayer(BaseTileMap.get(e.target.value));
    });
};

const menuListStationEvent = (li) => {
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
};

const menuListHelpEvent = (li) => {
    document.getElementById('listHelp').addEventListener('click', _ => {
        window.open('howto.html');
    });
};

Object.keys(NURSERY_LAYERS).forEach(key => {
    EVENT_HANDLE[key] = menuListFacilityClickEvent;
});
EVENT_HANDLE.listElementarySchool = menuListSchoolClickEvent;
EVENT_HANDLE.listMiddleSchool = menuListSchoolClickEvent;
EVENT_HANDLE.listFilter = menuListFilterEvent;
EVENT_HANDLE.listNewSchool = menuListNewSchoolEvent;
EVENT_HANDLE.listSelectBaseMap = menuListBaseMapEvent;
EVENT_HANDLE.listSelectStation = menuListStationEvent;
EVENT_HANDLE.listHelp = menuListHelpEvent;


const addFilterSelectTimeOptions = (() => {
    const OpenTimeList = [{'value': '', 'text': '開園'}];
    for (let hour = OPEN_TIME_START; hour < OPEN_TIME_END; hour++) {
        OpenTimeList.push({'value': hour + ':00', 'text': hour + ':00以前'});
        OpenTimeList.push({'value': hour + ':15', 'text': hour + ':15以前'});
        OpenTimeList.push({'value': hour + ':30', 'text': hour + ':30以前'});
        OpenTimeList.push({'value': hour + ':45', 'text': hour + ':45以前'});
    }
    OpenTimeList.push({'value': OPEN_TIME_END + ':00', 'text': OPEN_TIME_END + ':00以前'});

    const CloseTimeList = [{'value': '', 'text': '閉園'}];
    for (let hour = CLOSE_TIME_START; hour < CLOSE_TIME_END; hour++) {
        CloseTimeList.push({'value': hour + ':00', 'text': hour + ':00以降'});
        CloseTimeList.push({'value': hour + ':30', 'text': hour + ':30以降'});
    }
    CloseTimeList.push({'value': CLOSE_TIME_END + ':00', 'text': CLOSE_TIME_END + ':00以前'});

    return (select) => {
        if (select.id.includes('Open')) {
            addSelectBoxOptions(select.id, OpenTimeList);
            return;
        }
        addSelectBoxOptions(select.id, CloseTimeList);
    };
})();


const filterLayerGroup = (layerGroup, layerRemoved, prop, func) => {
    for (layer of Object.values(layerGroup._layers)) {
        if (func(layer.feature.properties[prop])) continue
        layerRemoved.push(layer);
        layerGroup.removeLayer(layer);
    }
};

const filterOpenTime = (layerGroup, layerRemoved, value) => {
    const [fHour, fMin] = value.split(':').map(s => Number(s));
    filterLayerGroup(layerGroup, layerRemoved, 'Open', (time) => {
        if (time) {
            const [hour, min] = time.split(':').map(s => Number(s));
            if (hour * 60 + min <= fHour * 60 + fMin) return true;
        }
    });
};

const filterCloseTime = (layerGroup, layerRemoved, value) => {
    const [fHour, fMin] = value.split(':').map(s => Number(s));
    filterLayerGroup(layerGroup, layerRemoved, 'Close', (time) => {
        if (time) {
            let [hour, min] = time.split(':').map(s => Number(s));
            if (hour <= 12) hour += 24 // 終園時間が翌日の場合
            if (hour * 60 + min >= fHour * 60 + fMin) return true;
        }
    });
};

const filter24H = (layerGroup, layerRemoved, _) => {
    filterLayerGroup(layerGroup, layerRemoved, 'H24', (value) => isPropTrue(value));
};
const filterIchijiHoiku = (layerGroup, layerRemoved, _) => {
    filterLayerGroup(layerGroup, layerRemoved, 'Temp', (value) => isPropTrue(value));
};
const filterYakan = (layerGroup, layerRemoved, _) => {
    filterLayerGroup(layerGroup, layerRemoved, 'Night', (value) => isPropTrue(value));
};
const filterKyujitu = (layerGroup, layerRemoved, _) => {
    filterLayerGroup(layerGroup, layerRemoved, 'Holiday', (value) => isPropTrue(value));
};
const filterEncho = (layerGroup, layerRemoved, _) => {
    filterLayerGroup(layerGroup, layerRemoved, 'Extra', (value) => isPropTrue(value));
};

const filterNameKeyword = (layerGroup, layerRemoved, keyword) => {
    filterLayerGroup(layerGroup, layerRemoved, 'Name', (value) => value.includes(keyword));
};

const filterNewSchool = (layerGroup, layerRemoved, _) => {
    filterLayerGroup(layerGroup, layerRemoved, 'Name', (value) => value.includes('（新設・仮称）'));
};

FILTER_HANDLE.OpenTime = filterOpenTime;
FILTER_HANDLE.CloseTime = filterCloseTime;
FILTER_HANDLE.H24 = filter24H;
FILTER_HANDLE.IchijiHoiku = filterIchijiHoiku;
FILTER_HANDLE.Yakan = filterYakan;
FILTER_HANDLE.Kyujitu = filterKyujitu;
FILTER_HANDLE.Encho = filterEncho;
FILTER_HANDLE.NameKeyword = filterNameKeyword;
FILTER_HANDLE.NewSchool = filterNewSchool;
