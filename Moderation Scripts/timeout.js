const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Give timeout to user!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member you\'d like to timeout')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('Set time to timeout a target')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Provide a reason')
        ),
    async execute(interaction, client) {
        const { guild, options } = interaction;

        try {

            let time = options.getString('time');
            const convertedTime = ms(time);
            const requester = interaction.member;
            const target = options.getUser('target');
            let reason = options.getString('reason');
            const member = await guild.members
                .fetch(target.id)
                .catch(console.error);

            if (!reason) reason = "No reason provided! | لا يوجد سبب مقدم!";

            const embed = new EmbedBuilder()
                .setTitle('System')
                .setDescription(`<@${target.id}> has been timedout succesfully ✅\n تم اعطاء <@${target.id}> وقت مستقطع`)
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
                .setColor('Red')
                .addFields([
                    {
                        name: `Target | الهدف`,
                        value: `<@${target.id}>`,
                        inline: true
                    },
                    {
                        name: `Target ID | اي دي الهدف`,
                        value: `\`${target.id}\``,
                        inline: true
                    },
                    {
                        name: `Reason | السبب`,
                        value: `${reason}`,
                        inline: true
                    },
                    {
                        name: `Time | الوقت`,
                        value: `${time}`,
                        inline: true
                    }
                ])

            const errembed = new EmbedBuilder()
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor('Red')
                .setTitle('System')
                .setDescription('Something went wrong, Please try later\n حدث خطأ ما, الرجاء المحاولة لاحقا')
                .setFooter({
                    text: `Requested By ${requester.user.tag}`,
                    iconURL: requester.user.displayAvatarURL()
                })
                .setTimestamp(Date.now())

            const roleEmbed = new EmbedBuilder()
                .setTitle('System')
                .setDescription(`You can't take action with ${target.username} Because your highest role position is lower or equal than target highest role position.\n\n  لا يمكنك فعل امر اداري مع ${target.username} بسبب لديه رتبة اعلى او مساويه لرتبتك.`)
                .setColor('Red')
                .setTimestamp(Date.now())

            if (member.roles.highest.position >= requester.roles.highest.position)
                return interaction.reply({ embeds: [roleEmbed], ephemeral: true });

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) { interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا.`, ephemeral: true }); }
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) { interaction.reply({ content: `You don't have permission to use this. \n ليس لديك صلاحيات لفعل هذا.`, ephemeral: true }); }


            if (!convertedTime) return interaction.reply({ embeds: [errembed], ephemeral: true });


            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            interaction.reply({ content: `Something wnet wrong!\n حدث خطأ ما!`, ephemeral: true })
            return;
        }
    },
};
