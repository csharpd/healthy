window.getLocation = function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    map = new GMaps({
      div: '#map',
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
    });
    marker = map.addMarker({
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
      icon: 'images/zombie_walk.gif'
    });
    currentLocation = position.coords;
  });
}

window.clearMap = function() {
  map.removeMarkers();
}

window.mapMyLocation = function() {
  map.addMarker({
    lat: currentLocation.latitude,
    lng: currentLocation.longitude,
    icon: '/images/zombie_walk.gif',
    optimized: false
  });
}

window.placeOnMap = function(element) {
  var venue = elementToVenue(element);
  if(hasPriceAndRating(venue)) {
    map.addMarker({
      lat: venue.location.lat,
      lng: venue.location.lng,
      title: venue.name,
      infoWindow: {
        content: venue.name +": "+venue.rating+" Cost -"+venue.price.message
      }
    });
  };
}

window.sortByRating = function(rawVenues, callback) {
  var venues = rawVenues.sort(function(a,b){
    return a.venue.rating - b.venue.rating;
  });
  callback(venues);
}

window.noSorting = function(rawVenues, callback) {
  callback(rawVenues);
}


window.addToList = function(element) {
  var venue = elementToVenue(element);
  var template = Handlebars.compile(profile_source);
  if(hasPriceAndRating(venue)) {
    var result = template({venue: venue, currentLocation: window.currentLocation});
    $(result).prependTo('#results');
  }
}

function elementToVenue(element) {
  return element.venue;
}

function hasPriceAndRating(venue) {
  return venue.price && venue.rating;
}

function cleanImageName(name) {
  return name.replace('+', '_');
}

window.changeBackground = function() {
  name = cleanImageName($(event.target).data('query'));
  $('html').css('background-image',"url('/images/" + name + ".jpg')");
}
