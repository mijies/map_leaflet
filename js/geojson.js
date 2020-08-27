
loadNurseryFacilities = (map) => {
    loadJSON('data/nurseryFacilities.geojson', response => {
        Nursery_Facilities = JSON.parse(response);
        AddNurseryLayers(Nursery_Facilities, map);
    });
};

// TODO: Create Marker Object directly could be faster
const AddNurseryLayers = (Nursery_Facilities, map) => {
    // layers for each facility type
    Object.keys(NURSERY_ICONS).forEach(type => {
        NURSERY_LAYERS[NURSERY_ICONS[type].list_id] = L.geoJSON(
            Nursery_Facilities, nurseryGeoJSONOptions(type)).addTo(map);
    });
    // for 
}

loadSchools = (map) => {
    const elementary = [];
    loadJSON('data/Elementary_loc.geojson', response => {
        loadJSON('data/Elementary.geojson', response => {
            elementary.push(L.geoJSON(JSON.parse(response)));
            SCHOOL_LAYERS["listElementarySchool"] = L.layerGroup(elementary);
        });
        elementary.push(L.geoJSON(JSON.parse(response)));
    });

    const middle = [];
    loadJSON('data/MiddleSchool_loc.geojson', response => {
        loadJSON('data/MiddleSchool.geojson', response => {
            middle.push(L.geoJSON(JSON.parse(response)));
            SCHOOL_LAYERS["listMiddleSchool"] = L.layerGroup(middle);
        });
        middle.push(L.geoJSON(JSON.parse(response)));
    });
};

const nurseryGeoJSONOptions = (type) => {
    return {
        pointToLayer: nurseryStyleFunction(type),
        onEachFeature: nurseryOnEachFeature,
        filter: (feature, _) => feature.properties.Type === type
    };
};

const nurseryStyleFunction = (type) => {
    const style = NURSERY_ICONS[type]
    return (feature, coordinates) => {
        return L.marker(coordinates, {
            icon: L.icon({
            iconUrl: "images/029.png",
            iconSize: [21, 21],
            className: style.className
            }),
            zIndexOffset: style.zIndexOffset
        })
}};

const nurseryOnEachFeature = (feature, layer) => {
    layer.bindPopup(
        getNurseryPopupHtml(feature),
        getNurseryPopupOptions()
    );
};

const getNurseryPopupOptions = () => {
    return {
        'maxWidth': '500'
    };
};

const getNurseryPopupHtml = (feature) => {
    const p = feature.properties;
    let txt = `<b>${p.Name}</b></br>`;

    table = htmlTableBuilder();
    table('区分', p.Type);
    
    if (p.Open && p.Close) {
        table('時間', p.Open + '〜' + p.Close);
    }

    if (p.Memo) {
        table('', p.Memo);
    }

    // table content without header
    let info = "";
    if (p.Temp)     {info += '一時保育 '};
    if (p.Holiday)  {info += '休日保育 '};
    if (p.Night)    {info += '夜間保育 '};
    if (p.H24)      {info += '24時間 '};
    if (p.Extra)    {info += '延長保育 '};
    if (p['児童発達支援'])      {info += '児童発達支援 '};
    if (p['重心（児童発達）'])   {info += `(${p['重心（児童発達）']})`};
    if (p['放課後デイ'])        {info += '放課後デイ '};
    if (p['重心（放課後デイ）']) {info += `(${p['重心（放課後デイ）']})`};

    if (info) {
        table('', info);
    }

    if (p.AgeS && p.AgeE) {
        table('年齢', p.AgeS + '〜' + p.AgeE);
    }

    if (p.Full) {
        table('定員', p.Full);
    }

    if (p.TEL) {
        table('TEL', p.TEL);
    }

    if (p.FAX) {
        table('FAX', p.FAX);
    }

    if (p.Add1 || p.Add2) {
        table('住所', p.Add1 + p.Add2);
    }

    if (p.url) {
        table('Web', `<a href=${p.url} target="_blank">${p.url}</a>`);
    }

    if (p.Owner) {
        table('設置者', p.Owner);
    }

    if (p['設立年度']) {
        table('設立年度', p['設立年度']);
    }

    if (p['プレ幼稚園']) {
        table('プレ幼稚園', (p['プレ幼稚園'] === 'Y') ? "あり" : "なし");
    }

    if (p['園バス']) {
        table('園バス', (p['園バス'] === 'Y') ? "あり" : "なし");
    }

    if (p['給食']) {
        table('給食', p['給食']);
    }

    return txt + table.done();
};

loadStations = (map) => {
    loadJSON('data/station.geojson', response => {
        JSON.parse(response).features.forEach(f => {
            const p = f.properties;
            const s = `${p.N05_003} (${p.N05_002})`;
            if (!STATION_MAP.has(s)) STATION_MAP.set(s, []);
            STATION_MAP.get(s).push({
                name: p.N05_011,
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0]
            });
        });
        addStationSelectboxOptions();
    });
};

const addStationSelectboxOptions = () => {
    const select = document.getElementById("selectStation");
    const optGrp = document.createElement("optgroup");
    optGrp.label = "公共交通機関施設";
    select.appendChild(optGrp);

    for (const key of STATION_MAP.keys()) {
        const optGrp = document.createElement("optgroup");
        optGrp.label = key;
        STATION_MAP.get(key).forEach(data => {
            const option = document.createElement("option");
            option.value = data.name;
            option.text = data.name;
            optGrp.appendChild(option);
        });
        select.appendChild(optGrp);
    }
};