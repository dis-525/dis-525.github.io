
function parse_city_data(data){
  var rawCities = data.split(/\r?\n/);
  var cities = [];
  rawCities.forEach((row) => {
      var city_name = row.slice(0, row.indexOf(','));
      var city_geojson_raw = row.slice(row.indexOf(',') + 2, row.length-1).replace(new RegExp('\"\"', "g"), '\"');
      var city_geojson = JSON.parse(city_geojson_raw);
      cities.push({
        name: city_name,
        geojson: city_geojson
      });
  });
  return cities;
}

function get_cities_from_drive(handle_cities){
  var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRiVRjUsxYLR6FVvxAuGckaZTIGPB12u_fbo5I6y51VfiKwPd84h3TYdZiXkU3V1lVQ0jN7w544sztK/pub?gid=0&single=true&output=csv';
  // <DOCUMENTID> is the id of the spreadsheet that you want to get data from
  $.ajax({
    url: url,
    success: function (data) {
      var parsed_cities = parse_city_data(data);    
      handle_cities(parsed_cities);
    },
    error: function (err) {
      console.log(err.status);
    }
  });
}

function parse_story_data(data){
  var rawStories = data.split(/\r?\n/);
  var stories = [];
  rawStories.forEach((rawStory)=>{
    var columns = rawStory.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    stories.push({
      city: columns[0],
      title: columns[1],
      author: columns[2],
      thumbnail_url: columns[3],
      description: columns[4],
      soundcloud_iframe: columns[5].replace(new RegExp('\"\"', "g"), '\"')
    });
  });

  return stories;
}

function get_stories_from_drive(handle_stories){
    var url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdhUUk-O0JDTAAlkeY5dj9Qb_JjDComkvU7ntGnhnBfAcVlhlRVre2YkU9JSXK88e4ozpVkgKuqoj-/pub?gid=0&single=true&output=csv";
    $.ajax({
      url: url,
      success: function (data) {
        var parsed_stories = parse_story_data(data);    
        handle_stories(parsed_stories);
      },
      error: function (err) {
        console.log(err.status);
      }
    });
}