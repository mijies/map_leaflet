

const BING_API_KEY = 'Ahs7qRRd1eAtwgE7igbe7DOnXYvq_Pg81foKgM727r3S1949_mj8hrsqIY4iAxW9';

const INIT_LONGITUDE = 35.51264;
const INIT_LATITUDE = 139.61827;

const SOUTH_BOUND = 34.5;
const WEST_BOUND = 138.0;
const NORTH_BOUND = 36.0;
const EAST_BOUND = 141.0;

const INIT_ZOOM_MAX = 18;
const INIT_ZOOM_MIN = 10;
const INIT_ZOOM_LEVEL = 13;

let nurseryFacilities;

const NurseryIconStyle = {
    "公立認可保育所": {
        "zIndexOffset": 800,
        "className":"pubninka-div-icon"
    },
    "横浜保育室": {
        "zIndexOffset": 700,
        "className": "yhoiku-div-icon"
    },   
    "幼稚園": {
        "zIndexOffset": 600,
        "className": "kindergarten-div-icon"
    },
    "認可外保育施設": {
        "zIndexOffset": 500,
        "className": "ninkagai-div-icon"
    },
    "小規模・事業所内保育事業": {
        "zIndexOffset": 400,
        "className": "jigyosho-div-icon"
    },
    "学童保育": {
        "zIndexOffset": 300,
        "className": "gakudou-div-icon"
    },
    "私立認可保育所": {
        "zIndexOffset": 200,
        "className": "prininka-div-icon"
    },
    "障害児通所支援事業": {
        "zIndexOffset": 100,
        "className": "disability-div-icon"
    }
}