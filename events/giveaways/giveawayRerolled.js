const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.MessageEmbed()
          .setTitle(`Rufem os tambores, temos um NOVO vencedor!`)
          .setColor("#5964f4")
          .setDescription(`Bip-bip-bop-bip-bop-bip, ${member.user}.\nMe contaram que refizeram  **[[um sorteio aí]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** e você ganhou.\nMas então, parabéns por ganhar **${giveaway.prize}!**\nMande uma mensagem para o realizador do sorteio para resgatar seu prêmio.`)

          .setTimestamp()
          .setFooter({
            text: `${member.user.username}`, 
            iconURL: member.user.displayAvatarURL()
          })
        ]
      }).catch(e => {})
    });
  }
}
