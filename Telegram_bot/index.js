const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const config = require('./config.js')
const token = config.token

const bot = new TelegramBot(token, { polling: true })
const apiUrl = config.apiUrl

let newUser = function (msgid, userName) {
    fetch(apiUrl + 'availableTracks').then(function (response) {
        return (response.json())
    }).then(function (json) {
        let keyboard = { 'inline_keyboard': [] }
        let i = 0
        json.map(x => {
            keyboard.inline_keyboard[i] = [{ 'text': x, 'callback_data': 'addTrack ' + x }]
            i++
        })
        let a = keyboard
        bot.sendMessage(msgid, 'Available Tracks:', {
            "reply_markup": keyboard
            // "keyboard": [keyboard]
        })
        // bot.sendMessage(msgid, "Send me the Track you'd like to follow with /Addtrack")
    })
}

let addTrack = function (msgid, user, track) {
    let bodyParams = {
        "User_name": user.toLowerCase(),
        "User_type": 'normal',
        "Active_tracks": track
    }
    fetch(apiUrl + 'updateUser', {
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
}


let getwodBy = function (msgid, user, searchfield) {
    if (searchfield == 'Type') {
        sendTypes(msgid, user)
    } else if (searchfield == 'Length') {
        bot.sendMessage(msgid, 'The available time frames are: ', {
            "reply_markup": {
                // "keyboard": [['Workout'], ["NewUser", "Tracks"]]
                inline_keyboard: [[
                    { text: '<30', callback_data: 'wodByLength 30' }],
                [{ text: '<60', callback_data: 'wodByLength 60' }],
                [{ text: '>60', callback_data: 'wodByLength 90' }]]
            }
        })
    }
}
bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome new user, what do you want to do?", {
        "reply_markup": {
            // "keyboard": [['Workout'], ["NewUser", "Tracks"]]
            inline_keyboard: [[
                { text: 'Workout', callback_data: 'Workout' }],
            [{ text: 'New User', callback_data: 'NewUser' }],
            [{ text: 'Tracks', callback_data: 'Tracks' }],
            [{ text: 'Wod by type', callback_data: 'Wod Type' }, { text: 'Wod by length', callback_data: 'Wod by Length' }]
            ]
        }
    })

})
bot.on("callback_query", function (data) {
    let query = data.data.split(' ')
    switch (query[0]) {
        case 'NewUser':
            newUser(data.from.id, data.from.username)
            break
        case 'addTrack':
            addTrack(data.from.id, data.from.username, query[1])
            break
        case 'Workout':
            sendWorkout(data.from.id, data.from.username)
            break
        case 'Tracks':
            getTracks(data.from.id, data.from.username)
        case 'Wod':
            getwodBy(data.from.id, data.from.username, query[2])
            break
        case 'wodByType':
            getWodByType(data.from.id, data.from.username, query[1])
            break
        case 'wodByLength':
            getWodByLength(data.from.id, data.from.username, query[1])
            break
        default:
            break
    }
})

// bot.onText(/NewUser/, (msg) => {
//     bot.sendMessage(msg.chat.id, "Send me the Track you'd like to follow with /Addtrack")
// })

bot.onText(/Tracks/, (msg) => {
    fetch(apiUrl + 'availableTracks').then(function (response) {
        return (response.json())
    }).then(function (json) {
        let keyboard = { 'keyboard': [] }
        let i = 0
        json.map(x => {
            keyboard.keyboard[i] = x
            i++
        })
        bot.sendMessage(msg.chat.id, 'Available Tracks:', {
            "reply_markup": keyboard
            // "keyboard": [keyboard]
        })
        // json.map(x => bot.sendMessage(msg.chat.id, x))

    })
})

bot.onText(/Addtrack/, (msg) => {
    let track = msg.text.replace('/Addtrack ', '')
    track = charAt(0).toUpperCase() + track.slice(1)
})

bot.onText(/Workout/, (msg) => {
    let user = 'pepe'
    // let user = msg.from.first_name.toString().toLowerCase()
    fetch(apiUrl + 'users/' + user).then(function (response) {
        return (response.json())
    }).then(function (json) {
        if (json.length < 1) {
            bot.sendMessage(msg.chat.id, "You don't have a workout today")
        } else {
            let workout_type = json[0].Workout_type
            bot.sendMessage(msg.chat.id, "Workout Type:" + workout_type)

            let workout_desc = json[0].Workout_description.split(';;')
            bot.sendMessage(msg.chat.id, "Workout Description: ")
            // bot.sendMessage(msg.chat.id, workout_desc, { parse_mode: "Markdown" })

            workout_desc.map(line => bot.sendMessage(msg.chat.id, line))
            setTimeout(function () {
                bot.sendMessage(msg.chat.id, "Workout Extra:")
                let workout_extra = json[0].Workout_extra.split(';;')
                workout_extra.map(line => bot.sendMessage(msg.chat.id, line))
            }, 2000)
        }
    })
})


let sendWorkout = function (chatId, username) {
    let user = 'pepe'
    // let user = username.toLowerCase()
    fetch(apiUrl + 'users/' + user).then(function (response) {
        return (response.json())
    }).then(function (json) {
        if (json.length < 1) {
            bot.sendMessage(chatId, "You don't have a workout today")
        } else {
            let workout_type = json[0].Workout_type
            bot.sendMessage(chatId, "Workout Type:" + workout_type)

            let workout_desc = json[0].Workout_description.split(';;')
            bot.sendMessage(chatId, "Workout Description: ")
            // bot.sendMessage(chatId, workout_desc, { parse_mode: "Markdown" })

            workout_desc.map(line => bot.sendMessage(chatId, line))
            setTimeout(function () {
                bot.sendMessage(chatId, "Workout Extra:")
                let workout_extra = json[0].Workout_extra.split(';;')
                workout_extra.map(line => bot.sendMessage(chatId, line))
            }, 2000)
        }
    })
}

bot.onText(/\/NewUser/, (msg) => {
    let newUser = msg.from.first_name.toString().toLowerCase()
    bot.sendMessage(msg.chat.id, "New user created with the name: " + newUser)
})

let getTracks = function (chatId, username) {
    fetch(apiUrl + 'availableTracks/').then(function (response) {
        return (response.json())
    }).then(function (json) {
        if (json.length < 1) {
            bot.sendMessage(chatId, "There are no tracks available at the moment.")
        } else {
            let keyboard = { 'inline_keyboard': [] }
            let i = 0
            json.map(x => {
                keyboard.inline_keyboard[i] = [{ 'text': x, 'callback_data': 'addTrack ' + x }]
                i++
            })
            let a = keyboard
            bot.sendMessage(chatId, 'Available Tracks:', {
                "reply_markup": keyboard
                // "keyboard": [keyboard]
            })
            // bot.sendMessage(msgid, "Send me the Track you'd like to follow with /Addtrack")
        }
    })
}

let sendTypes = function (chatId, user) {
    fetch(apiUrl + 'availableTypes/').then(function (response) {
        return (response.json())
    }).then(function (json) {
        if (json.length < 1) {
            bot.sendMessage(chatId, "There are no workouts available at the moment.")
        } else {
            let keyboard = { 'inline_keyboard': [] }
            let i = 0
            json.map(x => {
                keyboard.inline_keyboard[i] = [{ 'text': x, 'callback_data': 'wodByType ' + x }]
                i++
            })
            let a = keyboard
            bot.sendMessage(chatId, 'Available Types:', {
                "reply_markup": keyboard
                // "keyboard": [keyboard]
            })
            // bot.sendMessage(msgid, "Send me the Track you'd like to follow with /Addtrack")
        }
    })
}