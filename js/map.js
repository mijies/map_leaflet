
const initializeMap = () => {
    const map = L.map('mapid', {
        // Map State Options
        center: [INIT_LONGITUDE, INIT_LATITUDE],
        maxBounds: setLatLngBounds(),
        maxZoom: INIT_ZOOM_MAX,
        minZoom: INIT_ZOOM_MIN,
        zoom: INIT_ZOOM_LEVEL,
        layers: BaseTileMap.get(INIT_MAP),
        
        // Interaction Options
        bounceAtZoomLimits: false
    });
    L.control.scale({'imperial': false}).addTo(map);
    L.control.locate({"keepCurrentZoomLevel": true}).addTo(map);

    return map;
};

const setLatLngBounds = () => {
    return L.latLngBounds(
        L.latLng(SOUTH_BOUND, WEST_BOUND), L.latLng(NORTH_BOUND, EAST_BOUND)
    );
};

const BaseTileMap = new Map([ // Map is not a leaflet object
    ["標準(Bing)", new L.BingLayer(BING_API_KEY, {'type': 'Road'})],
    ["標準(OSM)", L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    })]
]);
