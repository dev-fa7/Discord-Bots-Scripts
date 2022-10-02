const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from server')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('Target to be kicked!')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Provide a reason!')
        ),

    async execute(interaction, client) {
        const { channel, options } = interaction;

        try {

            const requester = interaction.member;
            const target = options.getUser('target');
            let reason = options.getString('reason' || "No reason provided!");

            const member = await interaction.guild.members.fetch(target.id).catch(console.error);

            const errEmbed = new EmbedBuilder()
                .setTitle('System')
                .setDescription(`You can't take action with ${target.username} Because your highest role position is lower or equal than target highest role position.\n\n  لا يمكنك فعل امر اداري مع ${target.username} بسبب لديه رتبة اعلى او مساويه لرتبتك.`)
                .setColor('Red')
                .setTimestamp(Date.now())

            if (member.roles.highest.position >= requester.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });

            if (!reason) reason = "No reason provided! | لا يوجد سبب مقدم!";

            await member.kick(reason);

            const embed = new EmbedBuilder()
                .setTitle('System')
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp(Date.now())
                .setColor('Red')
                .setFooter({
                    iconURL: requester.user.displayAvatarURL(),
                    text: `Requested By ${requester.user.tag}`
                })
                .setThumbnail(target.displayAvatarURL())
                .setDescription(`**<@${target.id}> kicked from server ✅\n تم طرد <@${target.id}> من السيرفر ✅**`)
                .addFields([
                    {
                        name: `Username | اسم المستخدم`,
                        value: `\`${target.tag}\``,
                        inline: true
                    },
                    {
                        name: `UserID | اي دي المستخدم`,
                        value: `\`${target.id}\``,
                        inline: true
                    },
                    {
                        name: `Reason | السبب`,
                        value: `\`${reason}\``,
                        inline: true
                    }
                ])

            await interaction.reply({ embeds: [embed] })

        } catch (err) {
            interaction.reply({ content: `The member is undefined!\n لم يتم العثور على العضو!`, ephemeral: true })
            return;
        }
    }

}