const { Client, Message, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas')
const fs = require('fs');
const cmd_debug = require('./debug.js');
const { off } = require('process');

registerFont('./src/ressources/fonts/corpo.otf', { family: 'Corporate' }) //Add Corpo Font

module.exports = {
    profile: function(interaction,target,sendCards){
        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');

        let user = {}
        if(!users_db.includes(target)){
            user = {"name":target,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}
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
        let nfts = fs.readFileSync('./src/database/nft.json')
        nfts = JSON.parse(nfts)

        let embed = new MessageEmbed()
            .setTitle('Profil de '+user["name"])
            .setDescription('Role : '+user["role"])
            .addFields(
                {"name":`🃏 Nombre de cartes : ${user['inventory'].length}`,"value":"---------"},
                {"name":`:coin: Nombre de scrap : ${user['scrap']}`,"value":"---------"},
                {"name":`:up: Upgrades : \n[:hourglass: -${user["upgrade"]["time"]/1000/60} minutes] \n[:star2: tier ${user["upgrade"]["rarity"]}] \n[:coin: x${user["upgrade"]["scrap"]}] \n[:dollar: tier ${user["upgrade"]["market"]}]`,"value":`---------`}
            )

        interaction.editReply({embeds: [embed]})

        if(!sendCards){
            return
        }
        for (let e = 0; e < Math.floor(user['inventory'].length/20)+1; e++) {
            let embed = new MessageEmbed()
                .setTitle(`🃏 Cartes de ${user["name"]}`)
                .setDescription(`#️⃣ Page ${e+1}/${Math.floor(user['inventory'].length/20)+1}`)

            user['inventory'].slice(e*20,(e+1)*20).forEach(card_id => {
                if(card_id < 1000){
                    embed.addFields({"name":`Nom : ${cards[card_id]['name']} | Rareté : ${cards[card_id]['rarity']}`,"value":`Collection : ${cards[card_id]['collection']} | ID : ${cards[card_id]['id']} \n----`})
                }
                else{
                    embed.addFields({"name":`Nom : ${nfts[card_id]['name']} | Rareté : ${nfts[card_id]['rarity']}`,"value":`Collection : ${nfts[card_id]['collection']} | ID : ${nfts[card_id]['id']} \n----`})
                }
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
                .setTitle(`🃏 Vous avez r\'acheter un roll`)
                .setDescription(`Vous pouvez l\'utiliser dès maintenant`);;

            return embed
        }
    },
    reset_profile: function(interaction, confirm){
        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');

        let user = {}
        if(!users_db.includes(interaction.member.user.id)){
            let embed = new MessageEmbed()
                .setTitle(`Vous êtes déjà de retour à zéro`)
                .setDescription(`Nous ne pouvons réinitialiser votre profil.`);;

            return embed
        }
        else if(!confirm){
            let embed = new MessageEmbed()
                .setTitle(`Vous devez confirmer votre choix`)
                .setDescription(`Nous ne pouvons réinitialiser votre profil.`);;

            return embed
        }
        else{
            user = {"name":interaction.member.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}

            fs.writeFileSync('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){})

            let embed = new MessageEmbed()
                .setTitle(`Votre profil vient d'être réinitialisé !`)
                .setDescription(`Bonne chance pour ce nouveau départ :thumbsup:`);;

            return embed
        }
    },
    upgrade: function(interaction,user){
        let btn_time, btn_rarity, btn_scrap, btn_market = ("","","","")

        btn_time = new MessageButton().setCustomId('upgrade_time').setLabel('Up Time').setStyle('PRIMARY')
        btn_rarity = new MessageButton().setCustomId('upgrade_rarity').setLabel('Up Rarity Drop').setStyle('PRIMARY')
        btn_scrap = new MessageButton().setCustomId('upgrade_scrap').setLabel('Up Scrap Recycling').setStyle('PRIMARY')
        btn_market = new MessageButton().setCustomId('upgrade_market').setLabel('Up Market Tier').setStyle('PRIMARY')

        const row = new MessageActionRow().addComponents(btn_time,btn_rarity,btn_scrap,btn_market);

        const embed = new MessageEmbed()
            .setTitle(':game_die: Augmentation de vos skills :game_die:')
            .setDescription(':arrow_right: Voici les 4 paramètres que vous pouvez améliorer')
            .addFields(
                { name: 'SpeedTime  - **Bonus Actuel : -'+user["upgrade"]["time"]+' secondes**', value: `:label: Diminue le temps entre les rolls`, inline: true },
                { name: 'RarityFirst  - **Tier Actuel : '+user["upgrade"]["rarity"]+'**', value: `:label: Augmente les chances de cartes rares`, inline: true },
                { name: 'RecyclingForEver  - **Bonus Actuel : x'+user["upgrade"]["scrap"]+'**', value: `:label: Multiplie les scraps obtenus au recyclage`, inline: true },
                { name: 'MarketForAll - **Tier Actuel : '+user["upgrade"]["market"]+'**', value: `:label: Augmente les tiers de cartes achetables`, inline: true },
            );

        interaction.editReply({ embeds: [embed], components: [row], ephemeral: true});
    },
    upgraded: function(type,amount,interaction){
        if(type == "fail"){
            const embed = new MessageEmbed()
            .setTitle(`:x: ${interaction.member.user.username} n\'a pas pu augmenter ce skill :x:`)
            .setDescription(':arrow_right: Il était probablement trop haut niveau ou il n\'avait pas assez de scraps')

            return embed
        }
        else if(type == "time"){
            const embed = new MessageEmbed()
            .setTitle(`:white_check_mark: ${interaction.member.user.username} a pu augmenter le skill SpeedTime :white_check_mark:`)
            .setDescription(':arrow_right: Nouveau bonus : -'+Math.round(amount/1000/60)+' minutes  (-90 max)')

            return embed
        }
        else if(type == "rarity"){
            const embed = new MessageEmbed()
            .setTitle(`:white_check_mark: ${interaction.member.user.username} a pu augmenter le skill RarityFirst :white_check_mark:`)
            .setDescription(':arrow_right: Nouveau niveau : '+amount+' (6 max)')

            return embed
        }
        else if(type == "scrap"){
            const embed = new MessageEmbed()
            .setTitle(`:white_check_mark: ${interaction.member.user.username} a pu augmenter le skill RecyclingForEver :white_check_mark:`)
            .setDescription(':arrow_right: Nouveau bonus : x'+amount+' (x3 max)')

            return embed
        }
        else if(type == "market"){
            const embed = new MessageEmbed()
            .setTitle(`:white_check_mark: ${interaction.member.user.username} a pu augmenter le skill MarketForAll :white_check_mark:`)
            .setDescription(':arrow_right: Nouveau niveau : '+amount+' (6 max)')

            return embed
        }
    }
}