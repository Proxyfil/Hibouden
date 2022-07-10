//Var Declaration
const { Client, RichEmbed, Message, MessageEmbed, APIMessage, Intents } = require('discord.js');
const intents = new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]);
const bot = new Client({ disableEveryone: "False", intents: intents });
const token = require('./tokens.json').discord;
const cmdinit = require('./commands/commands_init.js');
const cmd_debug = require('./commands/debug.js')
const cards = require('./commands/cards.js');
const users = require('./commands/users');
const fs = require('fs');

//Users rights list
let super_admins = ['249940011997200394','310478915162341376']
let no_classified_requirements = []

//Dev functions
const reply = async (interaction, response) => {
    interaction.editReply({ embeds: [response]});
}

//Start bot
//cmdinit(bot);

bot.on('ready', () => {
    console.log("[" + new Date().toLocaleString() + "] [BOOT] Is this... life ?");
    bot.user.setActivity("/hibouhelp | Running on release V1.8")
});

bot.on('interactionCreate', async interaction =>{

    if(interaction.isCommand()){

        //Beta-test part
        //if(!super_admins.includes(interaction.member.user.id)){
        //    await interaction.deferReply({ephemeral: true});

        //    interaction.editReply({embeds: [cmd_debug.h_error('Bot actually on testing : You can\'t interact with me, try later','418')]})
        //    return
        //}

        console.log(`[${new Date().toLocaleString()}] Command : ${interaction.commandName} requested by ${interaction.member.user.username}`)

        if(super_admins.includes(interaction.user.id)){
            if(interaction.commandName == "ping"){
                await interaction.deferReply();


                interaction.editReply({embeds: [cmd_debug.pong(interaction)]})
            }
        }
        if(super_admins.includes(interaction.user.id) || true){
            if(interaction.commandName == "roll"){
                await interaction.deferReply({ephemeral: true});

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

                if(user['next_roll'] > Date.now()){
                    await interaction.editReply({embeds: [cmd_debug.h_error('You can\'t roll again... wait '+(Math.round((user['next_roll']-Date.now())/1000/60,1))+' minutes.','002')]})
                    return
                }


                let cards_poll = [] //Setup void poll

                if(no_classified_requirements.includes(interaction.user.id)){ //Setup pick depending of users
                    cards_poll = [cards.pick_card("safe",user["upgrade"]["rarity"],user["inventory"]),cards.pick_card("safe",user["upgrade"]["rarity"],user["inventory"]),cards.pick_card("safe",user["upgrade"]["rarity"],user["inventory"])]
                }
                else{
                    cards_poll = [cards.pick_card("unsafe",user["upgrade"]["rarity"],user["inventory"]),cards.pick_card("unsafe",user["upgrade"]["rarity"],user["inventory"]),cards.pick_card("unsafe",user["upgrade"]["rarity"],user["inventory"])]
                }

                cards.poll_embed(cards_poll,interaction,user["inventory"]) //Send poll of cards

                fs.writeFile('./src/database/rolls/'+interaction.member.id+'.json',JSON.stringify(cards_poll), function(){});
                user['next_roll'] = Date.now()+(7200000-user["upgrade"]["time"])
                fs.writeFile('./src/database/users/'+interaction.member.id+'.json',JSON.stringify(user), function(){});

                const filters = i => i.member.id === interaction.member.id
                const collector = interaction.channel.createMessageComponentCollector({ "filter": filters, componentType: 'BUTTON', time: 45000 }); //Wait 45 seconds

                collector.on('collect', i => { //If user pick
                    
                    interaction.editReply({components: []}) //Remove Buttons

                });

                collector.on('end', collected => {
                    interaction.editReply({components: []})
                    fs.unlink('./src/database/rolls/'+interaction.member.id+'.json',function(){})
                })
            }

            else if(interaction.commandName == "profile"){
                await interaction.deferReply();
                let args = interaction.options.data;
                users.profile(interaction,args[0].value,args[1].value)
            }

            else if(interaction.commandName == "reset_profile"){
                await interaction.deferReply();
                let args = interaction.options.data;
                let embed = users.reset_profile(interaction,args[0].value)

                interaction.editReply({embeds: [embed]})
            }

            else if(interaction.commandName == "see_card"){
                await interaction.deferReply();
                let args = interaction.options.data;

                let user = {}

                try{
                    user = fs.readFileSync('./src/database/users/'+interaction.member.user.id+'.json')
                    user = JSON.parse(user)
                }
                catch{
                    interaction.editReply({embeds:[cmd_debug.h_error("You can't use this command","003")]})
                    return
                }

                if(!user["inventory"].includes(parseInt(args[0].value)) && !super_admins.includes(interaction.member.user.id)){
                    interaction.editReply({embeds:[cmd_debug.h_error("You can't use this command","003")]})
                    return
                }

                if(args[0].value < 1000){
                    let cards_by_rarity = fs.readFileSync('./src/database/cards.json')
                    cards_by_rarity = JSON.parse(cards_by_rarity)
                    let cards_list = {}
                    Object.values(cards_by_rarity).forEach(card_group => {
                        Object.keys(card_group).forEach(card_id => {
                            cards_list[card_id] = card_group[card_id]
                        })
                    })

                    if(!cards_list[args[0].value]){
                        interaction.editReply({embeds:[cmd_debug.h_error("No card found with this ID","001")]})
                    }
                    else{
                        cards.see_card(interaction,cards_list[args[0].value])
                    }
                }
                else{
                    let nfts = fs.readFileSync('./src/database/nft.json')
                    nfts = JSON.parse(nfts)

                    if(!Object.keys(nfts).includes(args[0].value)){
                        interaction.editReply({embeds:[cmd_debug.h_error("No card found with this ID","001")]})
                    }
                    else{
                        cards.see_nft(interaction,nfts[args[0].value])
                    }
                }
            }
            else if(interaction.commandName == "buy_roll"){
                await interaction.deferReply();
                
                interaction.editReply({embeds: [users.buy_roll(interaction)]})
            }
            else if(interaction.commandName == "upgrade"){
                await interaction.deferReply({ephemeral: true});

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

                users.upgrade(interaction,user)
            }
            else if(interaction.commandName == "buy_card"){
                await interaction.deferReply();
                let args = interaction.options.data;

                cards.buy(interaction,args)
            }
            else if(interaction.commandName == "craft_nft"){
                await interaction.deferReply({ephemeral: true});
                let args = interaction.options.data;

                cards.craft_nft(interaction,args)
            }
        }
    }
    else if (interaction.customId == "pick_1" || interaction.customId == "pick_2" || interaction.customId == "pick_3") {
        await interaction.deferReply();
        let data = fs.readFileSync('./src/database/rolls/'+interaction.member.id+'.json', 'utf8');
        data = JSON.parse(data)

        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');
        users_db = JSON.parse(users_db)

        if(!users_db.includes(interaction.member.user.id)){
            users_db.push(interaction.member.user.id)
            fs.writeFile('./src/database/users.json', JSON.stringify(users_db),function(){});
            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify({"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}),function(){});
        }
        let action = ""

        fs.readFile('./src/database/users/'+interaction.member.id+'.json', (err,user) =>{
            user = JSON.parse(user)

            if(user['inventory'].includes(data[parseInt(interaction.customId.replace('pick_',''))-1]['id'])){
                user['scrap'] = user['scrap']+data[parseInt(interaction.customId.replace('pick_',''))-1]['scrap']*user["upgrade"]["scrap"]
                action = "scrapped"
            }
            else{
                user['inventory'].push(data[parseInt(interaction.customId.replace('pick_',''))-1]['id'])
                action = "stored"
            }
            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){});

            let selected = cards.card_select(interaction,data[parseInt(interaction.customId.replace('pick_',''))-1],action,user['upgrade']['scrap'])
            interaction.editReply({embeds: [selected]})
        });
    }
    else if (interaction.customId == "upgrade_time" || interaction.customId == "upgrade_rarity" || interaction.customId == "upgrade_scrap" || interaction.customId == "upgrade_market") {
        await interaction.deferReply();

        let users_db = fs.readFileSync('./src/database/users.json', 'utf8');
        users_db = JSON.parse(users_db)

        if(!users_db.includes(interaction.member.user.id)){
            users_db.push(interaction.member.user.id)
            fs.writeFile('./src/database/users.json', JSON.stringify(users_db),function(){});
            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify({"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0,"upgrade":{"time":0,"rarity":1,"scrap":1,"market":0}}),function(){});
        }
        let action = ""

        fs.readFile('./src/database/users/'+interaction.member.id+'.json', (err,user) =>{
            user = JSON.parse(user)

            if(interaction.customId == "upgrade_time"){
                if(user["upgrade"]["time"] < 5400000 && user["scrap"] >= 1500){
                    user["upgrade"]["time"] += 900000
                    user["scrap"] -= 1500

                    interaction.editReply({embeds: [users.upgraded("time",user["upgrade"]["time"],interaction)]})
                }
                else{
                    interaction.editReply({embeds: [users.upgraded("fail","",interaction)]})
                }
            }
            else if(interaction.customId == "upgrade_rarity" && user["scrap"] >= 1500){
                if(user["upgrade"]["rarity"] < 6){
                    user["upgrade"]["rarity"] += 1
                    user["scrap"] -= 1500

                    interaction.editReply({embeds: [users.upgraded("rarity",user["upgrade"]["rarity"],interaction)]})
                }
                else{
                    interaction.editReply({embeds: [users.upgraded("fail","",interaction)]})
                }
            }
            else if(interaction.customId == "upgrade_scrap" && user["scrap"] >= 1500){
                if(user["upgrade"]["scrap"] < 3){
                    user["upgrade"]["scrap"] += 0.4
                    user["upgrade"]["scrap"] = Math.round(user["upgrade"]["scrap"]*10)/10
                    user["scrap"] -= 1500

                    interaction.editReply({embeds: [users.upgraded("scrap",user["upgrade"]["scrap"],interaction)]})
                }
                else{
                    interaction.editReply({embeds: [users.upgraded("fail","",interaction)]})
                }
            }
            else if(interaction.customId == "upgrade_market" && user["scrap"] >= 1000000){
                if(user["upgrade"]["market"] < 6){
                    user["upgrade"]["market"] += 1
                    user["scrap"] -= 1000000

                    interaction.editReply({embeds: [users.upgraded("market",user["upgrade"]["market"],interaction)]})
                }
                else{
                    interaction.editReply({embeds: [users.upgraded("fail","",interaction)]})
                }
            }
            else{
                interaction.editReply({embeds: [users.upgraded("fail","",interaction)]})
            }

            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){});
        });
    }
})

//On Error
process.on('unhandledRejection', async (error, promise) => {
    const logs_channel = bot.channels.cache.find(channel => channel.id === "974750922347524127")
    let log = await cmd_debug.error("Request failed", error)
    logs_channel.send({ embeds: [log] })
});

bot.login(token);