const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to be banned')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Provide a reason')
        ),

    async execute(interaction, client) {
        const { channel, options } = interaction;

        const requester = interaction.member;
        const target = options.getUser('target');
        let reason = options.getString('reason');

        const member = await interaction.guild.members.fetch(target.id).catch(console.error);

        const errEmbed = new EmbedBuilder()
            .setTitle('System')
            .setDescription(`You can't take action with ${target.username} Because your highest role position is lower or equal than target highest role position.\n\n  لا يمكنك فعل امر اداري مع ${target.username} بسبب لديه رتبة اعلى او مساويه لرتبتك.`)
            .setColor('Red')
            .setTimestamp(Date.now())

        try {

            if (member.roles.highest.position >= requester.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });

            if (!reason) reason = "No reason provided! | لا يوجد سبب مقدم!";



            await member.ban({
                reason: `${reason} | Banned By ${requester.user.tag}`
            }).catch(console.error);

            const embed = new EmbedBuilder()
                .setTitle('System')
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp(Date.now())
                .setFooter({
                    iconURL: requester.user.displayAvatarURL(),
                    text: `Requested By ${requester.user.tag}`
                })
                .setColor('Red')
                .setDescription(`**<@${target.id}> banned from server ✅\n تم حظر <@${target.id}> من السيرفر ✅**`)
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

            await interaction.reply({ embeds: [embed] });

        } catch (err) {
            interaction.reply({ content: `The member is undefined or he is already banned!\n لم يتم العثور على العضو او العضو محظور بالفعل!`, ephemeral: true })
            return;
        }
    }
}