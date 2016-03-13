function getVenues(option, formatedLocation) {
  $.ajax({
    url: "https://api.foursquare.com/v2/venues/explore?client_id=YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ&client_secret=EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY&v=20140806&query="+option+"&radius=1000&near="+formatedLocation+"%2C%20London%2C%20Greater%20London",
    dataType: 'json',
    beforeSend: function () {
      $("#venues").empty();
      $("#venues").append("<div class='spinner'><img src='spinner.gif' /></div>");
    }
  }).done(function(data) {
    $(".spinner").remove();
    if (data.response.groups.length > 0) {
      $.each(data.response.groups[0].items, function(index, item) {
        console.log(item, item.venue.name);
        $("#venues").append(processVenue(item));
      })
    } else {
      $("#venues").append("<div class='no-programmes'>No venues serving" + option + " around " + formatedLocation +"</div>");
    }
  }).fail(function() {
    console.log("something went wrong");
  });
}

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

  if (item.venue.menu && item.venue.menu.url) {
    item_html += "<a class='view-more' href='"+ item.venue.menu.url+"'>menu</a></li>";
  }

  return item_html;
}

function noSuchLocation(place) {
  var formatedLocation = place.substr(0,1).toUpperCase()+place.substr(1);
  $('#profile h2').html(formatedLocation + " - Where even is that!? <br> Try somewhere else ");
  $('#options .option').hide();
}

function showOptions(place) {
  var formatedLocation = place.substr(0,1).toUpperCase()+place.substr(1);
  $('#profile #location').html(formatedLocation + ". We can work with that");
  $('#profile #instructions').html("Choose something you fancy");
  $('#options .option').show();
}

function formatLocation(str) {
  var stringNoSpaces = str.replace(" ","%20");
  var stringNoApostrophes = stringNoSpaces.replace("'","%27");
  return stringNoApostrophes
}

$(document).ready(function () {
  $('#options .option').hide();
  $(document).on('keypress', '#username', function (e) {
    if (e.which == 13) {
      place = $(this).val();
      $(this).val("");
      console.log(place);
      //response = getPlaceCoordinates(place);
      if (true) {
        showOptions(place);
        return place;
      } else {
        noSuchLocation(place)
      }

      //response = getGithubInfo(username);
      //
      //if (response.status == 200) {
      //  showUser(JSON.parse(response.responseText));
      //} else {
      //  noSuchUser(username);
      //}
    }
  });
  $(document).on('click', '#options li', function(e){
    option = $(this).attr('id');
    $("#options li").removeClass('active');
    $(this).addClass('active');
    console.log(place, 'PLACE');
    var formatedLocation = formatLocation(place);
    //var formatedLocation = "King%27s%20Cross";

    getVenues(option, formatedLocation);
  });

});

//function getLatLong(adress) {
//  try{
//    if(adress=="")return("");
//    var geo = Maps.newGeocoder().geocode(adress);
//    if(geo.status=="OK"){
//      var lng = geo.results[0].geometry.viewport.southwest.lng;
//      var lat = geo.results[0].geometry.viewport.southwest.lat;
//      return([lat,lng]);
//    }
//    else{
//      return("error");
//    }
//  }
//  catch(err){
//    return(err);
//  }
//}
