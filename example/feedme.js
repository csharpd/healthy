"use strict";

(function() {
  var root = this;
  var previousFeedme = root.feedme;

  var feedme = function() {
    var currentLocation;
    var foursquareClientId;
    var distance;
    var foursquareVersion;
  }

  // This is a precaution in case there is another
  // library/function called feedme.
  // If that were the case the old one would take precedence
  // if we call noConflict().
  feedme.noConflict = function() {
    root.feedme = previousFeedme;
    return feedme;
  }

  //This makes this libarary node.js and browser compatible.

  if(typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = feedme;
    }
    exports.feedme = feedme;
  } else {
    root.feedme = feedme;
  }

  // FEED ME - finally!
  //
  // Configuration
  feedme.addClientId = function(id) {
    feedme.foursquareClientId = id;
  };

  feedme.addClientSecret = function(secret) {
    feedme.foursquareSecret = secret;
  };

  feedme.addDistance = function(distance) {
    feedme.distance = distance;
  };

  feedme.addFoursquareApiVersion = function(version) {
    feedme.foursquareVersion = version;
  };

  feedme.client = function() {
    return {id: feedme.foursquareClientId, secret: feedme.foursquareSecret};
  };

  // Geolocating the people on the site
  feedme.locate = function(navigator, callback) {
    navigator.geolocation.getCurrentPosition(callback);
  };

  feedme.setCurrentLocation = function(navigator) {
    this.locate(navigator, function(position) {
      feedme.currentLocation = position.coords;
    });
  };

  // --------------------- Foursquare API ------------------------------

  feedme.locationAsString = function(currentLocation) {
    return '&ll='+ currentLocation.latitude +
           ',' + currentLocation.longitude;
  };

  feedme.foursquareCredentials = function(client) {
    return 'client_id=' + client.id + '&client_secret=' + client.secret;
  };

  feedme.radiusAsString = function(distance) {
    return '&radius=' + distance;
  };

  feedme.apiVersionAsString = function(apiVersion) {
    return '&v=' + apiVersion;
  };

  feedme.buildFoursquareApiUrl = function(category, currentLocation, client,
      distance, apiVersion) {
    var baseUrl = 'https://api.foursquare.com/v2/venues/explore?';
    return baseUrl + this.foursquareCredentials(client) +
      this.apiVersionAsString(apiVersion) +
      this.locationAsString(currentLocation) +
      this.radiusAsString(distance) + '&query=' + category;
  }

  feedme.venuesInFoursquare = function(category, callback) {
    var url = feedme.buildFoursquareApiUrl(category, feedme.currentLocation,
        feedme.client(), feedme.distance, feedme.foursquareVersion);
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        callback(data.response.groups[0].items, callback);
      } else { }
    };
    request.onerror = function() {
      console.log('Ops! There seems to be a problem with Foursquare');
    };
    request.send();
  }

  // Utilities
  feedme.compare = function(a,b) {
    if(a.name < b.name) {
      return -1;
    } else if(a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }
}).call(this);
