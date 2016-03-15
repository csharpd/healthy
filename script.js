
var templateString = document.querySelector('.template').textContent;

var template = _.template(templateString);

var initialState = {

  hasLocation: false,
  location: '',

  activeOption: null,

  options: [
    { active: false, searchTerm: 'healthy', name: 'Healthy'},
    { active: false, searchTerm: 'vegan', name: 'Vegan'},
    { active: false, searchTerm: 'vegetarian', name: 'Vegetarian'},
    { active: false, searchTerm: 'paleo', name: 'Paleo'},
    { active: false, searchTerm: 'gluten free', name: 'Gluten Free'},
    { active: false, searchTerm: 'salad', name: 'Salad'},
    { active: false, searchTerm: 'coffee', name: 'Coffee'},
    { active: false, searchTerm: 'juice', name: 'Juice'},
    { active: false, searchTerm: 'cocktails', name: 'Liquor'},
    { active: false, searchTerm: 'bone broth', name: 'Bone Broth'},
    { active: false, searchTerm: 'indian', name: 'Indian'}
  ],

  loading: false,

  venues: []
};

var state = _.clone(initialState);

function setState(newState) {
  _.extend(state, newState);
  render();
}

function render() {
  document.querySelector('.chow__content').innerHTML = template(state);
  bindEvents();
  onAfterRender();
}

function onAfterRender() {

  var maps = document.querySelectorAll('.chow__map');

  _.each(maps, function(map) {

      var lat = parseFloat(map.getAttribute('data-lat'), 10);
      var lng = parseFloat(map.getAttribute('data-lng'), 10);

      var pos = {lat: lat, lng: lng};

      var mapInstance = new google.maps.Map(map, {
        center: pos,
        zoom: 16
      });

      var marker = new google.maps.Marker({
        position: pos,
        map: mapInstance,
        title: 'Hello World!'
      });
  });

}

function bindEvents() {
  var options = document.querySelectorAll('.chow__options li');

  _.each(options, function(option, idx) {

    option.addEventListener('click', function(event) {
      var searchTerm = this.getAttribute('data-option-name');
      var activeOption;

      var options = _.map(state.options, function(opt) {

        var option = _.clone(opt);

        if (option.searchTerm === searchTerm) {
          option.active = true;
          activeOption = option;
        }
        else {
          option.active = false;
        }
        return option;

      });

      setState({activeOption: activeOption, options: options});
      getVenues();
    });

  });
}


function getVenues() {

  if (!state.hasLocation) {
    console.error('this should never happen');
    return;
  }

  var formatedLocation = encodeURIComponent(state.location);

  var url = "https://api.foursquare.com/v2/venues/explore?client_id=YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ&client_secret=EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY&v=20140806&query="+state.activeOption.searchTerm+"&radius=1000&near="+formatedLocation+"%2C%20London%2C%20Greater%20London";

  setState({
    loading: true,
    venues: []
  });

  fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {

        var responseVenues = data.response.groups[0].items;
        var venues = [];

        if (responseVenues && responseVenues.length > 0) {

          _.each(responseVenues, function (responseVenue) {

            if (!responseVenue.venue.price || !responseVenue.venue.rating) {
              return;
            }

            var venue = {
                name: responseVenue.venue.name,
                url: responseVenue.venue.url || '',
                rating: responseVenue.venue.rating || ''
            };


            if (responseVenue.venue.price && responseVenue.venue.price.message) {
              venue.priceBracket = responseVenue.venue.price.message;
            }

            if (responseVenue.venue.hours && responseVenue.venue.hours.status) {
              venue.openStatus = responseVenue.venue.hours.status;
            }

            if (responseVenue.venue.menu && responseVenue.venue.menu.url) {
              venue.menu = responseVenue.venue.menu.url;
            }

            // TODO Check shit.
            venue.lat = responseVenue.venue.location.lat;
            venue.lng = responseVenue.venue.location.lng;
            venues.push(venue);

          });
        }

        var sortedVenues = venues.sort(function(a, b) {
          return b.rating - a.rating;
        });

        setState({
          loading: false,
          venues: sortedVenues
        });

  }).catch(function(error) {
    console.log(error);
    console.log("something went wrong");
  });
}

document.querySelector('.chow__clear-button').addEventListener('click', function(e) {
  setState(initialState);
});


document.querySelector('.chow__search').addEventListener('submit', function(event) {
  event.preventDefault();
  var location = this.querySelector('.chow__search-input').value;
  console.log(location);

  if (!location.length) {
    return;
  }

  setState(initialState);

  setState({
    location: location,
    hasLocation: true
  });

  console.log(state);

});




