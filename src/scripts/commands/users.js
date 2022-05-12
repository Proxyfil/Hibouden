const { Client, Message, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const users_db = require('../../database/users.json')
const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs');

registerFont('./src/ressources/fonts/corpo.otf', { family: 'Corporate' }) //Add Corpo Font

module.exports = {
    profile: function(interaction,target){
        let user = {}
        if(!users_db.includes(interaction.member.user.id)){
            user = {"name":target,"role":"User","inventory":[],"scrap":0,"next_roll":0}
        }else{
            user = require('../../database/users/'+target+'.json')
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
                {"name":`Nombre de cartes : ${user['inventory'].length}`,"value":"---------"},
                {"name":`Nombre de scrap : ${user['scrap']}`,"value":"---------"}
            )

        let embeds = [embed]

        for (let e = 0; e < Math.floor(user['inventory'].length/20)+1; e++) {
            let embed = new MessageEmbed()
                .setTitle(`🃏 Cartes de ${user["name"]}`)
                .setDescription(`#️⃣ Page ${e+1}/${Math.floor(user['inventory'].length/20)+1}`)

            user['inventory'].slice(e*20,(e+1)*20).forEach(card_id => {
                embed.addFields({"name":`Nom : ${cards[card_id]['name']} | Rareté : ${cards[card_id]['rarity']}`,"value":`Collection : ${cards[card_id]['collection']} | ID : ${cards[card_id]['id']} \n----`})

                if(card_id == user['inventory'][user['inventory'].length-1] || card_id == user['inventory'][(e+1)*20-1]){
                    embeds.push(embed)
                }
            });
        }
        
        return embeds
    }
}