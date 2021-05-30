// VARIABLES
//Position parameters used for drawing the rectangle
var xPos = 55;
var yPos = 12;
var w = 300;
var h = 380;

let totalContentH = 0;
let thumb;
let thumbSrc = "https://drive.google.com/uc?export=view&id=";
let title = "Some Kind of Title";
let author = "Name Surname";
let desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

let btnClose;
let isShowContent;
let _feature;


// STORY DICT
var cityDict;



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

var info = L.control();
info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

info.update = function(props) {
    this._div.innerHTML = '<h4>Artified Research Recordings</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.author :
        'Hover over a city');
};

info.addTo(mymap);

// BIND MOUSE OVER & OUT EVENTS
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onClickCity
            /*click: function(e) {
                document.getElementById("info").innerHTML = feature.properties.name;
                $("#feature_infos").stop();
                $("#feature_infos").fadeIn("fast");

                console.log(feature.properties.name);
                //$("#feature_infos").fadeOut(5000);
                // This is your click handler. 
                // Your feature is available here as e.target, and the 
                //featureInfo object we added is available as e.target.featureInfo 
            }*/
    });
}

// ON MOUSE OUT
function resetHighlight(e) {
    var layer = e.target;

    layer.setStyle({
        color: '#ff6b6b',
        fillOpacity: 0.5
    });

    info.update();
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

    info.update(layer.feature.properties);
}

function onClickCity(e) {

    isShowContent = true;
    let thumbId = "1jOSKaYD5hWpgOMvBhejxewbsjwf7ORDv";
    // Call related data
    thumb = loadImage("test.jpg");
}
// DATABASE RELATED
get_cities_from_drive((cities) => {
    cityDict = {};
    cities.forEach(city => {
        const domFeature = L.geoJSON(city.geojson, markerOptions)
            .addTo(mymap);
        cityDict[city.name] = domFeature;
    });

    get_stories_from_drive((stories) => {
        // console.log(stories);
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

        fill(0, 0, 0, 130);
        noStroke();
        rect(xPos, yPos, w, h, 10);

        fill(255);
        textSize(12);
        let curYPos = yPos + 10;
        text("Click to Close Window", xPos + 10, curYPos, w - 40, h);

        // Display thumbnail
        curYPos += 20;
        image(thumb, xPos + 10, curYPos);

        // Display author name
        curYPos += thumb.height + 8;
        fill('#cccccc');
        textStyle(BOLD);
        text("Author", xPos + 10, curYPos, w - 40, h);
        fill('#ffffff');
        textStyle(NORMAL);

        curYPos += 15;
        text(author, xPos + 10, curYPos, w - 40, h);

        // Display title
        curYPos += 20;
        fill('#cccccc');
        textStyle(BOLD);
        text("Title", xPos + 10, curYPos, w - 15, h);
        fill('#ffffff');
        textStyle(NORMAL);
        curYPos += 15;
        text(title, xPos + 10, curYPos, w - 10, h);


        // Display description
        curYPos += 20;
        fill('#cccccc');
        textStyle(BOLD);
        text("Description", xPos + 10, curYPos, w - 15, h);
        fill('#ffffff');
        textStyle(NORMAL);
        curYPos += 15;
        text(desc, xPos + 10, curYPos, w - 10, h);
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