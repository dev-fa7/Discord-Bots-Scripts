const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('🔒 Disable @everyone sending message in the channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction, client) {

        try {

            const requester = interaction.member;
            const channel = interaction.channel;

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });

            channel.permissionOverwrites.edit(interaction.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"), {
                "SendMessages": false,
                "AddReactions": false,
                "SendTTSMessages": false,
                "AttachFiles": false,
                "CreatePublicThreads": false,
                "CreatePrivateThreads": false,
                "SendMessagesInThreads": false,
            })

            const embed = new EmbedBuilder()
                .setTitle('System')
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setFooter({
                    iconURL: requester.user.displayAvatarURL(),
                    text: `Requested By ${requester.user.tag}`
                })
                .setTimestamp(Date.now())
                .setColor('Red')
                .setDescription(`<#${channel.id}> has been lock it`)
            await interaction.reply({ embeds: [embed], });

        } catch (err) {
            interaction.reply({ content: `Something wnet wrong!\n حدث خطأ ما!`, ephemeral: true })
            return;
        }
    },
};


