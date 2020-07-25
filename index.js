const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch')

const discordToken = process.env.DISCORD_BOT_TOKEN
const twitchToken = process.env.TWITCH_OAUTH_TOKEN

var cmdPrefix = "!p";
var alertSent = false

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  var simpChannel = client.channels.cache.get('690014059663458310')
  setInterval(function() {
    pokiStreamUrl = 'https://api.twitch.tv/kraken/streams/44445592'
    fetch(pokiStreamUrl, {
        headers: {
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID': 'zfwmhzfmpxrhdoufl2cwf7z2iqlk6l',
            'Authorization': `Bearer ${twitchToken}`,
        },
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.stream == null) {
          client.user.setActivity('Not Pokimane', { type: 'WATCHING' });
          alertSent = false          
        } else {
          client.user.setActivity('Pokimane', { type: 'WATCHING' });
          if (alertSent == false) {
            simpChannel.send(`@here Poki is online!
${data.stream.channel.game}
https://twitch.tv/pokimane`)
            alertSent = true
          }
        }
    })
  }, 5000)
});

client.on('message', msg => {
  // Simple say command
  var msgArray = msg.content.split(" ");
  var prefix = "";
  var command = "";

  // Get the prefix and the command
  if (msgArray.length >= 2) {
    prefix = msgArray.shift();
    command = msgArray.shift();
  }

  if (prefix === cmdPrefix) { // Only look at messages with the correct command prefix
    if (command === "hello") {
      msg.channel.send("hello");
    }
    else if (command === "say") {
      msg.channel.send(msgArray.join(" "));
    }
    else if (command === "sub") {
      // check for the sub tiers
      if (msgArray.join(" ").toLowerCase() === 'tier 3') {
        const t3embed = new Discord.MessageEmbed()
        console.log(msg)
        t3embed.setTitle('Thanks for the Sub ^_^')
        t3embed.setColor('#b970df')
        t3embed.setDescription(`I reaaallllyyy appreciate the sub <@${msg.author.id}>.`)
        t3embed.setImage('https://media.tenor.com/images/0de2b320fc290bd68a63f55431f9bf4f/tenor.gif')
        msg.channel.send(t3embed)
      } else if (msgArray.join(" ").toLowerCase() === 'tier 2') {
        const t2embed = new Discord.MessageEmbed()
        t2embed.setTitle('Thanks for the sub')
        t2embed.setColor('#b970df')
        t2embed.setDescription(`Thanks, but it won't buy me a new computer`)
        t2embed.setImage('https://thumbs.gfycat.com/BlissfulBriefAngwantibo-max-1mb.gif')
        msg.channel.send(t2embed)
      } else if (msgArray.join(" ").toLowerCase() === 'tier 1') {
        const t1embed = new Discord.MessageEmbed()
        t1embed.setTitle('...')
        t1embed.setColor('#b970df')
        t1embed.setDescription(`Thanks, I guess...`)
        t1embed.setImage('https://www.talkesport.com/wp-content/uploads/tenor-1.gif')
        msg.channel.send(t1embed)
      }
    }
  }
});



client.login(discordToken);
