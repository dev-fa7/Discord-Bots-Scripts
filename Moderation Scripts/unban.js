const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the discord server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option.setName("userid")
                .setDescription("Discord ID of the user you want to unban.")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const { channel, options } = interaction;

        const requester = interaction.member;
        const userId = options.getString("userid");

        try {
            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setTitle('System')
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setFooter({
                    iconURL: requester.user.displayAvatarURL()
                    , text: `Requested By ${requester.user.tag}`
                })
                .setTimestamp(Date.now())
                .setColor('#00FF00')
                .setDescription(`**<@${userId}> has been removed ban ✅\n تم ازالة الحظر من <@${userId}> ✅**`)

            await interaction.reply({
                embeds: [embed],
            });
        } catch (err) {
            console.log(err);

            const errembed = new EmbedBuilder()
                .setTitle('System')
                .setColor('#FF0000')
                .setDescription(`**We didn't find \`${userId}\` in the Ban list! \n لم نجد \`${userId}\` في قائمة الحظر!**`)


            interaction.reply({ embeds: [errembed], ephemeral: true });
        }
    }
}