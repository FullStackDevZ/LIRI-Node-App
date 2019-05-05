//not ready for this yet
require("dotenv").config();


var rtRating; // Rotten Tomatoes rating
var imdbRating;  // IMDB Rating

var fs = require("fs");

var request = require('request');
var Spotify = require('node-spotify-api');

//Gets Spotify keys
var spotify = new Spotify({
	id: '49ad40f213914b43904589ff719054e6',
	secret: 'dce860b38f1940fd9298b81f4c48307c'
});

var keys = require("./keys.js");
//Stores the user input
var input = process.argv;

//gets user command
var command = input[2];


//grabs movie or song names to put into request
var name = "";
for (i = 3; i < input.length; i++) {
	name = name + " " + input[i];
}



function spotify() {
	name = name.trim().replace(" ", "+");
	// var client = new Spotify(keys);
	if (command === "spotify-this-song") {
		if (name === "") {
			name = "The Sign"
		}
		//same song info as above but looking at info for "The Sign" by Ace of Base.
		keys.search({ type: 'track', query: name, limit: 6 }, function (err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}

			var track = data.tracks.items[5];
			var song =
				"-----------------------------------------------------------------------" + "\r\n" +
				"Song: " + name + "\r\n" +
				"Artist: " + track.artists[0].name + "\r\n" +
				"Album: " + track.album.name + "\r\n" +
				"Link to Preview: " + track.preview_url + "\r\n" +
				"-----------------------------------------------------------------------" + "\r\n"
			console.log(song);
			writeToLog(song);
		})

	}
}


function movie() {
	if (command === "movie-this") {
		//If a movie is not entered "Mr. Nobody" is displayed
		if (name === "") {
			name = "Mr. Nobody";
		}

		// Accesses OMDB API
		var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";

		request.get(queryUrl, function (error, response, body) {

			if (!error && response.statusCode === 200) {

				for (i = 0; i < JSON.parse(body).Ratings.length; i++) {
					if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
						rtRating = JSON.parse(body).Ratings[i].Value;

					}
					if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
						imdbRating = JSON.parse(body).Ratings[i].Value;
					}
				}

				var movie =
					"=========================================================================" + "\r\n" +
					"Film Title: " + JSON.parse(body).Title + "\r\n" +
					"Year of Release: " + JSON.parse(body).Year + "\r\n" +
					"Rating: " + JSON.parse(body).Rated + "\r\n" +
					"Rating - Rotten Tomatoes : " + rtRating + "\r\n" +
					"IMDB Rating: " + imdbRating + "\r\n" +
					"Country: " + JSON.parse(body).Country + "\r\n" +
					"Language: " + JSON.parse(body).Language + "\r\n" +
					"Plot Summary: " + JSON.parse(body).Plot + "\r\n" +
					"=========================================================================" + "\r\n"
				console.log(movie);
				writeToLog(movie);

			}
		});

	}
}
movie();

function doWhat() {
	if (command === "do-what-it-says") {
		// Appends to random.txt
		fs.readFile("random.txt", "utf8", function (error, data) {

			if (error) {
				return console.log(error);
			}

			var nameArr = data.split(",");

			name = nameArr[1]

			spotify.search({ type: 'track', query: name, limit: 1 }, function (err, data) {
				if (err) {
					return console.log('Error occurred: ' + err);
				}

				var track = data.tracks.items[0];
				var randomSong =
					"-----------------------------------------------------------------------" + "\r\n" +
					"Song: " + name + "\r\n" +
					"Artist: " + track.artists[0].name + "\r\n" +
					"Album: " + track.album.name + "\r\n" +
					"Click to Preview: " + track.preview_url + "\r\n" +
					"-----------------------------------------------------------------------" + "\r\n"
				console.log(randomSong);
				writeToLog(randomSong);
			})

		});
	}
}
doWhat();

// Appends to log.txt
function writeToLog(printInfo) {
	fs.appendFile("log.txt", printInfo, function (err) {

		// Errors are sent to log.txt
		if (err) {
			return console.log(err);
		}

	});

}