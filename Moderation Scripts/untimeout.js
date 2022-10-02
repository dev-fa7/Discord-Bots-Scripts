const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove timeout from a member!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member you\'d like to remove timeout')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const { guild, options } = interaction;

        try {

            const requester = interaction.member;
            const target = options.getUser('target');
            const member = await guild.members
                .fetch(target.id)
                .catch(console.error);

            const embed = new EmbedBuilder()
                .setTitle('System')
                .setDescription(`<@${target.id}> has been removed timeout.✅\n تم ازالة الوقت المستقطع من <@${target.id}> ✅`)
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setFooter({
                    iconURL: requester.user.displayAvatarURL(),
                    text: `Requested By ${requester.user.tag}`
                })
                .setTimestamp(Date.now())
                .setThumbnail(target.displayAvatarURL())
                .setColor('Green')


            const errEmbed = new EmbedBuilder()
                .setTitle('System')
                .setDescription(`You can't take action with ${target.username} Because your highest role position is lower or equal than target highest role position.\n\n  لا يمكنك فعل امر اداري مع ${target.username} بسبب لديه رتبة اعلى او مساويه لرتبتك.`)
                .setColor('Red')
                .setTimestamp(Date.now())

            if (member.roles.highest.position >= requester.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });


            await member.timeout(null);

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            interaction.reply({ content: `Something wnet wrong!\n حدث خطأ ما!`, ephemeral: true })
            return;
        }
    },
};
