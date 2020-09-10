class FilterManager {
    constructor(map) {
        this.map = map;
        this.facNames = Object.keys(NURSERY_LAYERS).map(key => key.slice(4)); // key.slice(4)は 'list.*'のlistより後
    }

    addCond(facObj, id, value) {
        this.facNames.forEach(name => {
            if (id.includes(name)) {
                if (!(name in facObj)) facObj[name] = {}
                facObj[name][id.replace(name, '')] = value;
                return;
            }
        });
    }

    addAll(facObj, key, value) {
        // 選択がなければ全ての施設が新設園の対象
        if (!Object.keys(facObj).length) {
            for (const name of this.facNames) {
                facObj[name] = {};
            }         
        }

        Object.keys(facObj).forEach(name => {
            facObj[name][key] = value;
        });
    }

    filterApply() {
        const facObj = {};

        // 選択された開園終園時刻セレクトボックスの抽出
        Array.from(FILTER_POPUP_SELECT, select => {
            if (select.value !== '開園' && select.value !== '閉園') {
                this.addCond(facObj, select.id, select.value);
            }
        });
        Array.from(FILTER_POPUP_UL, ul => {
            Array.from(ul.children, li => {
                if (li.on) this.addCond(facObj, li.id, true);
            });
        });
        const kw = document.getElementById("nameKeyword").value;
        if (kw) this.addAll(facObj, "NameKeyword", kw);

        const fl = document.getElementById("filteredList").on;

        // 新設園の指定がある場合
        if (document.getElementById('btnNewSchool').on) {
            this.filterNewSchool(facObj);
            // if (fl) this.filteredList(facObj);
            return;
        }

        // 選択がなければ何もせずに終了
        if (Object.keys(facObj).length === 0) return;

        // if (fl) this.filteredList(facObj);
        this.filterLayer(facObj);
    }

    filterNewSchool(fObj) {
        const facObj = fObj || {};
        this.addAll(facObj, "NewSchool", true);
        this.filterLayer(facObj);
    }

    filterLayer(facObj) {
        // 全ての施設レイヤーを削除
        MENU_LIST.forEach(li => {
            if (li.on) li.click();
        });

        Object.entries(facObj).forEach(([name, items]) => {
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

    filteredList(facObj) {
        // 検索結果の一覧を新規ブラウザタブで表示。
        let urlQuery = '?';
        // urlQuery += 'nameKeyword' + '=' + encodeURI(filterSet.nameKeyword || 'null') + '&';
        urlQuery += 'newSchool' + '=' + encodeURI(filterSet.newSchool || 'false') + '&';
        Object.keys(facObj).forEach(name => {
            urlQuery += name + '=' + facObj[name][item] + '&';
        });
        window.open(
            'filteredList.html' + urlQuery.slice(0, -1) // クエリで検索条件を新規Windowへ渡す
        );
    }
}