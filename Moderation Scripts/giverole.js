const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giverole')
        .setDescription('Give role to user to add it to him!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member you\'d like to add role to him')
                .setRequired(true)
        ).addRoleOption(option =>
            option
                .setName("role")
                .setDescription('The role you want to add to the member')
                .setRequired(true)
        ),
    async execute(interaction, client) {

        try {

            const requester = interaction.member;
            const target = interaction.options.getUser('target');
            const role = interaction.options.getRole('role')
            const member = await interaction.guild.members
                .fetch(target.id)
                .catch(console.error)

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: `I don't have permission to do this.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: `You don't have permission to use this.`, ephemeral: true });

            member.roles.add(role)

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
                .setThumbnail(target.displayAvatarURL())
                .setColor('Green')
                .setDescription(`<@${target.id}> has been add it ${role}`)
            await interaction.reply({ embeds: [embed] });

        } catch (err) {

            const errEmbed = new EmbedBuilder()
                .setTitle('System')
                .setDescription('**Something went wrong.\n حدث خطأ ما**')
                .setTimestamp(Date.now())

            console.log(err);
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }







    },
};
