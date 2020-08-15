

const setLatLngBounds = () => {
    return L.latLngBounds(
        L.latLng(SOUTH_BOUND, WEST_BOUND), L.latLng(NORTH_BOUND, EAST_BOUND)
    );
};

const BingLayer = new L.BingLayer(BING_API_KEY, {'type': 'Road'});

const OSMLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
});

const TileLayersList = [
    BingLayer,
    OSMLayer
];

const TileLayersObjs = {
    "<span style='color: gray'>Bing</span>": BingLayer,
    "<span style='color: gray'>OSM</span>": OSMLayer
};


// class Map {
//     constructor (mapServerList) {
//         this.mapServerList = mapServerList;
//         this.map = L.map('mapid');
//         this.popup;
//         this.nurseryFacilities;
//     }

//     init () {
//         this.map.setView([INIT_LONGITUDE, INIT_LATITUDE], INIT_ZOOM_LEVEL);

//         L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//             continuousWorld: false,
//             maxZoom: INIT_ZOOM_MAX,
//             minZoom: INIT_ZOOM_MIN,
//             attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
//                 '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//                 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//             id: 'mapbox/streets-v11',
//             tileSize: 512,
//             zoomOffset: -1
//         }).addTo(this.map);

//         loadJSON('data/nurseryFacilities.geojson', (response) => {
//             this.nurseryFacilities = JSON.parse(response);
//             L.geoJSON(this.nurseryFacilities, {
//                     onEachFeature: function(feature, layer){
//                         layer.bindPopup(feature.properties.Name);
//                     }
//                 }).addTo(this.map);
//         });
//         return this;
//     }
// }