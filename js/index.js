
const map = initializeMap();

const main = () => {
    initializeGlobals();
    loadNurseryFacilities(map);
    loadSchools(map);
    loadStations(map);
    initializeDom(map);
};

const initializeGlobals = () => {
    MENU_LIST = Array.from(document.getElementById("menu-div").querySelectorAll("li"));
    
    FILTER_POPUP_DIV = document.getElementById('filter-popup-div');
    FILTER_POPUP_UL = document.getElementsByClassName('filter-ul');
    FILTER_POPUP_SELECT = FILTER_POPUP_DIV.querySelectorAll("select");

    STATION_MAP = new Map();
};

const initializeDom = (map) => {
    initializeMenu();

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
        FILTER_POPUP_DIV.style.display ="none";

        // メニューがCollapsedで開かれてる場合に隠す
        if (MENU_COLLAPSED && MENU_LIST[0].style.display === "inline-block") {
            MENU_LIST.forEach(list => {
                list.style.display ="none";
            });
        }
    });

    initializeFilter(map);    
};

const initializeMenu = () => {
    document.getElementById('filter-popup-close').addEventListener('click', _ => {
        FILTER_POPUP_DIV.style.display ="none";
    });

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
};


const initializeFilter = (map) => {
    // 新設園ボタンをクリックした時のイベントの登録
    const btn = document.getElementById('btnNewSchool');
    btn.addEventListener('click', _ => {
        if (btn.on) {
            btn.on = false;
            btn.classList.remove('cls-filter-on');
            return;
        }
        btn.on = true;
        btn.classList.add('cls-filter-on');
    }); 

    const li = document.getElementById('filteredList');
    li.addEventListener('click', _ => {
        if (li.on) {
            li.on = false;
            li.classList.remove('cls-filter-on');
            return;
        }
        li.on = true;
        li.classList.add('cls-filter-on');
    }); 

    Array.from(FILTER_POPUP_UL, ul => {
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

    Array.from(FILTER_POPUP_SELECT, select => {
        addFilterSelectTimeOptions(select)
    });

    document.getElementById('filterApply').addEventListener('click', _ => {
        // メニューがCollapsedで開かれてる場合に隠す
        if (MENU_COLLAPSED && MENU_LIST[0].style.display === "inline-block") {
            MENU_LIST.forEach(list => {
                list.style.display ="none";
            });
        }
        FMGR = FMGR || new FilterManager(map);
        FMGR.filterApply();
    });

    document.getElementById('filterReset').addEventListener('click', _ => {
        for (const li of MENU_LIST) {
            const id = li.id.slice(4);
            if (id in NURSERY_LAYERS) {
                if (NURSERY_LAYERS_REMOVED[id].length) {
                    NURSERY_LAYERS_REMOVED[id].forEach(layer => {
                        NURSERY_LAYERS[id].addLayer(layer);　// 絞り込みで除外されてるレイヤーがあれば戻す
                    });
                    NURSERY_LAYERS_REMOVED[id].length = 0;
                }
                if (!li.on) li.click();
                continue;
            }
            if (li.on) li.click();
        }
        // 開園終園時刻セレクトボックスをデフォルトに戻す
        Array.from(FILTER_POPUP_SELECT, select => {
            if (select.id.includes('Open')) {
                select.value = '開園';
                return;
            }
            select.value = '閉園';
        });
        // 選択されてる項目を解除
        Array.from(FILTER_POPUP_UL, ul => {
            Array.from(ul.children, li => {
                if (li.on) li.click();
            });
        });

        // 施設名キーワードテキストのクリア
        const txt = document.getElementById('nameKeyword');
        txt.value = '';

        // 新設園ボタンの選択解除
        const btn = document.getElementById('btnNewSchool');
        if (btn.on) btn.click();

        // 検索一覧表示の解除
        const li = document.getElementById('filteredList');
        if (li.on) li.click();
    });
};

main();

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
