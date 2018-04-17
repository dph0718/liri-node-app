require("dotenv").config();
const fs = require('fs');
const inquirer = require('inquirer');
const request = require('request');
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const client = new Twitter(keys.twitter);
const spotify = new Spotify(keys.spotify);
let path;
let mode;

let command = process.argv[2];
let value = process.argv[3];
function stripe() {
    console.log("===================");
}
function menuExit() {
    if (mode == 'menu') {
        firstMenu();
    } else {
        process.exit();
    }
}

//flavors this assignment with barbecue sauce.
function gotRdun() {
    console.log(`\nGot 'R Dun!`);
}

function firstThing() {
    inquirer.prompt({
        name: 'doFirst',
        message: 'You wanna type commands for me or choose from a list?',
        type: 'list',
        choices: ["I need a menu", "YOU LISTEN TO MY WORDS, LIRI."],
    })
        .then(function (resp) {
            if (resp.doFirst == "YOU LISTEN TO MY WORDS, LIRI.") {
                console.log("Well you think you just know everything, doncha?");
            } else {
                firstMenu();
            }
        })
}


function firstMenu() {
    if (mode == 'menu') {
        path = undefined;
        value = undefined;
        inquirer.prompt({
            name: 'menu1',
            type: 'list',
            message: "What you wanna do?",
            choices: ["find a song", "git a movie", "git my tweets", "git r' dun", "nothin"]
        })
            .then(function (resp) {
                if (resp.menu1 == "nothin") {
                    console.log("K. Go do that somewhere else.");
                    setTimeout(function () { process.exit() }, 1000);
                } else if (resp.menu1 == "git r' dun") {
                    path = 'txt';
                    doRandomTxt();
                } else if (resp.menu1 == "git my tweets") {
                    twit();
                } else {
                    if (resp.menu1 == "find a song") {
                        path = 'song';
                    }
                    if (resp.menu1 == "git a movie") {
                        path = 'movie';
                    }

                    secondMenu();
                }
            })
    } else {
        process.exit();
    }
}

function secondMenu() {
    inquirer.prompt({
        name: 'menu2',
        type: 'input',
        message: "What you lookin' for?",
    })
        .then(function (resp) {
            console.log("Gittin R' dun...")
            if (path == 'movie') {
                value = resp.menu2;
                movie();
            }
            if (path == 'song') {
                value = resp.menu2;
                spotTune();
            }
        })
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
        menuExit();
    });
}

//takes the value and gets spotify info for that song.
function spotTune() {
    let song;
    if (value) {
        song = value;
    } else {
        song = `tonight i'm gonna rock you tonight`;
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
            firstMenu();
        }, function (err) {
            console.log("This went terribly wrong: ", err);
            firstMenu();
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
        if (resp.Ratings[0]) {
            console.log("IMDB Rating: " + resp.Ratings[0].Value);
        } else console.log('');
        if (resp.Ratings[1]) {
            console.log("Rotten Tomatoes Rating: " + resp.Ratings[1].Value);
        } else console.log('');
        console.log("Plot: " + resp.Plot);
        stripe();
        gotRdun();
        firstMenu();
    })
}

//reads random.txt and parses it into a readable command and value
//then puts those values into the textInterpret function.
function doRandomTxt() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) throw err;
        let content = (data.split(','));
        let doIt = content[0];
        let val = content[1];
        command = doIt;
        value = val;
        textInterpret();
    })
}

//determines what the command is and passes it to the correct function.
function textInterpret() {
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

if (command) {
    mode = "talk";
    textInterpret();
} else {
    mode = "menu";
    firstThing();
}