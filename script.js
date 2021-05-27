var mymap = L.map('turkey').setView([38.9637, 35.2433], 6.45);

// MAP STYLING OVER MAPBOX UI
var gl = L.tileLayer('https://api.mapbox.com/styles/v1/alptugan/ckp5oyxuc0dob18rxny5dwy88/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxwdHVnYW4iLCJhIjoiY2tveDh0ZzYwMGRsajJ1b2Fpd29iZ2pscyJ9.lqFVPlsptN65AaK6K790Tg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

// DEFAULT BORDERS OF THE CITIES & STYLING
const markerOptions = {
    weight: 0.1,
    opacity: 1,
    fillOpacity: 0.5,
    color: '#ff6b6b',
    onEachFeature: onEachFeature
};


// BIND MOUSE OVER & OUT EVENTS
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
    //console.log("koko");
}

// ON MOUSE OUT
function resetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        color: '#ff6b6b',
        fillOpacity: 0.5
    });
}

// ON MOUSE OVER
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 0,
        color: '#ee5253',
        dashArray: '-',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// DATABASE RELATED
get_cities_from_drive((cities) => {
    var cityDict = {};
    cities.forEach(city => {
        const domFeature = L.geoJSON(city.geojson, markerOptions)
            .addTo(mymap);
        cityDict[city.name] = domFeature;
    });

    get_stories_from_drive((stories) => {
        console.log(stories);
        stories.forEach(story => {
            var domFeature = cityDict[story.city];
            if (domFeature) {
                domFeature.bindPopup(story.soundcloud_iframe);
            } else {
                console.error("city is not defined: " + story.city);
            }
        });
    });
});




// Add Marker to istanbul 
//var marker = L.marker([41.0082, 28.9784]).addTo(mymap);
//var marker2 = L.marker([39.9334, 32.8597]).addTo(mymap);

//marker.bindPopup(soundSrc.src[0]);
//marker2.bindPopup(soundSrc.src[1]);

// Events
function onMapClick(e) {
    //marker.update();
    //marker2.update();
    //alert("ko");
}

// mouse event handler
mymap.on('click', onMapClick);