const { Client, Message, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs');

registerFont('./src/ressources/fonts/corpo.otf', { family: 'Corporate' }) //Add Corpo Font

module.exports = {
    profile: function(interaction,target){
        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');

        let user = {}
        if(!users_db.includes(target)){
            user = {"name":target,"role":"User","inventory":[],"scrap":0,"next_roll":0}
        }else{
            user = fs.readFileSync('./src/database/users/'+target+'.json')
            user = JSON.parse(user)
        }

        let cards_by_rarity = fs.readFileSync('./src/database/cards.json')
        cards_by_rarity = JSON.parse(cards_by_rarity)
        cards = {}
        Object.values(cards_by_rarity).forEach(card_group => {
            Object.keys(card_group).forEach(card_id => {
                cards[card_id] = card_group[card_id]
            })
        })

        let embed = new MessageEmbed()
            .setTitle('Profil de '+user["name"])
            .setDescription('Role : '+user["role"])
            .addFields(
                {"name":`🃏 Nombre de cartes : ${user['inventory'].length}`,"value":"---------"},
                {"name":`:coin: Nombre de scrap : ${user['scrap']}`,"value":"---------"},
                {"name":`:envelope: Toutes ses cartes t'ont été envoyées en MP`,"value":"---------"}
            )

        interaction.editReply({embeds: [embed]})

        for (let e = 0; e < Math.floor(user['inventory'].length/20)+1; e++) {
            let embed = new MessageEmbed()
                .setTitle(`🃏 Cartes de ${user["name"]}`)
                .setDescription(`#️⃣ Page ${e+1}/${Math.floor(user['inventory'].length/20)+1}`)

            user['inventory'].slice(e*20,(e+1)*20).forEach(card_id => {
                embed.addFields({"name":`Nom : ${cards[card_id]['name']} | Rareté : ${cards[card_id]['rarity']}`,"value":`Collection : ${cards[card_id]['collection']} | ID : ${cards[card_id]['id']} \n----`})

                if(card_id == user['inventory'][user['inventory'].length-1] || card_id == user['inventory'][(e+1)*20-1]){
                    interaction.member.user.send({ embeds: [embed] })
                }
            });
        }
    },
    buy_roll: function(interaction){
        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');
        users_db = JSON.parse(users_db)

        let data = fs.readFileSync('./src/database/users/'+interaction.member.id+'.json', 'utf8');
        let user = JSON.parse(data)

        if(user['next_roll'] < Date.now() || !users_db.includes(interaction.member.user.id)){
            return cmd_debug.h_error("Your roll is available","004")
        }
        else if(user['scrap'] < 300){
            return cmd_debug.h_error("You don't have enough scrap","005")
        }
        else{
            user['scrap'] = user['scrap'] - 300
            user['next_roll'] = 1

            fs.writeFileSync('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){})

            let embed = new MessageEmbed()
                .setTitle(`🃏 Vous avez r'acheter un roll`)
                .setDescription(`Vous pouvez l'utiliser dès maintenant`)
                .addField({name:"--",value:"--"})

            return embed
        }
    }
}