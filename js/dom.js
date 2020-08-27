
const initializeDom = () => {
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

    initializeFilter();    
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
