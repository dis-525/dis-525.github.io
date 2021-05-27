// VARIABLES
//Position parameters used for drawing the rectangle
var xPos = 55;
var yPos = 12;
var w = 300;
var h = 350;

let btnClose;
let isShowContent;


// LEAFLET STARTS
var mymap = L.map('turkey').setView([38.9637, 35.2433], 6.45);

// MAP STYLING OVER MAPBOX UI
L.tileLayer('https://api.mapbox.com/styles/v1/alptugan/ckp5oyxuc0dob18rxny5dwy88/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxwdHVnYW4iLCJhIjoiY2tveDh0ZzYwMGRsajJ1b2Fpd29iZ2pscyJ9.lqFVPlsptN65AaK6K790Tg', {
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
        mouseout: resetHighlight,
        click: onClickCity
    });
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

function onClickCity(e) {
    isShowContent = true;
    draw();
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


function setup() {
    var cnv = createCanvas(innerWidth, innerHeight);
    //Set canvas width/height
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    //Set canvas drawing area width/height
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //Position canvas
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.zIndex = 100000;
    canvas.style.pointerEvents = 'none'; //Make sure you can click 'through' the canvas

    //Draw rectangle
}

function draw() {
    // draw fullscreen canvas 0 opacity
    clear();
    //
    if (isShowContent) {

        fill(0, 0, 0, 100);
        noStroke();
        rect(xPos, yPos, w, h);

        fill(255);
        textSize(12);
        text("Click to Close Window", xPos + 10, yPos + 10, w - 40, h)
    }
    //console.log(mouseX);
}

//callback fcn for button1
function btnCloseClicked() {
    //reset slider value to 200
    isShowContent = false;
}

function mousePressed() {
    isShowContent = false;
}