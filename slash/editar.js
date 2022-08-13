module.exports = {
    name: 'editar',
    description: '🎉 Edita um sorteio',

    options: [
        {
            name: 'sorteio',
            description: 'O sorteio a ser editado (ID da mensagem)',
            type: 'STRING',
            required: true
        },
        {
            name: 'tempo',
            description: 'Quanto tempo o sorteio irá durar. Ex: 1h, 1m, 1s.',
            type: 'STRING',
            required: true
        },
        {
            name: 'vencedores',
            description: 'Quantidade de vencedores',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'prêmio',
            description: 'What the prize of the giveaway should be',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Você precisa ter as permissões de gerenciamento de mensagens para editar sorteios.',
                ephemeral: true
            });
        }

        const gid = interaction.options.getString('sorteio');
        const time = interaction.options.getString('duração');
        const winnersCount = interaction.options.getInteger('vencedores');
        const prize = interaction.options.getString('prêmio');
        
        await interaction.deferReply({
         ephemeral: true
        })
        // Edit the giveaway
        try {
        await client.giveawaysManager.edit(gid, {
            newWinnersCount: winnersCount,
            newPrize: prize,
            addTime: time
        })
        } catch(e) {
return interaction.editReply({
            content:
                `Nenhum sorteio foi encontrado na mensagem de ID: \`${gid}\``,
            ephemeral: true
        });
        }
        interaction.editReply({
            content:
                `Esse sorteio foi editado!`,
            ephemeral: true
        });
    }

};