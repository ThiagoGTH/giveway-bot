const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved =  new Discord.MessageEmbed()
    .setTimestamp()
    .setColor("#5964f4")
    .setTitle("Participação registrada!")
    .setDescription(
      `Sua participação no [sorteio](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) foi registrada!`
    )
    .setTimestamp()
   let denied =  new Discord.MessageEmbed()
    .setTimestamp()
    .setColor("#5964f4")
    .setTitle("Ops, ocorreu um erro!")
    .setDescription(
      `Sua participação no [sorteio](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) não foi registrada, revise os requisitos para participar do sorteio.`
    )

    let client = messageReaction.message.client
    if (reactor.user.bot) return;
    if(giveaway.extraData) {
      if (giveaway.extraData.server !== "null") {
        try { 
        await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
        return reactor.send({
          embeds: [approved]
        });
        } catch(e) {
          messageReaction.users.remove(reactor.user);
          return reactor.send({
            embeds: [denied]
          }).catch(e => {})
        }
      }
      if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)){ 
        messageReaction.users.remove(reactor.user);
        return reactor.send({
          embeds: [denied]
        }).catch(e => {})
      }

      return reactor.send({
        embeds: [approved]
      }).catch(e => {})
    } else {
        return reactor.send({
          embeds: [approved]
        }).catch(e => {})
    }
    }
  }
