const fetch = require('node-fetch')
const config = require('./config.js')

const userDbUrl = config.userDbUrl
const workoutsDbUrl = config.workoutsDbUrl

var exports = module.exports = {}

let FetchFind = function (url, parameters) {
    return fetch(url + '/_find', {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(parameters),
    }).then(function (response) {
        return (response.json())
    })
        .then(function (json) {
            return (json.docs)
        })
        .catch(function (err) {
            throw new Error("Error fetching: ");
        })
}

let fetchAvailableTracks = function () {
    return fetch(workoutsDbUrl + '/_design/byField/_view/Type').then(function (response) {
        let a = response.json()
        return a
    }).then(function (json) {
        return json.rows[0].value
    }).catch(function (err) {
        throw new Error("Error fetching tracks ");
    })
}
exports.getQuery = function (selector) {
    return {
        "selector": selector,
        // "fields": ["Active_tracks", "Workout_type", "Workout_order", "Workout_description", "Workout_extra"],
        "limit": 1,
        "skip": 0,
        "execution_stats": true
    }
}

exports.getUser = function (user) {
    let bodyQuery = exports.getQuery({ "User_name": user })
    try {
        return FetchFind(userDbUrl, bodyQuery)
    } catch {
        throw new Error("Error Getting user: ")
    }
}

exports.getWorkout = function (trackName, workoutNumber) {
    let bodyQuery = exports.getQuery({
        "Track": trackName,
        "Workout_order": workoutNumber
    })
    try {
        return FetchFind(workoutsDbUrl, bodyQuery)
    } catch {
        throw new Error('Error getting workout')
    }
}

exports.getCurrentWorkout = function (startDate) {
    let currentDate = new Date()
    let firstDate = new Date(startDate)
    let timeDiff = Math.abs(currentDate.getTime() - firstDate.getTime())
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return diffDays
}

exports.getTrack = function (trackName) {
    let bodyQuery = {
        "selector": {
            "Track": trackName
        },
        // "fields": ["Active_tracks", "Workout_type", "Workout_order", "Workout_description", "Workout_extra"],
        "limit": 100,
        "skip": 0,
        "execution_stats": true
    }
    try {
        return FetchFind(workoutsDbUrl, bodyQuery)
    } catch{
        throw new Error('Error getting track')
    }
}

exports.createUser = function (userInfo) {
    let Active_tracks = userInfo.Active_tracks
    let bodyParams = {
        "User_name": userInfo.User_name,
        "User_type": userInfo.User_type,
        "Active_tracks": [{}]
    }
    bodyParams['Active_tracks'][0][Active_tracks] = new Date().toString()
    try {
        return fetch(userDbUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(bodyParams),
        }).then(function (response) {
            return (response.json())
        })
            .then(function (json) {
                return (json)
            })
            .catch(function (err) {
                throw new Error("Error Creating User ");
            }
            )
    } catch{
        throw new Error('Error Creating User')
    }
}

exports.availableTracks = function () {
    try {
        return fetchAvailableTracks()
    } catch{
        throw new Error('Error getting track')
    }
}

exports.updateUser = function (userInfo) {
    let userObject = {
        "User_name": userInfo.User_name,
        "User_type": userInfo.User_type,
        "Active_tracks": userInfo.Active_tracks
    }
    return exports.getUser(userObject.User_name).then(function (result) {
        if (result.length < 1) {
            return exports.createUser(userObject)
        } else {
            let oldUserData = result[0]
            oldUserData.User_name = userObject.User_name
            oldUserData.User_type = userObject.User_type
            oldUserData.Active_tracks = userObject.Active_tracks
            return fetch(userDbUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(oldUserData),
            }).then(function (result) {
                return result.json()
            }).then(function (json) {
                return json
            }).catch(function (err) {
                throw new Error("Error Updating User ");
            })

        }
    })
}
