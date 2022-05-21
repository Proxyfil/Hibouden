const { Client, Message, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const cards_db = require('../../database/cards.json')
const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont('./src/ressources/fonts/corpo.otf', { family: 'Corporate' }) //Add Corpo Font

module.exports = {
    pick_card: function(fct_mode) {
        function random(min, max) {  
            return Math.floor(
                Math.random() * (max - min + 1) + min
            )
        }

        //Card Specs
        let card_specs = {"rarity": "common"}


        //Pickup rarity
        let rarity_index = random(0,100)
        let rarity_chances = {"common":40,"funny":65,"legendary":85,"recomposed":95,"memories":99,"classified":100,"nft":101}

        if(fct_mode == "unsafe"){
            rarity_chances = {"common":40,"funny":65,"legendary":85,"recomposed":95,"memories":99,"classified":100,"nft":101} //Common,Funny,Legendary,Recomposed,Memories,Classified,NFT
        }
        else{
            rarity_chances = {"common":40,"funny":65,"legendary":85,"recomposed":95,"memories":100,"classified":101,"nft":102} //Common,Funny,Legendary,Recomposed,Memories,Classified,NFT
        }

        if(rarity_index < rarity_chances["common"]){
            card_specs["rarity"] = "common"
        }
        else if(rarity_index > rarity_chances["common"] && rarity_index <= rarity_chances["funny"]){
            card_specs["rarity"] = "funny"
        }
        else if(rarity_index > rarity_chances["funny"] && rarity_index <= rarity_chances["legendary"]){
            card_specs["rarity"] = "legendary"
        }
        else if(rarity_index > rarity_chances["legendary"] && rarity_index <= rarity_chances["recomposed"]){
            card_specs["rarity"] = "recomposed"
        }
        else if(rarity_index > rarity_chances["recomposed"] && rarity_index <= rarity_chances["memories"]){
            card_specs["rarity"] = "memories"
        }
        else if(rarity_index > rarity_chances["memories"] && rarity_index <= rarity_chances["classified"]){
            card_specs["rarity"] = "classified"
        }
        else if(rarity_index > rarity_chances["classified"] && rarity_index <= rarity_chances["nft"]){
            card_specs["rarity"] = "nft"
        }

        let poll = Object.keys(cards_db[card_specs["rarity"]])

        return cards_db[card_specs["rarity"]][poll[random(0,poll.length-1)]]
    },
    poll_embed: async function(cards,interaction,inventory){
        //Start Building of Image
        const width = 2000
        const height = 700

        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        context.font = '50px "Corporate" 4px 4px'

        let background = await loadImage('https://media.discordapp.net/attachments/879487467739299890/954763617646022776/poll_bg.png?width=1440&height=504')
        let card1 = await loadImage(cards[0]["img"])
        let card2 = await loadImage(cards[1]["img"])
        let card3 = await loadImage(cards[2]["img"])
        let icon_rarity = await loadImage('https://discord.com/assets/141d49436743034a59dec6bd5618675d.svg')
        let icon_name = await loadImage('https://discord.com/assets/0f7341809de05e185655e4d20735d0a2.svg')
        let icon_collection = await loadImage('https://discord.com/assets/ecf869302151b7838aff2f2125920206.svg')

        let setup = [{"card":cards[0],"pos":{"x":75,"y":25},"img":card1},{"card":cards[1],"pos":{"x":750,"y":25},"img":card2},{"card":cards[2],"pos":{"x":1425,"y":25},"img":card3}]
        let border_color = {"Common":"#46bb0b","Funny":"#d0c112","Legendary":"#d07812","Recomposed":"#3f46cf","Memories":"#e24141","Classified":"#dc41dd","NFT":"#0bbb7c"}

        context.drawImage(background, 0, 0, 2000, 700)

        setup.forEach(card => {
            context.drawImage(card["img"], card["pos"]["x"], card["pos"]["y"], 500, 500)
            context.fillStyle = border_color[card["card"]["rarity"]]
            context.fillRect(card["pos"]["x"],card["pos"]["y"]+498,500,4)

            context.drawImage(icon_name, card["pos"]["x"], card["pos"]["y"]+525, 40, 40)
            context.fillText(card["card"]["name"],card["pos"]["x"]+50,card["pos"]["y"]+565,500)

            context.drawImage(icon_collection, card["pos"]["x"], card["pos"]["y"]+575, 40, 40)
            context.fillText(card["card"]["collection"],card["pos"]["x"]+50,card["pos"]["y"]+615,500)

            context.drawImage(icon_rarity, card["pos"]["x"], card["pos"]["y"]+625, 40, 40)
            context.fillText(card["card"]["rarity"],card["pos"]["x"]+50,card["pos"]["y"]+665,500)
        });

        const buffer = canvas.toBuffer('image/png')
        const attachment = new MessageAttachment(buffer, 'poll.png'); 
        //End Building of Image

        //Start Building of Embed
        const embed = new MessageEmbed()
            .setTitle(':game_die: Tirage de cartes :game_die:')
            .setDescription(':arrow_right: Voici les 3 cartes que vous avez tiré. Choisissez une des 3')
            .addFields(
                { name: 'Carte 1 :', value: `:label: **Nom :** \n${cards[0].name} \n:open_file_folder: **Collection :** \n${cards[0].collection} \n:mag_right: **État :** \n${cards[0].state} \n:coin: **Valeur :** \n${cards[0].scrap} \n:star: **Rareté :** \n${cards[0].rarity}`, inline: true },
                { name: 'Carte 2 :', value: `:label: **Nom :** \n${cards[1].name} \n:open_file_folder: **Collection :** \n${cards[1].collection} \n:mag_right: **État :** \n${cards[1].state} \n:coin: **Valeur :** \n${cards[1].scrap} \n:star: **Rareté :** \n${cards[1].rarity}`, inline: true },
                { name: 'Carte 3 :', value: `:label: **Nom :** \n${cards[2].name} \n:open_file_folder: **Collection :** \n${cards[2].collection} \n:mag_right: **État :** \n${cards[2].state} \n:coin: **Valeur :** \n${cards[2].scrap} \n:star: **Rareté :** \n${cards[2].rarity}`, inline: true },
            )
            .setImage('attachment://poll.png')
            .setFooter({text: 'Vous avez 30 secondes pour prendre une carte !'})
        //End Building of Embed

        //Start Building of Action Row
        let btn_card1, btn_card2, btn_card3 = ("","","")

        if(!inventory.includes(cards[0]["id"])){
            btn_card1 = new MessageButton().setCustomId('pick_1').setLabel('Pick 1').setStyle('PRIMARY')
        }
        else{
            btn_card1 = new MessageButton().setCustomId('pick_1').setLabel('Pick 1').setStyle('SECONDARY')
        }
        if(!inventory.includes(cards[1]["id"])){
            btn_card2 = new MessageButton().setCustomId('pick_2').setLabel('Pick 2').setStyle('PRIMARY')
        }
        else{
            btn_card2 = new MessageButton().setCustomId('pick_2').setLabel('Pick 2').setStyle('SECONDARY')
        }
        if(!inventory.includes(cards[2]["id"])){
            btn_card3 = new MessageButton().setCustomId('pick_3').setLabel('Pick 3').setStyle('PRIMARY')
        }
        else{
            btn_card3 = new MessageButton().setCustomId('pick_3').setLabel('Pick 3').setStyle('SECONDARY')
        }

        const row = new MessageActionRow().addComponents(btn_card1,btn_card2,btn_card3);

        //End Building of Action Row
        interaction.editReply({ embeds: [embed], files: [attachment], components: [row], ephemeral: true});
        interaction.channel.send({ files: [attachment]})
    },
    card_select: function(interaction,choice,action){
        let embed = ""

        if(action == "stored"){
            embed = new MessageEmbed()
                .setTitle(interaction.member.user.username + ' as pris la carte : ' + choice['name'] + ' (id : '+choice['id']+')')
                .setDescription('GG à toi !')
        }
        else{
            embed = new MessageEmbed()
                .setTitle(interaction.member.user.username + ' as pris la carte : ' + choice['name'] + ' (id : '+choice['id']+')')
                .setDescription('Il avait déjà cette carte, sa valeur lui a été transférée soit ' + choice['scrap'] + ' scraps !')
        }
        return embed
    },
    see_card: async function(interaction,card){

        //Start Building of Image
        const width = 550
        const height = 700

        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        context.font = '50px "Corporate" 4px 4px'

        let background = await loadImage('https://media.discordapp.net/attachments/879487467739299890/954763617646022776/poll_bg.png?width=1440&height=504')
        let card1 = await loadImage(card["img"])
        let icon_rarity = await loadImage('https://discord.com/assets/141d49436743034a59dec6bd5618675d.svg')
        let icon_name = await loadImage('https://discord.com/assets/0f7341809de05e185655e4d20735d0a2.svg')
        let icon_collection = await loadImage('https://discord.com/assets/ecf869302151b7838aff2f2125920206.svg')

        let card_pos = {"card":card,"pos":{"x":25,"y":25},"img":card1}
        let border_color = {"Common":"#46bb0b","Funny":"#d0c112","Legendary":"#d07812","Recomposed":"#3f46cf","Memories":"#e24141","Classified":"#dc41dd","NFT":"#0bbb7c"}

        context.drawImage(background, 0, 0, 2000, 700)
        
        context.drawImage(card_pos["img"], card_pos["pos"]["x"], card_pos["pos"]["y"], 500, 500)
        context.fillStyle = border_color[card["rarity"]]
        context.fillRect(card_pos["pos"]["x"],card_pos["pos"]["y"]+498,500,4)

        context.drawImage(icon_name, card_pos["pos"]["x"], card_pos["pos"]["y"]+525, 40, 40)
        context.fillText(card["name"],card_pos["pos"]["x"]+50,card_pos["pos"]["y"]+565,500)

        context.drawImage(icon_collection, card_pos["pos"]["x"], card_pos["pos"]["y"]+575, 40, 40)
        context.fillText(card["collection"],card_pos["pos"]["x"]+50,card_pos["pos"]["y"]+615,500)

        context.drawImage(icon_rarity, card_pos["pos"]["x"], card_pos["pos"]["y"]+625, 40, 40)
        context.fillText(card["rarity"],card_pos["pos"]["x"]+50,card_pos["pos"]["y"]+665,500)

        const buffer = canvas.toBuffer('image/png')
        const attachment = new MessageAttachment(buffer, 'poll.png'); 

        const embed = new MessageEmbed()
            .setTitle(`🏷️ ${card['name']} | 📂 *${card['collection']}*`)
            .setDescription(`⭐ ${card['rarity']} | 🪙 *${card['scrap']}*`)
        
        interaction.editReply({ embeds: [embed], files: [attachment]});
    }
}