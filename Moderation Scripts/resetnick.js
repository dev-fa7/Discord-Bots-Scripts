const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, GuildMemberManager } = require('discord.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('restnick')
        .setDescription('Reset the nickname of a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.ChangeNickname)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member you\'d like to change nickname')
                .setRequired(true)
        ),
    async execute(interaction, client) {

        try {

            const requester = interaction.member;
            const target = interaction.options.getUser('target');

            const member = await interaction.guild.members
                .fetch(target.id)
                .catch(console.error);

            const errEmbed = new EmbedBuilder()
                .setTitle('System')
                .setDescription(`You can't take action with ${target.username} Because your highest role position is lower or equal than target highest role position.\n\n  لا يمكنك فعل امر اداري مع ${target.username} بسبب لديه رتبة اعلى او مساويه لرتبتك.`)
                .setColor('Red')
                .setTimestamp(Date.now())

            if (member.roles.highest.position >= requester.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ChangeNickname)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.ChangeNickname)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });


            member.setNickname(null);

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
                .setThumbnail(target.displayAvatarURL())
                .setTimestamp(Date.now())
                .setColor('Green')
                .setDescription(`<@${target.id}> has been reset his nickname. ✅\n تم استرجاع لقب <@${target.id}> ✅`)

            await interaction.reply({ embeds: [embed] });

        } catch (err) {
            interaction.reply({ content: `Something wnet wrong!\n حدث خطأ ما!`, ephemeral: true })
            return;
        }
    },
};
