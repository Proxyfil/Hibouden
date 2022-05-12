module.exports = function (bot) {
    var command_list = [{
        "name": "hibouhelp", //Help
        "description": "Give you all commands for the bot",
        "options": ""
    },
    {
        "name": "ping",
        "description": "Debug feature",
        "options": ""
    },
    {
        "name": "roll",
        "description": "Roll 3 cards",
        "options": ""
    },
    {
        "name": "profile",
        "description": "See profile",
        "options": [
            {
                "name": "user",
                "description": "Tag User",
                "type": 6,
                "required": true
            }
        ]
    },
    {
        "name": "see_card",
        "description": "See card",
        "options": [
            {
                "name": "card_id",
                "description": "ID of a card",
                "type": 3,
                "required": true
            }
        ]
    },
    {
        "name": "add_card",
        "description": "See card",
        "options": [
            {
                "name": "card_id",
                "description": "ID of the card",
                "type": 3,
                "required": true
            },
            {
                "name": "name",
                "description": "Name of the card",
                "type": 3,
                "required": true
            },
            {
                "name": "collection",
                "description": "Collection of the card",
                "type": 3,
                "required": true
            },
            {
                "name": "rarity",
                "description": "Rarity of the card (as Common,Funny,Legendary,Recomposed,Memories,Classified,NFT)",
                "type": 3,
                "required": true
            },
            {
                "name": "scrap",
                "description": "Value of the card",
                "type": 4,
                "required": true
            },
            {
                "name": "img",
                "description": "Discord link of the image",
                "type": 3,
                "required": true
            }
        ]
    }]

    command_list.forEach(command => {
        bot.api.applications('947920162105991169').guilds('947916846710030396').commands.post({
            data: {
                name: command.name,
                description: command.description,
                options: command.options
            }
        }).catch(error => {
            console.log(error)
        });
        console.log("[" + new Date().toLocaleString() + "] [INIT] Command initiated : " + command.name + " has been initiated")
    });
}