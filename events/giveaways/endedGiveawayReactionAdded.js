const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, member, reaction){
     reaction.users.remove(member.user);
  member.send(`**Oh, droga! Parece que o sorteio já acabou!**`).catch(e => {})
  }
}