
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
        fMgr = new FilterManager(map);
        fMgr.applyFilter();
    });
};

