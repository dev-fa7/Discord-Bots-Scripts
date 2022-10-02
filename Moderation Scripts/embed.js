const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create Embed!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The channel you\'d like to send Embed!')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('set Title!')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('set Description!')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('color')
                .setDescription('set Color!')
                .setRequired(false)
                .addChoices(
                    { name: 'Red', value: '#FF0000' },
                    { name: 'Green', value: '#00FF00' },
                    { name: 'Blue', value: '#0000FF' },
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Yellow', value: '#FFFF00' },
                )
        ),
    async execute(interaction, client) {

        try {

            const channel = interaction.options.getChannel('channel');
            const requester = interaction.member;
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const color = interaction.options.getString('color');


            let embed = new EmbedBuilder()
                .setAuthor({
                    name: `${client.user.tag}`,
                    iconURL: `${client.user.displayAvatarURL()}`
                })
                .setTitle(title)
                .setColor(color)
                .setDescription(description)
                .setTimestamp(Date.now())

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });



            client.channels.cache.get(channel.id).send({ embeds: [embed] })
            interaction.reply({ content: `✅`, ephemeral: true })


        } catch (err) {
            interaction.reply({ content: `Something wnet wrong!\n حدث خطأ ما!`, ephemeral: true })
            return;
        }

    }
}

