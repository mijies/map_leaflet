class FilterManager {
    constructor(map) {
        this.map = map;
        this.facNames = Object.keys(NURSERY_LAYERS).map(key => key.slice(4)); // key.slice(4)は 'list.*'のlistより後
        this.facObj = null;
    }

    addItem(item) {
        this.facNames.forEach(name => {
            if (item.id.includes(name)) {
                if (!(name in this.facObj)) this.facObj[name] = {}
                this.facObj[name][item.id.replace(name, '')] = item;
                return;
            }
        });
    }

    filterApply(facObj) {
        this.facObj = facObj || {};

        // 選択された開園終園時刻セレクトボックスの抽出
        Array.from(FILTER_POPUP_SELECT, select => {
            if (select.value !== '開園' && select.value !== '閉園') {
                this.addItem(select);}
        });
        Array.from(FILTER_POPUP_UL, ul => {
            Array.from(ul.children, li => {
                if (li.on) this.addItem(li);
            });
        });

        // 新設園の指定がある場合
        if (document.getElementById('btnNewSchool').on) {
            this.filterNewSchool(this.facObj);
            return;
        }

        // 選択がなければ何もせずに終了
        if (Object.keys(this.facObj).length === 0) return;
        this.filterLayer();
    }

    filterLayer() {
        // 全ての施設レイヤーを削除
        MENU_LIST.forEach(li => {
            if (li.on) li.click(); // TODO: 新規園がonで削除したレイヤーが復活しないか確認
        });

        Object.entries(this.facObj).forEach(([name, items]) => {
            const lName = 'list' + name;
            const layerGroup = NURSERY_LAYERS[lName];
            const removed = NURSERY_LAYERS_REMOVED[lName];

            // 絞り込みで除外されてるレイヤーがあれば戻す
            if (removed.length) {
                removed.forEach(layer => {
                    layerGroup.addLayer(layer);
                });
                removed.length = 0;
            }
            Object.keys(items).forEach(key => {
                FILTER_HANDLE[key](layerGroup, removed, items[key]);
            });

            if (!Object.keys(layerGroup._layers).length) return;
            MENU_LIST.forEach(li => {
                if (li.id === lName) { li.click(); }
            });
        });
    }

    filterNewSchool(facObj) {
        this.facObj = facObj || {};
        for (const name of this.facNames) {
            this.facObj[name] = {NewSchool: null};
        }
        this.filterLayer();
    }
}