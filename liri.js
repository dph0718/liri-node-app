require("dotenv").config();
const fs = require('fs');
const request = require('request');
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const client = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);

let command = process.argv[2];
let value = process.argv[3];
function stripe() {
    console.log("===================");
}

//flavors this assignment with barbecue sauce.
function gotRdun() {
    console.log(`\nGot 'R Dun!`);
}


//gets the last 10 twits from, i assume, whoever's consumer key & secret are supplied.
function twit() {
    let parameters = {
        count: 10,
    };
    client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
        if (error) throw error;
        for (let i = 0; i < tweets.length; i++) {
            stripe();
            console.log(`\nTweet #${tweets.length - i}:` + tweets[i].text);
            console.log(`Posted: `, tweets[i].created_at);  // Raw response object. 
        }
        gotRdun();
    });
}

//takes the value and gets spotify info for that song.
function spotTune() {
    let song;
    if (value) {
        song = value;
    } else {
        song = `You Should Consider`;
    };
    stripe();
    spotify.search({ type: 'track', limit: 1, query: song })
        .then(function (data) {
            stripe();
            console.log(`Track:`, data.tracks.items[0].name);
            console.log(`From the album:`, data.tracks.items[0].album.name);
            console.log("By:", data.tracks.items[0].artists[0].name);
            // console.log(data.tracks.items[0]);            //album name
            console.log("Preview Link:", data.tracks.items[0].album.external_urls.spotify);
            stripe();
            gotRdun();
        }, function (err) {
            console.log("This went terribly wrong: ", err);
        })
}

//takes the input value and gets info from OMDB
function movie() {
    let movie;
    if (value) {
        movie = value;
    } else {
        movie = "Frank"
    }
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + movie, function (error, response, body) {
        if (error) {
            console.log(error)
        }
        stripe();
        let resp = JSON.parse(response.body);
        // console.log(resp);
        console.log("Title: " + resp.Title);
        console.log("Year: " + resp.Year);
        console.log("Actors: " + resp.Actors);
        console.log("Country: " + resp.Country);
        console.log("Language: " + resp.Language)
        console.log("IMDB Rating: " + resp.Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + resp.Ratings[1].Value);
        console.log("Plot: " + resp.Plot);
        stripe();
        gotRdun();
    })
}

//reads random.txt and parses it into a readable command and value
//then puts those values into the ultimatelyDo function.
function doRandomTxt() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) throw err;
        let content = (data.split(','));
        let doIt = content[0];
        let val = content[1];
        command = doIt;
        value = val;
        ultimatelyDo();
    })

}

//determines what the command is and passes it to the correct function.
function ultimatelyDo() {
    if (command === "my-tweets") {
        twit();
    }
    if (command === "spotify") {
        spotTune();
    }
    if (command === "movie-this") {
        movie();
    }
    if (command === "do-it") {
        doRandomTxt();
    }
    console.log("Gittin 'R Dun...")
}

//ultimately does
ultimatelyDo();