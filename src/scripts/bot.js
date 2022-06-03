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
    bot.user.setActivity("/hibouhelp | Working on release 1")
});

bot.on('interactionCreate', async interaction =>{

    if(interaction.isCommand()){

        console.log(`[${new Date().toLocaleString()}] Command : ${interaction.commandName} requested by ${interaction.member.user.username}`)

        if(super_admins.includes(interaction.user.id)){
            if(interaction.commandName == "ping"){
                reply(interaction,cmd_debug.pong(interaction))
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
                    fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify({"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0}),function(){});
                    user = {"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0}
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
                    cards_poll = [cards.pick_card("safe"),cards.pick_card("safe"),cards.pick_card("safe")]
                }
                else{
                    cards_poll = [cards.pick_card("unsafe"),cards.pick_card("unsafe"),cards.pick_card("unsafe")]
                }

                cards.poll_embed(cards_poll,interaction,user["inventory"]) //Send poll of cards

                fs.writeFile('./src/database/rolls/'+interaction.member.id+'.json',JSON.stringify(cards_poll), function(){});
                user['next_roll'] = Date.now()+7200000
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
                users.profile(interaction,args[0].value)
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
            else if(interaction.commandName == "buy_roll"){
                interaction.editReply({embeds: users.buy_roll(interaction)})
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
            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify({"name":interaction.user.username,"role":"User","inventory":[],"scrap":0,"next_roll":0}),function(){});
        }
        let action = ""

        fs.readFile('./src/database/users/'+interaction.member.id+'.json', (err,user) =>{
            user = JSON.parse(user)

            if(user['inventory'].includes(data[parseInt(interaction.customId.replace('pick_',''))-1]['id'])){
                user['scrap'] = user['scrap']+data[parseInt(interaction.customId.replace('pick_',''))-1]['scrap']
                action = "scrapped"
            }
            else{
                user['inventory'].push(data[parseInt(interaction.customId.replace('pick_',''))-1]['id'])
                action = "stored"
            }
            fs.writeFile('./src/database/users/'+interaction.member.id+'.json', JSON.stringify(user),function(){});

            let selected = cards.card_select(interaction,data[parseInt(interaction.customId.replace('pick_',''))-1],action)
            interaction.editReply({embeds: [selected]})
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