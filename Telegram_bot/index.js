const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const config = require('./config.js')

const bot = new TelegramBot(token, { polling: true })
const token = config.token
const apiUrl = config.apiUrl

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome new user, what do you want to do?", {
        "reply_markup": {
            "keyboard": [['/Workout'], ["/NewUser", "/Tracks"]]
        }
    })

})

// bot.onText(/\/newUser/, (msg) => {
//     bot.sendMessage(msg.chat.id, "Tell me your name starting with /NewUser ")
// })
bot.onText(/\/Workout/, (msg) => {
    let user = 'pepe'
    // let user = msg.from.first_name.toString().toLowerCase()
    fetch(apiUrl + 'users/' + user).then(function (response) {
        return (response.json())
    }).then(function (json) {
        let workout_type = json[0].Workout_type
        bot.sendMessage(msg.chat.id, "Workout Type: " + workout_type)

        let workout_desc = json[0].Workout_description.split(';;')
        bot.sendMessage(msg.chat.id, "Workout Description: ")
        workout_desc.map(line => bot.sendMessage(msg.chat.id, line))
        setTimeout(function () {
            bot.sendMessage(msg.chat.id, "Workout Extra: ")
            let workout_extra = json[0].Workout_extra.split(';;')
            workout_extra.map(line => bot.sendMessage(msg.chat.id, line))
        }, 2000)

        // bot.sendMessage(msg.chat.id, workout_desc, { parse_mode: "markdown" })
    })
})


bot.onText(/\/NewUser/, (msg) => {
    let newUser = msg.from.first_name.toString().toLowerCase()
    bot.sendMessage(msg.chat.id, "New user created with the name: " + newUser)
})