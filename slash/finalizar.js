module.exports = {
    name: "finalizar",
    description: '🎉 Encerrar um sorteio já em execução',

    options: [
        {
            name: 'sorteio',
            description: 'O sorteio a ser encerrado (ID da mensagem)',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Você precisa ter as permissões de gerenciamento de mensagens para iniciar sorteios.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('sorteio');

        // fetching the giveaway with message Id or prize
        const giveaway =
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway Id
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found with the corresponding input
        if (!giveaway) {
            return interaction.reply({
                content: 'Não foi possível encontrar um sorteio para `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'Esse sorteio já foi finalizado!',
                ephemeral: true
            });
        }

        // Edit the giveaway
        client.giveawaysManager.end(giveaway.messageId)
            // Success message
            .then(() => {
                // Success message
                interaction.reply(`**[Um sorteio](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** foi finalizado!`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });

    }
};