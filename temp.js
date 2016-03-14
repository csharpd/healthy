function processVenue(item) {
  item_html = "<li><h2>" + item.venue.name + "</h2>";

  //
  //if (episode.programme.image) {
  //  item_html += "<img src=http://ichef.bbci.co.uk/images/ic/272x153/"+ episode.programme.image.pid +".jpg />";
  //} else {
  //  item_html += "<img src='http://placehold.it/272x153' />";
  //}
  //

  if (item.venue.rating) {
    item_html += "<p><span class='service'>Rated</span><strong>" + item.venue.rating + "</strong></p>";
  }

  if (item.venue.price && item.venue.price.message) {
    item_html += "<p><span class='service'>Price</span><strong>" + item.venue.price.message + "</strong></p>";
  }

  if (item.venue.hours && item.venue.hours.status) {
    item_html += "<p>" + item.venue.hours.status + "</p>";
  }

  if (item.venue.url) {
    item_html += "<a href='" + item.venue.url + "'><h3>website<h3></a>";
  }

  if (item.venue.location) {
    item_html += "<div id='map'></div>";
    var map;
    var pos = {lat: item.venue.location.lat, lng: item.venue.location.lng};

    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 8
      });
      var infoWindow = new google.maps.InfoWindow({map: map});
      infoWindow.setPosition(pos);
      infoWindow.setContent(item.venue.name);
    }

    initMap();
  }

  if (item.venue.menu && item.venue.menu.url) {
    item_html += "<a class='view-more' href='" + item.venue.menu.url + "'>menu</a></li>";
  }

  return item_html;
}
