// Handlebars...
//
// templates
var categories_source = $('#categories').html();
var profile_source = $('#profile_template').html();

Handlebars.registerHelper('stars', function(rating) {
  half = parseFloat(rating) / 2;
  star_rating = parseInt(half);
  halfStar = parseFloat(half) - star_rating > 0;
  stars =  _.times(star_rating, function(n) {
      return '<i class="fa fa-star"></i>';
  }).toString().replace(/,/g,'');
  if(halfStar == true) {
    stars += '<i class="fa fa-star-half"></i>';
  }
  return stars + ' (average rating: ' + rating + ')';
});

// price translation: £ / ££ / ££
Handlebars.registerHelper('price', function(price) {
  pricing = { Cheap: 1, Moderate: 2, Expensive: 3, 'Very Expensive': 4 }
  return _.times(pricing[price], function(n) {
    return '<i class="fa fa-gbp"></i>';
  }).toString().replace(/,/g,'') + ' (' + price + ')';
});

var categories = [
  {name: 'Noodles', query: 'noodles'},
  {name: 'Sushi', query: 'sushi'},
  {name: 'Indian', query: 'indian'},
  {name: 'Burgers', query: 'burger'},
  {name: 'Beer', query: 'beer'},
  {name: 'Doughnuts', query: 'doughnuts'},
  {name: 'Ice Cream', query: 'ice+cream'},
  {name: 'Cocktails', query: 'cocktails'},
  {name: 'Vegetarian', query: 'vegetarian'},
  {name: 'Gluten Free', query: 'gluten+free'},
  {name: 'Vegan', query: 'vegan'},
  {name: 'Cake', query: 'cake'},
  {name: 'Coffee', query: 'coffee'},
  {name: 'Brunch', query: 'brunch'},
  {name: 'Pizza', query: 'pizza'}
];

// Setup feedme
feedme.addClientId('J0IWD3NBN2YKHAI5U1GA1S1PJ5WPZYTPX5DSYKOLLC5QCSWO');
feedme.addClientSecret('UFJUDAPQZUX5LDPMDHGK3XOPB4QDH5HPA13J1WTP1QPWA0SB');
feedme.addDistance(1000);
feedme.addFoursquareApiVersion(20130815);

function highlightCategory() {
  $('#navigation li').removeClass('active');
  $('#'+selectedCategory()).addClass('active');
}

function selectedCategory() {
  return $(event.target).data('query');
}

function renderCategories(categories) {
  var template = Handlebars.compile(categories_source);
  $('section aside nav ul').html(template({ categories: categories }));
}

function clearResults() {
  $('#results').html('');
}

function addToList(element) {
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

function changeBackground() {
  name = cleanImageName($(event.target).data('query'));
  $('html').css('background-image',"url('/images/" + name + ".jpg')");
}

feedme.setCurrentLocation(navigator);

renderCategories(categories.sort(feedme.compare));

$('.button').on('click',function() {
  clearResults();
  changeBackground();
  highlightCategory();
  feedme.venuesInFoursquare(selectedCategory(), function(venues) {
    _.chain(venues)
      .each(addToList)
  });
});

$('#map_button').on('click',function(){
  $('#results').css('display','none');
  $('#map').css('left','0px');
});

$('#list_button').on('click',function(){
  $('#results').css('display','block');
  $('#map').css('left','-10000px');
});
