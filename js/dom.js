
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
    document.getElementById('btnNewSchool').addEventListener('click', e => {
        const btn = e.target;
        if (btn.on) {
            btn.on = false;
            btn.classList.remove('cls-filter-on');
            return;
        }
        btn.on = true;
        btn.classList.add('cls-filter-on');
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
            if (li.id in NURSERY_LAYERS) {
                if (NURSERY_LAYERS_REMOVED[li.id].length) {
                    NURSERY_LAYERS_REMOVED[li.id].forEach(layer => {
                        NURSERY_LAYERS[li.id].addLayer(layer);　// 絞り込みで除外されてるレイヤーがあれば戻す
                    });
                    NURSERY_LAYERS_REMOVED[li.id].length = 0;
                }
                if (!li.on) li.click();
                continue;
            }
            if (li.on) li.click(); // TODO: 新規園がonで削除したレイヤーが復活しないか確認
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
    });
};

