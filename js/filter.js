class FilterManager {
    constructor(map) {
        this.map = map;
        this.facObj = {};
        this.facNames = Object.keys(NURSERY_LAYERS).map(key => key.slice(4)); // key.slice(4)は 'list.*'のlistより後
    }

    applyFilter() {
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

        // 選択がなければ何もせずに終了
        if (Object.keys(this.facObj).length === 0) return;

        // 全ての施設レイヤーを削除
        Object.values(NURSERY_LAYERS).forEach(layer => map.removeLayer(layer));

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
}