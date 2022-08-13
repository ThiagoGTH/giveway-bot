const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, member) {
    return member.send({
      embeds: [new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle('Eita... você removeu sua entrada do sorteio?')
        .setColor("#5964f4")
        .setDescription(
          `Sua participação no [sorteio](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) foi registrada, mas você saiu dele. Já que você não precisa do **${giveaway.prize}**, vou ter que escolher outra pessoa para ganhar 😭`
        )
        .setFooter({ text: "Acha que foi um erro? Participe novamente!" })
      ]
    }).catch(e => {})

  }
}
