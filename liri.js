//not ready for this yet
require("dotenv").config();


var rtRating; // Rotten Tomatoes rating
var imdbRating;  // IMDB Rating

var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');

//Gets Spotify keys
var spotify = new Spotify(keys.spotify);

//Stores the user input
var input = process.argv;

//gets user command
var command = input[2];


//grabs movie or song names to put into request
var name = "";
for (i = 3; i < input.length; i++) {
	name = name + " " + input[i];
}

name = name.trim().replace(" ", "+");

if (command === "spotify-this-song") {
	if (name === "") {
  		name = "The Sign"
  	}
	//same song info as above but looking at info for "The Sign" by Ace of Base.
	spotify.search({ type: 'track', query: name, limit: 6 }, function(err, data) {
 	if (err) {
    	return console.log('Error occurred: ' + err);
  	}
  	
  	// console.log(JSON.stringify(data, null, 2));
  	// console.log(data);
  	var track = data.tracks.items[5];
    var mySong =
		"-----------------------------------------------------------------------" + "\r\n" +
		"Song Title: " + name + "\r\n" +
		"Artist: " + track.artists[0].name + "\r\n" +
		"Album: " + track.album.name + "\r\n" + 
		"Preview Link: " + track.preview_url + "\r\n" +
		"-----------------------------------------------------------------------" + "\r\n"
		console.log(mySong);
		writeToLog(mySong);
	})

}

else if (command === "movie-this") {
 	//If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
 	if (name === "") {
 		name = "Mr. Nobody";
 	}

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy";

	// This line is just to help us debug against the actual URL.
	// console.log(queryUrl);

	request.get(queryUrl, function(error, response, body) {
		
    	// console.log(response);
	  	if (!error && response.statusCode === 200) {
	  		//var body = JSON.parse(body);
	  		for (i = 0; i < JSON.parse(body).Ratings.length; i++) {
	  			if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	  				rtRating = JSON.parse(body).Ratings[i].Value;

				}
	  			if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
					imdbRating = JSON.parse(body).Ratings[i].Value;
	  				// console.log(internetRating);
	  			}
	  		}

			  var myMovie =
  			"-----------------------------------------------------------------------" + "\r\n" +
    		"Film Title: " + JSON.parse(body).Title + "\r\n" +
    		"Year of Release: " + JSON.parse(body).Year + "\r\n" +
    		"Rating: " + JSON.parse(body).Rated + "\r\n" + 
    		"Rating - Rotten Tomatoes : " + rtRating + "\r\n" +
    		"IMDB Rating: " + imdbRating + "\r\n" +
    		"Country: " + JSON.parse(body).Country + "\r\n" + 
    		"Language: " + JSON.parse(body).Language + "\r\n" + 
    		"Plot Summary: " + JSON.parse(body).Plot + "\r\n" +
    		 "-----------------------------------------------------------------------" + "\r\n"
    		console.log(myMovie);
    		writeToLog(myMovie);

  		}
	});

}

if (command === "do-what-it-says") {
	// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
	// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
	// Feel free to change the text in that document to test out the feature for other commands.
	fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
		if (error) {
			return console.log(error);
		}
		// console.log(data);
		// Then split it by commas (to make it more readable)
		var nameArr = data.split(",");
		// // We will then re-display the content as an array for later use.
		// console.log(nameArr);

		name = nameArr[1]
		// console.log(name);

		spotify.search({ type: 'track', query: name, limit: 1 }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			
			// console.log(JSON.stringify(data, null, 2));
			// console.log(data);
			var track = data.tracks.items[0];
			var randomSong =
				"-----------------------------------------------------------------------" + "\r\n" +
				"Song Title: " + name + "\r\n" +
				"Artist: " + track.artists[0].name + "\r\n" +
				"Album: " + track.album.name + "\r\n" + 
				"Preview Link: " + track.preview_url + "\r\n" +
				"-----------------------------------------------------------------------" + "\r\n"
			console.log(randomSong);
			writeToLog(randomSong);
		})

	});
}


// BONUS
// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file. 
// Do not overwrite your file each time you run a command.

function writeToLog(printInfo) {
	fs.appendFile("log.txt", printInfo, function(err) {

		// If the code experiences any errors it will log the error to the console.
		if (err) {
			return console.log(err);
		}

	});

}