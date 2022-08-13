const Discord = require("discord.js")
const messages = require("../utils/message");
const ms = require("ms")
module.exports = {
  name: 'criar',
  description: '🎉 Start a giveaway',

  options: [
    {
      name: 'duração',
      description: 'Quanto tempo o sorteio poderá durar. Exemplo: 1m, 1h, 1d',
      type: 'STRING',
      required: true
    },
    {
      name: 'vencedores',
      description: 'Quantos vencedores poderão ter',
      type: 'INTEGER',
      required: true
    },
    {
      name: 'prêmio',
      description: 'Qual deverá ser o prêmio do sorteio',
      type: 'STRING',
      required: true
    },
    {
      name: 'canal',
      description: 'Canal que hospedará o sorteio',
      type: 'CHANNEL',
      required: true
    },
    {
      name: 'bonusrank',
      description: 'Rank que receberá chances extras',
      type: 'ROLE',
      required: false
    },
    {
      name: 'bonusquantidade',
      description: 'Quantidade de chances que o rank receberá',
      type: 'INTEGER',
      required: false
    },
    {
      name: 'convite',
      description: 'Convite do servidor que será requisito mínimo para entrar no sorteio',
      type: 'STRING',
      required: false
    },
    {
      name: 'rank',
      description: 'Rank mínimo para entrar no sorteio',
      type: 'ROLE',
      required: false
    },
  ],

  run: async (client, interaction) => {

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Você precisa ter as permissões de gerenciamento de mensagens para criar sorteios.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('canal');
    const giveawayDuration = interaction.options.getString('duração');
    const giveawayWinnerCount = interaction.options.getInteger('vencedores');
    const giveawayPrize = interaction.options.getString('prêmio');

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: ':x: Selecione um canal de texto!',
        ephemeral: true
      });
    }
   if(isNaN(ms(giveawayDuration))) {
    return interaction.reply({
      content: ':x: Selecione um tempo de duração válido!',
      ephemeral: true
    });
  }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Selecione uma quantidade válida de ganhadores. Maior ou igual a um.',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrank')
    const bonusEntries = interaction.options.getInteger('bonusquantidade')
    let rolereq = interaction.options.getRole('rank')
    let invite = interaction.options.getString('convite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: Você deve especificar quantas chances de bônus ${bonusRole} irá receber!`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
        return interaction.editReply({
          embeds: [{
            color: "#5964f4",
            author: {
              name: client.user.username,
              iconURL: client.user.displayAvatarURL() 
            },
            title: "Checando servidor",
            description:
              "Ei, ei, ei! Eu vejo um novo servidor! Tem certeza que estou lá? Você precisa me convidar lá para definir isso como um requisito! 😳",
            timestamp: new Date(),
            footer: {
              iconURL: client.user.displayAvatarURL(),
              text: "Checando servidor"
            }
          }]
        })
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**Reaja com "🎉" para participar!**\n>>> - Apenas membros com ${rolereq} estão permitidos a participar desse sorteio!`
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**Reaja com "🎉" para participar!**\n>>> - Apenas membros com ${rolereq} estão permitidos a participar desse sorteio!\n- Membros precisam entrar [neste servidor](${invite}) para participar desse sorteio!`
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**Reaja com "🎉" para participar!**\n>>> - Membros precisam entrar [neste servidor](${invite}) para participar desse sorteio!`
    }


    // start giveaway
    client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      duration: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      // The giveaway winner count
      winnerCount: parseInt(giveawayWinnerCount),
      // BonusEntries If Provided
      bonusEntries: [
        {
          // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Sorteio iniciado em ${giveawayChannel}!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.MessageEmbed()
        .setAuthor({ name: `Alerta de entradas de bônus!` })
        .setDescription(
          `**${bonusRole}** possui **${bonusEntries}** chances a mais de ganhar esse sorteio!`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }

  }

};
