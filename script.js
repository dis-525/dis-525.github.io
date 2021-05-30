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
let isShowContent = false;
let _feature;


// STORY DICT
var cityDict;


var storyDict = {};
var selectedCityName = undefined;

var mainInfoDiv = undefined;


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
    mainInfoDiv = this._div;
    this.update();
    return this._div;
};

info.update = function(cityName) {
    if(storyDict == undefined || storyDict[cityName] == undefined) return;

    console.log(storyDict[cityName]);
    var stories = storyDict[cityName];

    if(mainInfoDiv != undefined && stories != undefined){
        

        var closeBtn = document.createElement("BUTTON");
        closeBtn.innerHTML = "Click to close.";
        closeBtn.id = 'close-button';

        closeBtn.onclick = function () {
            isShowContent = false;
            selectedCityName = undefined;
            clearInfo();
            addDefaultInfo();
        };
        mainInfoDiv.appendChild(closeBtn);


        let storiesDiv = document.createElement('div');
        storiesDiv.id = 'stories-div';

        let storiesTitle = document.createElement('p');
        var storiesTitleText = document.createTextNode(cityName);
        storiesTitle.appendChild(storiesTitleText);

        storiesDiv.appendChild(storiesTitle);

        stories.forEach((story)=>{
            let storyDiv = document.createElement('div');
            storyDiv.id = 'story-div';
            
            let titleDom = document.createElement('p');
            titleDom.id = 'story-title-p';
            var titleText = document.createTextNode(story.title);
            titleDom.appendChild(titleText);
            storyDiv.appendChild(titleDom);

            let authorDom = document.createElement('p');
            authorDom.id = 'author-p';
            var authorText = document.createTextNode("Author(s); "+story.author);
            authorDom.appendChild(authorText);
            storyDiv.appendChild(authorDom);

            console.log(story);
            
            //let thumbnailImg = document.createElement('IMG');
            //thumbnailImg.setAttribute("src", thumbSrc + story.thumbnail_url);
            //thumbnailImg.setAttribute("width", "304");
            //thumbnailImg.setAttribute("height", "228");
            //thumbnailImg.setAttribute("alt", "The Pulpit Rock");

            //storyDiv.appendChild(thumbnailImg);

            var soundCloudIFrame = document.createElement('div');
            soundCloudIFrame.innerHTML = story.soundcloud_iframe.trim();
            storyDiv.appendChild(soundCloudIFrame);

            let descriptionDom = document.createElement('p');
            descriptionDom.id = 'description-p';
            var descriptionText = document.createTextNode(story.description);
            descriptionDom.appendChild(descriptionText);
            storyDiv.appendChild(descriptionDom);


            storiesDiv.appendChild(storyDiv);
        });

        mainInfoDiv.appendChild(storiesDiv);
    }
    
};

info.addTo(mymap);

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
    console.log("Reset highlight"); 
    var layer = e.target;

    layer.setStyle({
        color: '#ff6b6b',
        fillOpacity: 0.5
    });


    console.log(isShowContent);
    if(isShowContent == undefined || !isShowContent){
        clearInfo();
        addDefaultInfo()
    }

    info.update();
}

function clearInfo(){
    if(mainInfoDiv == undefined) return;
    while (mainInfoDiv.firstChild) {
        mainInfoDiv.removeChild(mainInfoDiv.firstChild);
    }
}


function addDefaultInfo(){
    if(mainInfoDiv == undefined) return;
    let defaultTitle = document.createElement('h3');
    let defaultTitleText = document.createTextNode('Please select a city to listen stories.');
    defaultTitle.appendChild(defaultTitleText);

    mainInfoDiv.appendChild(defaultTitle);
}

// ON MOUSE OVER
function highlightFeature(e) {
    
    selectedCityName = e.target.feature.properties.name;

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

    if(isShowContent) return;
    clearInfo();

    info.update(selectedCityName);
}

function onClickCity(e) {
    isShowContent = true;
    selectedCityName = e.target.feature.properties.name;
    clearInfo();
    info.update(selectedCityName);
}
// DATABASE RELATED
get_cities_from_drive((cities) => {
    cityDict = {};
    cities.forEach(city => {
        console.log(city);
        const domFeature = L.geoJSON(city.geojson, markerOptions)
            .addTo(mymap);
        var cityName = city.geojson.properties.name;
        cityDict[cityName] = domFeature;
        if(storyDict[cityName] == undefined) storyDict[cityName] = [];
    });

    get_stories_from_drive((stories) => {
        // console.log(stories);
        stories.forEach(story => {
            if (cityDict[story.city] != undefined) {
                if(storyDict[story.city] == undefined) storyDict[story.city] = [];
                storyDict[story.city].push(story);
            } else {
                console.error("city is not defined: " + story.city);
            }
        });
    });
});

addDefaultInfo();