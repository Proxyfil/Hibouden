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
            .setDescription(':arrow_right: Voici les 3 cartes que vous avez tir??. Choisissez une des 3')
            .addFields(
                { name: 'Carte 1 :', value: `:label: **Nom :** \n${cards[0].name} \n:open_file_folder: **Collection :** \n${cards[0].collection} \n:mag_right: **??tat :** \n${cards[0].state} \n:coin: **Valeur :** \n${cards[0].scrap} \n:star: **Raret?? :** \n${cards[0].rarity}`, inline: true },
                { name: 'Carte 2 :', value: `:label: **Nom :** \n${cards[1].name} \n:open_file_folder: **Collection :** \n${cards[1].collection} \n:mag_right: **??tat :** \n${cards[1].state} \n:coin: **Valeur :** \n${cards[1].scrap} \n:star: **Raret?? :** \n${cards[1].rarity}`, inline: true },
                { name: 'Carte 3 :', value: `:label: **Nom :** \n${cards[2].name} \n:open_file_folder: **Collection :** \n${cards[2].collection} \n:mag_right: **??tat :** \n${cards[2].state} \n:coin: **Valeur :** \n${cards[2].scrap} \n:star: **Raret?? :** \n${cards[2].rarity}`, inline: true },
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
                .setDescription('GG ?? toi !')
        }
        else{
            embed = new MessageEmbed()
                .setTitle(interaction.member.user.username + ' as pris la carte : ' + choice['name'] + ' (id : '+choice['id']+')')
                .setDescription('Il avait d??j?? cette carte, sa valeur lui a ??t?? transf??r??e soit ' + choice['scrap']*multiple + ' scraps !')
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
            .setTitle(`??????? ${card['name']} | ???? *${card['collection']}*`)
            .setDescription(`??? ${card['rarity']} | ???? *${card['scrap']}*`)
        
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
            .setDescription(`Tu ne peux pas acheter une carte que tu as d??j??`)

            interaction.editReply({ embeds: [embed]})
            return
        }
        else if(rarity_order[cards_list[args[0].value]["rarity"]] > user["upgrade"]["market"]){
            const embed = new MessageEmbed()
            .setTitle(`:x: Tu ne peux pas acheter cette carte, ton upgrade de MarketForAll n'est pas assez ??lev??e :x:`)
            .setDescription(`Tier requis : ${rarity_order[cards_list[args[0].value]["rarity"]]}`)

            interaction.editReply({ embeds: [embed]})
            return
        }
        else if(cards_list[args[0].value]["scrap"]*500 > user["scrap"]){
            const embed = new MessageEmbed()
            .setTitle(`:x: Tu ne peux pas acheter cette carte, elle a une valeur trop ??lev??e :x:`)
            .setDescription(`Montant requis : ${cards_list[args[0].value]["scrap"]*4} `)

            interaction.editReply({ embeds: [embed]})
            return
        }
        else{
            user["scrap"] -= cards_list[args[0].value]["scrap"]*500
            user["inventory"].push(parseInt(card_id))

            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){});

            const embed = new MessageEmbed()
            .setTitle(`:white_check_mark: Tu as achet?? une carte :white_check_mark:`)
            .setDescription(`Vous avez d??pens?? : ${cards_list[args[0].value]["scrap"]*4}`)

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
                .setTitle(`??????? ${interaction.member.user.username} just buy an NFT Card !`)
                .setDescription(`??? Card id : ${args[0].value} | you can type /see_card ${args[0].value} to see it`)
        
                interaction.editReply({ embeds: [embed]});
            }
        }
    },
    see_nft: function(interaction,card){
        const embed = new MessageEmbed()
            .setTitle(`??????? ${card['name']} | ???? *${card['collection']}*`)
            .setDescription(`??? ${card['rarity']} | ???? *${card['scrap']}*`)
            .setImage(card['img'])
        
        interaction.editReply({ embeds: [embed]});
    }
}