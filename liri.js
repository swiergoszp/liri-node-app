var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);
var request = require('request');