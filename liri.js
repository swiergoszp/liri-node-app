//************************************************************************************/
// Global Varaiables
//************************************************************************************/

var fs = require("fs");
var request = require("request");
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArg = process.argv;
var liriFunction = nodeArg[2];

var searchItem = "";
// multi-word search
for (var i = 3; i < nodeArg.length; i++) {
    if (i > 3 && i < nodeArg.length) {
        searchItem = searchItem + "+" + nodeArg[i];
    }
        else {
            searchItem += nodeArg[i];
        };
};

//************************************************************************************/
// Display Functions
//************************************************************************************/

// saves a lot of typing, logs to console and log.txt
function showOutcome(results) {
    fs.appendFile("log.txt", results, function(error) {
        if (error) {
          throw error;
        };
    });
    console.log(results);
};

// shows instructions
function someHelp() {
    console.log(
        showOutcome("Try typing one of the following commands after 'node liri.js':"),
        showOutcome("1. my-tweets 'anybody' "),
        showOutcome("2. spotify-this-song 'any song' "),
        showOutcome("3. movie-this 'any movie' "),
        showOutcome("4. do-what-it-says"),
    );
}

//************************************************************************************/
// Spotify Function
//************************************************************************************/

function spotifySearch(song) {
    spotify.search({ type: "track", query: song }, function(error, data) {
        if(!error){
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    showOutcome("Artist: " + songInfo[i].artists[0].name);
                    showOutcome("Song: " + songInfo[i].name);
                    showOutcome("Album: " + songInfo[i].album.name);
                    showOutcome("Preview Url: " + songInfo[i].preview_url);
                };
            };
        }
            else if(!song){
                song = "DNA Kendrick Lamar";
            }	
                else {
                    showOutcome(error);
                    someHelp();
                };
    });
};

//************************************************************************************/
// OMDB Function
//************************************************************************************/

function omdbSearch(movie) {
    var omdbURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=660d0b8b";
    request(omdbURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            showOutcome("Title: " + body.Title + "");
            showOutcome("Release Year: " + body.Year);
            showOutcome("IMDB Rating: " + body.imdbRating);
            showOutcome("Rotten Tomatoes Rating: " + body.tomatoRating);
            showOutcome("Country of Origin: " + body.Country);
            showOutcome("Language: " + body.Language);
            showOutcome("Plot: " + body.Plot);
            showOutcome("Actors: " + body.Actors);
        } 
            else if(!movie){
                showOutcome("-----------------------");
                showOutcome("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                showOutcome("It's on Netflix!");
            }
                else {
                    showOutcome(error);
                    someHelp();
                };
    });
};

//************************************************************************************/
// Twitter Function
//************************************************************************************/

function twitterSearch(name) {
	var params = {q: "@" + name, count: 20};
	client.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.statuses.length; i++) {
                showOutcome("Tweet: " + tweets.statuses[i].text);
                showOutcome("Creation Date: " + tweets.statuses[i].created_at);
            };
        } 
            else {
                showOutcome(error);
                someHelp();
            };
	});
};

//************************************************************************************/
// For Fucks Sake At Least Do Something Function
//************************************************************************************/

function justDoSomething(){
    fs.readFile('random.txt', "utf8", function(error, data){
        if (error) {
            throw error;
        }
        var didIt = data.split(',');
        spotifySearch(didIt[1]);
    });
};

//************************************************************************************/
// Liri Request Handler
//************************************************************************************/

if (liriFunction === "spotify-this-song"){
    spotifySearch(searchItem);
}
    else if (liriFunction === "movie-this") {
        omdbSearch(searchItem);
    }
    else if (liriFunction === "my-tweets") {
        twitterSearch(searchItem);
    }
    else if (liriFunction === "do-what-it-says") {
        justDoSomething();
    }
        else {
           someHelp();
        };