require("dotenv").config();

var keys = ('./keys.js');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
