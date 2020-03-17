var express = require('express');
var app = express();
const path = require('path');
const fs = require('fs');
const bodyparser = require('body-parser');
const config = require('./config.js');

if(config.dbType == 'COACHDB'){
const dataLayer = require('./dataLayer.js');
}else if (config.dbType == 'MONGODB'){
    const dataLayer = require('./mongoDataLayer.js');
}




app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/users/:Name', function (req, res) {
    let userName = req.params.Name;
    dataLayer.getUser(userName).then(function (jsonData) {
        // res.json(jsonData)
        if (jsonData.length < 1) {
            res.send('User not found');
        } else {
            var Active_tracks = jsonData[0].Active_tracks[0];
            let activeTracks = Object.keys(Active_tracks);
            activeTracks.map(function (track) {
                let startTrackDate = Active_tracks[track];
                let workoutNumber = dataLayer.getCurrentWorkout(startTrackDate);
                dataLayer.getWorkout(track, workoutNumber).then(function (jsonResponse) {
                    res.json(jsonResponse);
                })
            })
        }
    }
    )
})

app.get('/currentWorkout/:Name/:trackName', function (req, res) {
    let userName = req.params.Name;
    let track = req.params.trackName.split('_').join(' ');

    dataLayer.getUser(userName).then(function (jsonData) {
        var Active_tracks = jsonData[0].Active_tracks[0];
        let startTrackDate = Active_tracks[track];
        let workoutNumber = dataLayer.getCurrentWorkout(startTrackDate);
        dataLayer.getWorkout(track, workoutNumber).then(function (jsonResponse) {
            res.json(jsonResponse);
        })
    })
})

app.get('/activeTracks/:Name', function (req, res) {
    let userName = req.params.Name;
    dataLayer.getUser(userName).then(function (jsonData) {
        // res.json(jsonData)
        var Active_tracks = jsonData[0].Active_tracks[0];
        let activeTracks = Object.keys(Active_tracks);
        res.json(activeTracks);
    })
})

app.get('/allTrack/:trackName', function (req, res) {
    let track = req.params.trackName.split('_').join(' ');
    dataLayer.getTrack(track).then(function (jsonResponse) {
        res.json(jsonResponse);
    })
})

app.post('/createUser', function (req, res) {
    let userObject = {
        "User_name": req.body.Name,
        "User_type": req.body.Type,
        "Active_tracks": req.body.Track
    }
    // try {
    dataLayer.createUser(userObject).then(function (jsonResponse) {
        res.json(jsonResponse);
    })
    // }
    // catch{
    //     throw new Error("Error creating user")
    // }
})
app.listen(3000);