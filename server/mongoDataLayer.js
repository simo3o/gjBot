const fetch = require('node-fetch')
const config = require('./config.js')

const userDbUrl = config.userDbUrl;
const workoutsDbUrl = config.workoutsDbUrl;

var exports = module.exports = {};

let FetchFind = function (url, parameters) {
    return fetch(url + '/_find', {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(parameters),
    }).then(function (response) {
        return (response.json());
    })
        .then(function (json) {
            return (json.docs)
        })
        .catch(function (err) {
            throw new Error("Error fetching: ");
        })
}

exports.getQuery = function (selector) {

}

exports.getUser = function (user) {

}

exports.getWorkout = function (trackName, workoutNumber) {

}

exports.getCurrentWorkout = function (startDate) {
 
}

exports.getTrack = function (trackName) {
}

exports.createUser = function (userInfo) {
}