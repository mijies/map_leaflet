

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

// Windowサイズの変更
let RESIZE_TIMER;

let Nursery_Facilities;

const SCHOOL_LAYERS = {
    btnElementarySchool: null,
    btnMiddleSchool: null    // L.layerGroup([MiddleSchool, MiddleSchool_loc])
};

const STATION_MAP = new Map();
let CURRENT_STATION_NAME = ""; // 最寄駅で選択されている駅名
let CURRENT_STATION = null;  // 最寄駅で選択されているMarkerオブジェクト

const NURSERY_LAYERS = {
    btnPubNinka: [],
    btnPriNinka: [],
    btnJigyosho: [],
    btnYhoiku: [],
    btnNinkagai: [],
    btnDisability: [],
    btnGakudou: [],
    btnKindergarten: []
}

const NURSERY_ICONS = {
    公立認可保育所: {
        btn_id: "btnPubNinka",
        zIndexOffset: 80,
        className:"pubninka-icon"
    },
    横浜保育室: {
        btn_id: "btnYhoiku",
        "zIndexOffset": 70,
        "className": "yhoiku-icon"
    },   
    "幼稚園": {
        "btn_id": "btnKindergarten",
        "zIndexOffset": 60,
        "className": "kindergarten-icon"
    },
    "認可外保育施設": {
        "btn_id": "btnNinkagai",
        "zIndexOffset": 50,
        "className": "ninkagai-icon"
    },
    "小規模・事業所内保育事業": {
        "btn_id": "btnJigyosho",
        "zIndexOffset": 40,
        "className": "jigyosho-icon"
    },
    "学童保育": {
        "btn_id": "btnGakudou",
        "zIndexOffset": 30,
        "className": "gakudou-icon"
    },
    "私立認可保育所": {
        "btn_id": "btnPriNinka",
        "zIndexOffset": 20,
        "className": "prininka-icon"
    },
    "障害児通所支援事業": {
        "btn_id": "btnDisability",
        "zIndexOffset": 10,
        "className": "disability-icon"
    }
}