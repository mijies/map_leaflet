const NAMES = [];

const main = () => {
    const idx = location.search.substr(1);
    if (idx.length !== 1) return;

    console.log(Object.keys(sessionStorage));
    console.log(location.search);

    // 施設名の取得
    Object.keys(sessionStorage).forEach(key => {
        if (key[0] === idx) NAMES.push(key.substr(1));
    });

    loadJSON('data/nurseryFacilities.geojson', response => {
        filterNurseryFacilities(JSON.parse(response), NAMES);
    });
};

const filterNurseryFacilities = (geojson, names) => {
    geojson.features.forEach(feature => {
        if (NAMES.indexOf(feature.properties.Name) >= 0) {
            console.log(feature.properties.Name)
        }
    });
};

const loadJSON = (data_path, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', data_path, true);
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

// urlでクエリが渡されていれば実行
if(location.search) main();
