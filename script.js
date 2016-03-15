
var templateString = document.querySelector('.template').textContent;

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
  document.querySelector('.chow__content').innerHTML = template(state);
  bindEvents();
}

function bindEvents() {
  var options = document.querySelectorAll('.chow__options li');

  _.each(options, function(option, idx) {

    option.addEventListener('click', function(event) {
      var searchTerm = this.getAttribute('data-option-name');

      var activeOption = _.find(state.options, function (option) {
        return option.searchTerm === searchTerm;
      });

      console.log(this);
      this.classList.add('active');

      setState({activeOption: activeOption});
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

  }).catch(function() {
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

  setState({
    location: location,
    hasLocation: true
  });

  console.log(state);

});




