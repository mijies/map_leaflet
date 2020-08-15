

const nurseryStyleFunction = (feature, coordinates) => {
    const style = NurseryIconStyle[feature.properties.Type]
    return L.marker(coordinates, {
        icon: L.icon({
           iconUrl: "images/029.png",
           iconSize: [21, 21],
           className: style.className
        }),
        zIndexOffset: style.zIndexOffset
})}

// className: `nusrsery-div-icon ${NurseryIconClass[feature.properties.Type]}`