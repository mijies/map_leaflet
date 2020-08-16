

// TODO: Create Marker Object directly should be faster
const AddNurseryLayers = (geoJSON) => {
    // layers for each facility type
    Object.keys(NURSERY_STYLES).forEach((type) => {
        const a = L.geoJSON(Nursery_Facilities, getGeoJSONOptions(type)).addTo(map);
    });
}

const getGeoJSONOptions = (type) => {
    return {
        pointToLayer: nurseryStyleFunction(type),
        onEachFeature: nurseryOnEachFeature,
        filter: (feature, _) => feature.properties.Type === type
    };
};

const nurseryStyleFunction = (type) => {
    const style = NURSERY_STYLES[type]
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

    // closure for table content
    table = (() => {
        var content = '<table><tbody>';
        const fn = (th, td) => {
            content += '<tr>';
            content += `<th>${th}</th>`;
            content += `<td>${td}</td>`;
            content += '</tr>';
        }
        fn.done = () => content += '</tbody></table>';
        return fn;
    })();

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

