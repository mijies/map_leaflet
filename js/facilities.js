

const nurseryStyleFunction = (feature, coordinates) => {
    return L.marker(coordinates, {icon:
       L.icon({
           iconUrl: "images/029.png",
           iconSize: [21, 21],
           className: NurseryIconClass[feature.properties.Type]
       })
})}

// className: `nusrsery-div-icon ${NurseryIconClass[feature.properties.Type]}`