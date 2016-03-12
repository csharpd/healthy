//
//var healthyChow = function () {
//    var foursquareClientId;
//    var distance;
//    var foursquareVersion;
//};
//
//
//healthyChow.addClientId = function (id) {
//    healthyChow.foursquareClientId = id;
//};
//
//healthyChow.addClientSecret = function (secret) {
//    healthyChow.foursquareSecret = secret;
//};
//
////healthyChow.addDistance = function (distance) {
////    healthyChow.distance = distance;
////};
//
//healthyChow.addFoursquareApiVersion = function (version) {
//    healthyChow.foursquareVersion = version;
//};
//
//healthyChow.client = function () {
//    return {id: healthyChow.foursquareClientId, secret: healthyChow.foursquareSecret};
//};
//
//// foursquare api
//
//healthyChow.foursquareCredentials = function (client) {
//    return 'client_id=' + client.id + '&client_secret=' + client.secret;
//};
//
//healthyChow.radiusAsString = function (distance) {
//    return '&radius=' + distance;
//};
//
//healthyChow.apiVersionAsString = function (apiVersion) {
//    return '&v=' + apiVersion;
//};
//
//function buildFoursquareApiUrl(option, client, distance, apiVersion) {
//    var baseUrl = 'https://api.foursquare.com/v2/venues/explore?';
//    return baseUrl + this.foursquareCredentials(client) +
//        this.apiVersionAsString(apiVersion) + '&guery=' + option;
//};

healthyChow.addClientId('YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ');
healthyChow.addClientSecret('EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY');
https://api.foursquare.com/v2/venues/explore?client_id=YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ&client_secret=EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY&v=20140806&guery=brunch&radius=1000&near=King%27s%20Cross%2C%20London%2C%20Greater%20London&nearGeoId=4006723

function getVenues(option) {
    $.ajax({
        url: 'https://api.foursquare.com/v2/venues/explore?client_id=YQ3TW4N1D2L5I4X2GR5W53AJNQJY5OD02IWWO5XD3LLDH0IJ&client_secret=EPVJCXN4CJO2CRU02WY5A3IUQ1T0SNHVIHV01JRYCQ4IKYLY&v=20140806&guery='+option+'&radius=1000&near=King%27s%20Cross%2C%20London%2C%20Greater%20London&nearGeoId=4006723',
        dataType: 'json',
        beforeSend: function () {
            $("#venues").empty();
            $("#venues").append("<div class='spinner'><img src='spinner.gif' /></div>");
        }
    }).done(function (data) {
        $(".spinner").remove();
        console.log(data);
    }).fail(function () {
        console.log("something went wrong");
    })
};

$(document).ready(function(){
    $(document).on('click', '#options li', function(e){
        var option = $(this).attr('id');
        console.log(option);
        $().removeClass('active');
        $(this).addClass('active');
    })
});

