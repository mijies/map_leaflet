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
                if (li.on) this.addCond(facObj, li.id, null);
            });
        });
        const kw = document.getElementById("nameKeyword").value;
        if (kw) this.addAll(facObj, "NameKeyword", kw);

        const fl = document.getElementById("filteredList").on;

        // 新設園の指定がある場合
        if (document.getElementById('btnNewSchool').on) {
            this.filterNewSchool(facObj);
            if (fl) this.filteredList(facObj);
            return;
        }

        // 選択がなければ何もせずに終了
        if (Object.keys(facObj).length === 0) return;

        if (fl) this.filteredList(facObj);
        this.filterLayer(facObj);

        // 検索ポップアップを隠す
        FILTER_POPUP_DIV.style.display ="none";
    }

    filterNewSchool(fObj) {
        const facObj = fObj || {};
        this.addAll(facObj, "NewSchool", null);
        this.filterLayer(facObj);
    }

    filterLayer(facObj) {
        // 全ての施設レイヤーを削除
        if (MENU_LIST) {
            MENU_LIST.forEach(li => {
                if (li.on) li.click();
            });
        }

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

            if (MENU_LIST) {
                if (!Object.keys(layerGroup._layers).length) return;
                MENU_LIST.forEach(li => {
                    if (li.id === lName) { li.click(); }
                });
            }
        });
    }

    filteredList(facObj) {
        // 検索結果の一覧を新規ブラウザタブで表示。
        let urlQuery = '?';
        Object.entries(facObj).forEach(([name, items]) => {
            Object.keys(items).forEach(key => {
                const value =  items[key] ? `::${items[key]}`  : "";
                urlQuery += `${name}=${key}${value}&`;
            });
        });
        window.open(
            'filteredList.html' + urlQuery.slice(0, -1) // クエリで検索条件を新規Windowへ渡す
        );
    }

}


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
