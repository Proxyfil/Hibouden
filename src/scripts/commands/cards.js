const { Client, Message, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const cards_db = require('../../database/cards.json')
const { createCanvas, loadImage, registerFont } = require('canvas')
registerFont('./src/ressources/fonts/corpo.otf', { family: 'Corporate' }) //Add Corpo Font
const fs = require('fs');
const cmd_debug = require('./debug.js')

module.exports = {
    pick_card: function(fct_mode,user_rarity,user_inventory) {
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

        let card = "null"

        for (let i = 0; i < user_rarity; i++) {
            if(card == "null" || user_inventory.includes(card)){
                card = cards_db[card_specs["rarity"]][poll[random(0,poll.length-1)]];
            }
        }

        return card
    },
    poll_embed: async function(cards,interaction,inventory){
        //Start Building of Image
        const width = 1700
        const height = 800

        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        context.font = '50px "Corporate" 4px 4px'
        context.fillStyle = "#101010";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let card1 = await loadImage(cards[0]["img"])
        let card2 = await loadImage(cards[1]["img"])
        let card3 = await loadImage(cards[2]["img"])

        let cards_mockup = {"Common": ".src/ressources/img/card-common.png","Funny":".src/ressources/img/card-funny.png","Legendary":".src/ressources/img/card-legendary.png","Recomposed":".src/ressources/img/card-recomposed.png","Memories":".src/ressources/img/card-memories.png","Classified":".src/ressources/img/card-classified.png","Deprecated":".src/ressources/img/card-deprecated.png","NFT":".src/ressources/img/card-nft.png"}
        let mockup_card1 = await loadImage(cards_mockup[cards[0]["rarity"]])
        let mockup_card2 = await loadImage(cards_mockup[cards[1]["rarity"]])
        let mockup_card3 = await loadImage(cards_mockup[cards[2]["rarity"]])
        
        let setup = [{"card":cards[0],"pos":{"x":50,"y":50},"img":card1,"mockup":mockup_card1},{"card":cards[1],"pos":{"x":600,"y":50},"img":card2,"mockup":mockup_card2},{"card":cards[2],"pos":{"x":1150,"y":50},"img":card3,"mockup":mockup_card3}]
        let border_color = {"Common":"#46bb0b","Funny":"#d0c112","Legendary":"#d07812","Recomposed":"#3f46cf","Memories":"#e24141","Classified":"#dc41dd","NFT":"#0bbb7c"}

        setup.forEach(card => {
            context.drawImage(card["img"], card["pos"]["x"], card["pos"]["y"], 500, 500)
            context.drawImage(card["mockup"], card["pos"]["x"], card["pos"]["y"], 500, 700)
            context.fillStyle = border_color[card["card"]["rarity"]]

            context.fillText(card["card"]["name"],card["pos"]["x"]+60,card["pos"]["y"]+560,500)

            context.fillText(card["card"]["collection"],card["pos"]["x"]+60,card["pos"]["y"]+610,500)

            context.fillText(card["card"]["rarity"],card["pos"]["x"]+60,card["pos"]["y"]+660,500)
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
    card_select: function(interaction,choice,action,multiple){
        let embed = ""

        if(action == "stored"){
            embed = new MessageEmbed()
                .setTitle(interaction.member.user.username + ' as pris la carte : ' + choice['name'] + ' (id : '+choice['id']+')')
                .setDescription('GG à toi !')
        }
        else{
            embed = new MessageEmbed()
                .setTitle(interaction.member.user.username + ' as pris la carte : ' + choice['name'] + ' (id : '+choice['id']+')')
                .setDescription('Il avait déjà cette carte, sa valeur lui a été transférée soit ' + choice['scrap']*multiple + ' scraps !')
        }
        return embed
    },
    see_card: async function(interaction,card){

        //Start Building of Image
        const width = 600
        const height = 800

        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        context.font = '50px "Corporate" 4px 4px'
        context.fillStyle = "#101010";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let card1 = await loadImage(card["img"])

        let cards_mockup = {"Common": ".src/ressources/img/card-common.png","Funny":".src/ressources/img/card-funny.png","Legendary":".src/ressources/img/card-legendary.png","Recomposed":".src/ressources/img/card-recomposed.png","Memories":".src/ressources/img/card-memories.png","Classified":".src/ressources/img/card-classified.png","Deprecated":".src/ressources/img/card-deprecated.png","NFT":".src/ressources/img/card-nft.png"}
        let mockup_card = await loadImage(cards_mockup[card["rarity"]])

        let card_pos = {"card":card,"pos":{"x":50,"y":50},"img":card1}
        let border_color = {"Common":"#46bb0b","Funny":"#d0c112","Legendary":"#d07812","Recomposed":"#3f46cf","Memories":"#e24141","Classified":"#dc41dd","NFT":"#0bbb7c","Deprecated":"#cc0000"}
        
        context.drawImage(card_pos["img"], card_pos["pos"]["x"], card_pos["pos"]["y"], 500, 500)
        context.drawImage(mockup_card, card_pos["pos"]["x"], card_pos["pos"]["y"], 500, 700)
        context.fillStyle = border_color[card["rarity"]]

        context.fillText(card["name"],card_pos["pos"]["x"]+60,card_pos["pos"]["y"]+560,500)

        context.fillText(card["collection"],card_pos["pos"]["x"]+60,card_pos["pos"]["y"]+610,500)

        context.fillText(card["rarity"],card_pos["pos"]["x"]+60,card_pos["pos"]["y"]+660,500)

        const buffer = canvas.toBuffer('image/png')
        const attachment = new MessageAttachment(buffer, 'poll.png'); 

        const embed = new MessageEmbed()
            .setTitle(`🏷️ ${card['name']} | 📂 *${card['collection']}*`)
            .setDescription(`⭐ ${card['rarity']} | 🪙 *${card['scrap']}*`)
        
        interaction.editReply({ embeds: [embed], files: [attachment]});
    },
    buy: function(interaction,args){
        let card_id = args[0].value

        let cards_by_rarity = fs.readFileSync('./src/database/cards.json')
        cards_by_rarity = JSON.parse(cards_by_rarity)
        let cards_list = {}
        Object.values(cards_by_rarity).forEach(card_group => {
            Object.keys(card_group).forEach(card_id => {
                cards_list[card_id] = card_group[card_id]
            })
        })

        let rarity_order = {"Common":1,"funny":2,"Legendary":3,"Recomposed":4,"Memories":5,"Classified":6}

        if(!cards_list[args[0].value]){
            interaction.editReply({embeds:[cmd_debug.h_error("No card found with this ID","001")]})
            return
        }

        let user = {}

        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');
        users_db = JSON.parse(users_db)

        if(!users_db.includes(interaction.member.user.id)){
            users_db.push(interaction.member.user.id)
            fs.writeFile('./src/database/users.json', JSON.stringify(users_db),function(){});
            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify({"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}),function(){});
            user = {"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}
        }
        else{
            user = fs.readFileSync('./src/database/users/'+interaction.member.user.id+'.json')
            user = JSON.parse(user)
        }

        if(user["inventory"].includes(card_id)){
            const embed = new MessageEmbed()
            .setTitle(`:x: Something went wrong :x:`)
            .setDescription(`Tu ne peux pas acheter une carte que tu as déjà`)

            interaction.editReply({ embeds: [embed]})
            return
        }
        else if(rarity_order[cards_list[args[0].value]["rarity"]] > user["upgrade"]["market"]){
            const embed = new MessageEmbed()
            .setTitle(`:x: Tu ne peux pas acheter cette carte, ton upgrade de MarketForAll n'est pas assez élevée :x:`)
            .setDescription(`Tier requis : ${rarity_order[cards_list[args[0].value]["rarity"]]}`)

            interaction.editReply({ embeds: [embed]})
            return
        }
        else if(cards_list[args[0].value]["scrap"]*50 > user["scrap"]){
            const embed = new MessageEmbed()
            .setTitle(`:x: Tu ne peux pas acheter cette carte, elle a une valeur trop élevée :x:`)
            .setDescription(`Montant requis : ${cards_list[args[0].value]["scrap"]*4} `)

            interaction.editReply({ embeds: [embed]})
            return
        }
        else{
            user["scrap"] -= cards_list[args[0].value]["scrap"]*50
            user["inventory"].push(parseInt(card_id))

            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){});

            const embed = new MessageEmbed()
            .setTitle(`:white_check_mark: Tu as acheté une carte :white_check_mark:`)
            .setDescription(`Vous avez dépensé : ${cards_list[args[0].value]["scrap"]*4}`)

            interaction.editReply({ embeds: [embed]})
            return
        }
    },
    craft_nft: function(interaction,args){
        let user = {}

        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');
        users_db = JSON.parse(users_db)

        if(!users_db.includes(interaction.member.user.id)){
            users_db.push(interaction.member.user.id)
            fs.writeFile('./src/database/users.json', JSON.stringify(users_db),function(){});
            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify({"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}),function(){});
            user = {"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}
        }
        else{
            user = fs.readFileSync('./src/database/users/'+interaction.member.user.id+'.json')
            user = JSON.parse(user)
        }

        let nfts = fs.readFileSync('./src/database/nft.json', 'utf8');
        nfts = JSON.parse(nfts)

        if(user["scrap"] < 2000){
            interaction.editReply({embeds:[cmd_debug.h_error("You need 2000 scrap to craft an NFT Card","003")]})
            return
        }
        else if(!Object.keys(nfts).includes(args[0].value)){
            interaction.editReply({embeds:[cmd_debug.h_error("No NFT card found with this ID","001")]})
            return
        }
        else{
            let missing_cards = 0

            nfts[args[0].value]["requirements"].forEach(card_id => {
                if(!user["inventory"].includes(card_id)){
                    missing_cards += 1
                }
            });

            if(missing_cards != 0){
                interaction.editReply({embeds:[cmd_debug.h_error(`You need ${missing_cards} cards more`,"002")]})
                return
            }
            else{
                nfts[args[0].value]["requirements"].forEach(card_id => {
                    user["inventory"].splice(user["inventory"].indexOf(card_id),1)
                });
                user["inventory"].push(parseInt(args[0].value))
                user["scrap"] -= 2000
                fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){});

                const embed = new MessageEmbed()
                .setTitle(`🏷️ ${interaction.member.user.username} just buy an NFT Card !`)
                .setDescription(`⭐ Card id : ${args[0].value} | you can type /see_card ${args[0].value} to see it`)
        
                interaction.editReply({ embeds: [embed]});
            }
        }
    },
    see_nft: function(interaction,card){
        const embed = new MessageEmbed()
            .setTitle(`🏷️ ${card['name']} | 📂 *${card['collection']}*`)
            .setDescription(`⭐ ${card['rarity']} | 🪙 *${card['scrap']}*`)
            .setImage(card['img'])
        
        interaction.editReply({ embeds: [embed]});
    }
}