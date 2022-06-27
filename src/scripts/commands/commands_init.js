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
            },
            {
                "name": "cards",
                "description": "Send cards too ?",
                "type": 5,
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
        "description": "Add a card to the collection",
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
    },
    {
        "name": "buy_roll",
        "description": "You need at least 300 scraps to buy 1 roll",
        "options": ""
    },
    {
        "name": "reset_profile",
        "description": "Completly restart from nothing",
        "options": [
            {
                "name": "confirm",
                "description": "Confirm your choice",
                "type": 5,
                "required": true
            }
        ]
    },
    {
        "name": "upgrade",
        "description": "You can upgrade some parameters to become better !",
        "options": ""
    },
    {
        "name": "buy_card",
        "description": "Buy a card with his id",
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
        "name": "craft_nft",
        "description": "Made a NFT Card from cards in your inventory",
        "options": [
            {
                "name": "card_id",
                "description": "ID of a NFT card",
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