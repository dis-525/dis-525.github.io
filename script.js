var mymap = L.map('turkey').setView([38.9637, 35.2433], 6.45);

const markerOptions = {
    riseOnHover: true,
    riseOffset: 300,
    opacity: 0.5,
    color: '#3ff8ff'
};


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


var gl = L.tileLayer('https://api.mapbox.com/styles/v1/alptugan/ckp5oyxuc0dob18rxny5dwy88/tiles/512/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxwdHVnYW4iLCJhIjoiY2tveDh0ZzYwMGRsajJ1b2Fpd29iZ2pscyJ9.lqFVPlsptN65AaK6K790Tg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxwdHVnYW4iLCJhIjoiY2tveDh0ZzYwMGRsajJ1b2Fpd29iZ2pscyJ9.lqFVPlsptN65AaK6K790Tg'
}).addTo(mymap);


// Source data 
// the following line should be a json file that can act as a database of sound recordings
var soundSrc = {
    "src": [
        "<iframe width='200' height='50' scrolling='no' frameborder='no' allow='autoplay' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1009011010&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'></iframe><div style='font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;'><a href='https://soundcloud.com/alptugan' title='alptugan' target='_blank' style='color: #cccccc; text-decoration: none;'>alptugan</a> · <a href='https://soundcloud.com/alptugan/ambient-pre-fx-track-final-trackmixdown' title='Ambient Pre Fx Track Final Trackmixdown' target='_blank' style='color: #cccccc; text-decoration: none;'>Ambient Pre Fx Track Final Trackmixdown</a></div>",
        "<iframe width='200' height='50' scrolling='no' frameborder='no' allow='autoplay' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/898200508&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true'></iframe><div style='font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;'><a href='https://soundcloud.com/alptugan' title='alptugan' target='_blank' style='color: #cccccc; text-decoration: none;'>alptugan</a> · <a href='https://soundcloud.com/alptugan/dasein-of-others' title='Dasein Of Others' target='_blank' style='color: #cccccc; text-decoration: none;'>Dasein Of Others</a></div>"
    ]

}

//alert(soundSrc.src[0]);

// Add Marker to istanbul 
var marker = L.marker([41.0082, 28.9784]).addTo(mymap);
var marker2 = L.marker([39.9334, 32.8597]).addTo(mymap);

marker.bindPopup(soundSrc.src[0]);
marker2.bindPopup(soundSrc.src[1]);

// Events
function onMapClick(e) {
    //marker.update();
    //marker2.update();
    //alert("ko");
}

// mouse event handler
mymap.on('click', onMapClick);