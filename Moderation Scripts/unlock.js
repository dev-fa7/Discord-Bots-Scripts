const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('🔓 Allow @everyone sending message in the channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction, client) {

        try {

            const requester = interaction.member;
            const channel = interaction.channel;

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });

            channel.permissionOverwrites.edit(interaction.guild.roles.cache.find(e => e.name.toLowerCase().trim() == "@everyone"), {
                "SendMessages": true,
                "AddReactions": true,
                "SendTTSMessages": false,
                "AttachFiles": true,
                "CreatePublicThreads": true,
                "CreatePrivateThreads": true,
                "SendMessagesInThreads": true,
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
                .setColor('Green')
                .setDescription(`<#${channel.id}> has been unlock it✅\n تم فتح روم <#${channel.id}> ✅`)
            await interaction.reply({ embeds: [embed], });

        } catch (err) {
            interaction.reply({ content: `Something wnet wrong!\n حدث خطأ ما!`, ephemeral: true })
            return;
        }
    },
};


