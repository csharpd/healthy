
var templateString = $('.template').text();

var template = _.template(templateString);

var initialState = {

  hasLocation: false,
  location: '',

  activeOption: null,

  options: [
    { searchTerm: 'healthy', name: 'Healthy'},
    { searchTerm: 'vegan', name: 'Vegan'},
    { searchTerm: 'vegetarian', name: 'Vegetarian'},
    { searchTerm: 'paleo', name: 'Paleo'},
    { searchTerm: 'gluten free', name: 'Gluten Free'},
    { searchTerm: 'salad', name: 'Salad'},
    { searchTerm: 'coffee', name: 'Coffee'},
    { searchTerm: 'juice', name: 'Juice'},
    { searchTerm: 'cocktails', name: 'Liquor'},
    { searchTerm: 'bone broth', name: 'Bone Broth'},
    { searchTerm: 'indian', name: 'Indian'}
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
  $('.chow__content').html(template(state));
}

function getVenues() {

  if (!state.hasLocation) {
    console.error('this should never happen');
    return;
  }

  var formatedLocation = encodeURIComponent(state.location);

  setState({
    loading: true,
    venues: []
  });

  $.ajax({
    url: "https://api.foursquare.com/v2/venues/explore?client_id=YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ&client_secret=EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY&v=20140806&query="+state.activeOption.searchTerm+"&radius=1000&near="+formatedLocation+"%2C%20London%2C%20Greater%20London",
    dataType: 'json'
  }).done(function(data) {

    var responseVenues = data.response.groups[0].items;
    var venues = [];

    if (responseVenues && responseVenues.length > 0) {

      _.each(responseVenues, function (responseVenue) {

        if (!responseVenue.venue.price || !responseVenue.venue.rating) {
          return;
        }

        var priceBracket = '';
        if (responseVenue.venue.price && responseVenue.venue.price.message) {
          priceBracket = responseVenue.venue.price.message;
        }

        var openStatus = '';
        if (responseVenue.venue.hours && responseVenue.venue.hours.status) {
          openStatus = responseVenue.venue.hours.status;
        }

        var menu = '';
        if (responseVenue.venue.menu && responseVenue.venue.menu.url) {
          menu = responseVenue.venue.menu.url;
        }

        venues.push({
            name: responseVenue.venue.name,
            url: responseVenue.venue.url,
            rating: responseVenue.venue.rating,
            priceBracket: priceBracket,
            openStatus: openStatus,
            menu: menu
        });

      });
    }

    var sortedVenues = venues.sort(function(a, b) {
      return b.rating - a.rating;
    });

    setState({
      loading: false,
      venues: sortedVenues
    });

  }).fail(function() {
    console.log("something went wrong");
  });
}


$(document).on('submit', '.chow__search', function (event) {
  event.preventDefault();
  var location = $(this).find('.chow__search-input').val();
  console.log(location);

  setState({
    location: location,
    hasLocation: true
  });

  console.log(state);
});


$(document).on('click', '.chow__options li', function(e) {
  var searchTerm = $(this).data('option-name');

  var activeOption = _.find(state.options, function(option) {
    return option.searchTerm === searchTerm;
  });

  setState({ activeOption: activeOption });
  getVenues();
});


$(document).on('click', '.chow__clear-button', function(e) {
  setState(initialState);
});




