
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

let NURSERY_FACILITIES;

const NURSERY_MAP = new Map([ // Mapオブジェクトは順序保証あり ※上から施設数が少ない順
    ["PubNinka", "公立認可保育所"],
    ["Yhoiku", "横浜保育室"],
    ["Kindergarten", "幼稚園"],
    ["Ninkagai", "可外保育施設"],
    ["Jigyosho", "小規模・事業所内保育事業"],
    ["Gakudou", "学童保育"],
    ["PriNinka", "私立認可保育所"],
    ["Handicap", "障害児通所支援事業"]
]);

const NURSERY_LAYERS = {};
const NURSERY_LAYERS_REMOVED = {};
const NURSERY_TYPES = {};

let zIdx = 80;
for (let [key, type] of NURSERY_MAP.entries()) {
    NURSERY_LAYERS[key] = null;
    NURSERY_LAYERS_REMOVED[key] = [];
    NURSERY_TYPES[type] = {
        id: key,
        zIndexOffset: zIdx, // 施設アイコンの重なりの調整
        className: key.toLowerCase() + "-icon"      
    };
    zIdx -= 10;
}

const SCHOOL_LAYERS = {
    listElementarySchool: null,
    listMiddleSchool: null    // L.layerGroup([MiddleSchool, MiddleSchool_loc])
};

let STATION_MAP;
let CURRENT_STATION_NAME = ""; // 最寄駅で選択されている駅名
let CURRENT_STATION = null;  // 最寄駅で選択されているMarkerオブジェクト


const EVENT_HANDLE = {};

const FILTER_HANDLE = {};
let FILTER_POPUP_DIV;
let FILTER_POPUP_UL;
let FILTER_POPUP_SELECT;

const OPEN_TIME_START = 7;
const OPEN_TIME_END = 10;
const CLOSE_TIME_START = 17;
const CLOSE_TIME_END = 22;

let FMGR = null; // new filterManager(map);

const FILTER_COND = {
	OpenTime: '開園',
	CloseTime: '終園',
	H24: '24時間',
	IchijiHoiku: '一時保育',
	Yakan: '夜間',
	Kyujitu: '休日',
	Encho: '延長保育'
};