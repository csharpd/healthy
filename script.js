//function getVenues(option) {
//    $.ajax({
//        url: 'https://api.foursquare.com/v2/venues/explore?client_id=YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ&client_secret=EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY&v=20140806&guery='+option+'&radius=1000&near=King%27s%20Cross%2C%20London%2C%20Greater%20London&nearGeoId=4006723',
//        dataType: 'json',
//        beforeSend: function () {
//            $("#venues").empty();
//            $("#venues").append("<div class='spinner'><img src='spinner.gif' /></div>");
//        }
//    }).done(function (data) {
//        $(".spinner").remove();
//        console.log(data);
//    }).fail(function () {
//        console.log("something went wrong");
//    })
//};
//
//$(document).ready(function(){
//    $(document).on('click', '#options li', function(e){
//        var option = $(this).attr('id');
//        console.log(option);
//        $().removeClass('active');
//        $(this).addClass('active');
//    })
//});

function formatDate(start, end) {
  start_date = new Date(start);
  end_date = new Date(end);

  day = start_date.getDate();
  month = start_date.getMonth() + 1;
  year = start_date.getFullYear();

  start_hour = start_date.getHours();
  start_mins = start_date.getMinutes();

  end_hour = end_date.getHours();
  end_mins = end_date.getMinutes();

  date = day + "/" + month + "/" + year + " ";
  date +=  ("0"+start_hour).slice(-2) + ":" + ("0"+start_mins).slice(-2) + " - " +
           ('0' + end_hour).slice(-2) + ":" +  ( "0" + end_mins).slice(-2);
  return date;
}


function getTomorrowsSchedule(genre) {
  $.ajax({
    url: 'https://api.foursquare.com/v2/venues/explore?client_id=YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ&client_secret=EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY&v=20140806&guery=pizza&radius=1000&near=King%27s%20Cross%2C%20London%2C%20Greater%20London&nearGeoId=4006723',
    dataType: 'json',
    beforeSend: function () {
      $("#programmes").empty();
      $("#programmes").append("<div class='spinner'><img src='spinner.gif' /></div>");
    }
  }).done(function(data) {
    $(".spinner").remove();
    //if (data.broadcasts.length > 0) {
    //  $.each(data.broadcasts, function(index, episode) {
    //    console.log(episode, episode.programme.display_titles.title);
    //    $("#programmes").append(processEpisode(episode));
    //  })
    //} else {
    //  $("#programmes").append("<div class='no-programmes'>No programmes under " + genre + "</div>");
    //}
    console.log(data);
    if (data.response.groups.length > 0) {
      $.each(data.response.groups[0].items, function(index, item) {
        console.log(item, item.venue.name);
        $("#programmes").append(processEpisode(item));
      })
    } else {
      $("#programmes").append("<div class='no-programmes'>No programmes under " + genre + "</div>");
    }
  }).fail(function() {
    console.log("something went wrong");
  });
}

function getUpcomingEpisodes(pid) {
  $.ajax({
    url: "http://www.bbc.co.uk/programmes/" + pid + "/episodes/upcoming.json",
    beforeSend: function() {
      $("#programmes").empty();
      $("#programmes").append("<div class='spinner'><img src='spinner.gif' /></div>");
    }
  }).done(function(data) {
    $(".spinner").remove();

    $.each(data.broadcasts, function(index, episode) {
      $("#programmes").append(processEpisode(episode));
    })
  }).fail(function() {
    console.log("something went wrong");
  });
}

function processEpisode(item) {
  item_html = "<li><h2>" + item.venue.name + "</h2>";
  if (item.venue.url) {
    item_html += "<h3>" + item.venue.url + "</h3>";
  }

  //
  //if (episode.programme.image) {
  //  item_html += "<img src=http://ichef.bbci.co.uk/images/ic/272x153/"+ episode.programme.image.pid +".jpg />";
  //} else {
  //  item_html += "<img src='http://placehold.it/272x153' />";
  //}
  //
  if (item.venue.hours && item.venue.hours.status) {
    item_html += "<p>" + item.venue.hours.status + "</p>";
  }

  if (item.venue.rating) {
    item_html += "<p>Rated: <strong>" + item.venue.rating + "</strong></p>";
  }

  if (item.venue.price && item.venue.price.message) {
    item_html += "<p>Price: <strong>" + item.venue.price.message + "</strong></p>";
  }

  if (item.venue.menu && item.venue.menu.url) {
    item_html += "<a class='view-more' href='"+ item.venue.menu.url+"'> Menu</a>";
  }

  //item_html += "<span class='service'>" + episode.service.title + "</span></li>";

  return item_html;
}


$(document).ready(function(){
  $(document).on('click', '#genres li', function(e){
    genre = $(this).attr('id');
    $("#genres li").removeClass('active');
    $(this).addClass('active');

    getTomorrowsSchedule(genre);
  });

});
