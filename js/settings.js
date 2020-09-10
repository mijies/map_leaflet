
const BING_API_KEY = 'Ahs7qRRd1eAtwgE7igbe7DOnXYvq_Pg81foKgM727r3S1949_mj8hrsqIY4iAxW9';

const INIT_MAP = '標準(Bing)'
const INIT_LONGITUDE = 35.51264;
const INIT_LATITUDE = 139.61827;

const SOUTH_BOUND = 34.5;
const WEST_BOUND = 138.0;
const NORTH_BOUND = 36.0;
const EAST_BOUND = 141.0;

const INIT_ZOOM_MAX = 18;
const INIT_ZOOM_MIN = 10;
const INIT_ZOOM_LEVEL = 13;

let RESIZE_TIMER; // Windowサイズの変更

let MENU_COLLAPSED = false;
let MENU_LIST; // menu-divの全てのli要素

let Nursery_Facilities;

const SCHOOL_LAYERS = {
    listElementarySchool: null,
    listMiddleSchool: null    // L.layerGroup([MiddleSchool, MiddleSchool_loc])
};

let FMGR = null; // new filterManager(map);
const FILTER_HANDLE = {};
let FILTER_POPUP_DIV;
let FILTER_POPUP_UL;
let FILTER_POPUP_SELECT;

const OPEN_TIME_START = 7;
const OPEN_TIME_END = 10;
const CLOSE_TIME_START = 17;
const CLOSE_TIME_END = 22;

let STATION_MAP;
let CURRENT_STATION_NAME = ""; // 最寄駅で選択されている駅名
let CURRENT_STATION = null;  // 最寄駅で選択されているMarkerオブジェクト

const NURSERY_LAYERS = {
    listPubNinka: null,
    listPriNinka: null,
    listJigyosho: null,
    listYhoiku: null,
    listNinkagai: null,
    listHandicap: null,
    listGakudou: null,
    listKindergarten: null
}

const NURSERY_LAYERS_REMOVED = {};
Object.keys(NURSERY_LAYERS).forEach(key => {
    NURSERY_LAYERS_REMOVED[key] = [];
});



const EVENT_HANDLE = {};

const NURSERY_ICONS = {
    公立認可保育所: {
        list_id: "listPubNinka",
        zIndexOffset: 80,
        className:"pubninka-icon"
    },
    横浜保育室: {
        list_id: "listYhoiku",
        "zIndexOffset": 70,
        "className": "yhoiku-icon"
    },   
    幼稚園: {
        "list_id": "listKindergarten",
        "zIndexOffset": 60,
        "className": "kindergarten-icon"
    },
    可外保育施設: {
        "list_id": "listNinkagai",
        "zIndexOffset": 50,
        "className": "ninkagai-icon"
    },
    "小規模・事業所内保育事業": {
        "list_id": "listJigyosho",
        "zIndexOffset": 40,
        "className": "jigyosho-icon"
    },
    学童保育: {
        "list_id": "listGakudou",
        "zIndexOffset": 30,
        "className": "gakudou-icon"
    },
    私立認可保育所: {
        "list_id": "listPriNinka",
        "zIndexOffset": 20,
        "className": "prininka-icon"
    },
    障害児通所支援事業: {
        "list_id": "listHandicap",
        "zIndexOffset": 10,
        "className": "handicap-icon"
    }
}