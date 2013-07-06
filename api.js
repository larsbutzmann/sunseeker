var WeatherModel = require('./model/weather.js');

exports.getWeather = function(request, response) {
    return WeatherModel.find(function(err, data) {
        if (!err) {
            return response.send(data);
        } else {
            return console.log(err);
        }
    });
};

exports.postWeather = function(request, response) {
    console.log(request.body);
    var weather = new WeatherModel({
        latitude: request.body.latitude,
        longitude: request.body.longitude,
        type: request.body.type
    });
    weather.save(function(err) {
        if(!err) {
            return console.log('created');
        } else {
            return console.log(err);
        }
    });
    return response.send(weather);
};