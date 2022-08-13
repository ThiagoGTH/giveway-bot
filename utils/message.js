const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "||@everyone||\n\n" : "") +
    "🎉 **SORTEIO** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "||@everyone||\n\n" : "") +
    "🎉 **SORTEIO FINALIZADO** 🎉",
  drawing:  `Termina em: **{timestamp}**`,
  inviteToParticipate: `Reaja com "🎉" para participar!`,
  winMessage: "Parabéns, {winners}! Você receberá **{this.prize}**!",
  embedFooter: "BB-8",
  noWinner: "Sorteio cancelado, não teve nenhuma participação válida.",
  hostedBy: "Realizado por: {this.hostedBy}",
  winners: "Ganhador(es)",
  endedAt: "Finalizado em"
}