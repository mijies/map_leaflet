
const loadJSON = (data_path, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', data_path, true);
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

const menuListFacilityClickEvent = (li) => {
    li.on = true;
    return () => {
        if (li.on) {
            map.removeLayer(NURSERY_LAYERS[li.id]);
            li.style.color = "grey";
            li.style["background-color"] = "rgba(240,240,240,0.8)";
            li.on = false;
            return;
        }
        map.addLayer(NURSERY_LAYERS[li.id]);
        li.style.color = "white";
        li.style["background-color"] = "";
        li.on = true;
    };
};

const menuListSchoolClickEvent = (li) => {
    li.style.color = "grey";
    li.style["background-color"] = "rgba(240,240,240,0.8)";
    li.on = false;
    return () => {
        if (li.on) {
            map.removeLayer(SCHOOL_LAYERS[li.id]);
            li.style.color = "grey";
            li.style["background-color"] = "rgba(240,240,240,0.8)";
            li.on = false;
            return;
        }
        map.addLayer(SCHOOL_LAYERS[li.id]);
        li.style.color = "";
        li.style["background-color"] = "";
        li.on = true;
    };
};

const menuListFilterEvent = (li) => {
    li.addEventListener('click', _ => {
        document.getElementById("filter-popup-div").style.display = "block";
    });
};

const menuListNewSchoolEvent = (li) => {
    // TODO

    // li.addEventListener('click', _ => {
    //     document.getElementById("filter-popup-div").style.display = "block";
    // });
};

const menuListBaseMapEvent = (li) => {
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
    document.getElementById('btnHelp').addEventListener('click', _ => {
        window.open('howto.html');
    });
};

Object.keys(NURSERY_LAYERS).forEach(key => {
    EVENT_HANDLE[key] = menuListFacilityClickEvent;
});
EVENT_HANDLE.btnElementarySchool = menuListSchoolClickEvent;
EVENT_HANDLE.btnMiddleSchool = menuListSchoolClickEvent;
EVENT_HANDLE.btnFilter = menuListFilterEvent;
EVENT_HANDLE.btnNewSchool = menuListNewSchoolEvent;
EVENT_HANDLE.btnSelectBaseMap = menuListBaseMapEvent;
EVENT_HANDLE.btnSelectStation = menuListStationEvent;
EVENT_HANDLE.btnHelp = menuListHelpEvent;


const addSelectBoxOptions = (id, optList) => {
    const select = document.getElementById(id);
    optList.forEach(opt => {
        const option = document.createElement("option");
        if (opt.value) option.value = opt.value;
        if (opt.text) option.text = opt.text;
        select.appendChild(option);
    });
};

// メニューバーとロゴをWindowサイズに合わせて配置を変更する
const menuResizeHandle = () => {
    const menuList = Array.from(document.getElementById("menu-div").querySelectorAll("li"));
    const facilityList = document.getElementById("menu-div").querySelector("li");
    const menuDiv = document.getElementById("menu-div");
    const btnDiv = document.getElementById("menu-btn-div");
    const thresholdWidth = facilityList.clientWidth + 50;

    const collapseMenu = () => {
        menuList.forEach(list => {
            list.style.display = "none";
            list.style.width = (window.innerWidth / 3) + "px";
        });
        btnDiv.style.display = "block";
        menuDiv.style.top = (btnDiv.clientHeight - 5) + "px";

        if (window.innerHeight > 580) {
            menuDiv.style.left = (window.innerWidth / 3 * 2 - 5) + "px";
        } else {
            menuDiv.style.left = (window.innerWidth / 3 - 5) + "px";
        }
    };

    const uncollapseMenu = () => {
        menuList.forEach(list => {
            list.style.display = "inline-block";
            list.style.width = "";
        });
        menuDiv.style.top = "0px";
        menuDiv.style.left = "50px";
        btnDiv.style.display = "none";
    };

    return () => {
         // Windowサイズがメニューの幅より小さい場合(つまりメニューが複数行となる場合)
        if (thresholdWidth > window.innerWidth) {
            collapseMenu();
            return;
        }
        // Windowサイズがメニューの幅より大きい場合
        uncollapseMenu();
    };
}
