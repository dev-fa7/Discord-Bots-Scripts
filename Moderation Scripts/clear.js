const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete a messages!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Number of messages to delete!')
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('Select a member to delete their messages!')
                .setRequired(false)
        ),
    async execute(interaction, client) {

        try {

            const { channel, options } = interaction;
            const target = options.getUser('target');
            const amount = options.getInteger('amount');
            const messages = await channel.messages.fetch()
            const requester = interaction.member;

            let embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTimestamp(Date.now())
                .setTitle('Sysetm')
                .setAuthor({
                    name: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                })
                .setFooter({
                    iconURL: requester.user.displayAvatarURL(),
                    text: `Requested By ${requester.user.tag}`
                })


            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: `I don't have permission to do this.\n ليس لدي صلاحيات لفعل هذا الامر.`, ephemeral: true });
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: `You don't have permission to use this.\n ليس لديك صلاحيات لفعل هذا الامر.`, ephemeral: true });

            if (amount <= 100) {

                if (target) {
                    const member = await interaction.guild.members.fetch(target.id).catch(console.error);
                    const errEmbed = new EmbedBuilder()
                        .setTitle('System')
                        .setDescription(`You can't take action with ${target.username} Because your highest role position is lower or equal than target highest role position.\n\n  لا يمكنك فعل امر اداري مع ${target.username} بسبب لديه رتبة اعلى او مساويه لرتبتك.`)
                        .setColor('Red')
                        .setTimestamp(Date.now())


                    if (member.roles.highest.position >= requester.roles.highest.position)
                        return interaction.reply({ embeds: [errEmbed], ephemeral: true });

                    let i = 0;
                    const filtered = [];

                    (await messages).filter((msg) => {
                        if (msg.author.id === target.id && amount > i) {
                            filtered.push(msg);
                            i++;
                        }
                    });

                    await channel.bulkDelete(filtered).then(messages => {
                        embed.setDescription(`Succesfully deleted ${messages.size} messages from ${target}. ✅\n تم حذف ${messages.size} رسالة من ${target} ✅`).setThumbnail(target.displayAvatarURL());
                        interaction.reply({ embeds: [embed], ephemeral: true });
                    });
                } else {
                    await channel.bulkDelete(amount, true).then(messages => {
                        embed.setDescription(`Succesfully deleted ${messages.size} messages from the channel. ✅\n تم حذف ${messages.size} رسالة من الشات بنجاح ✅`);
                        interaction.reply({ embeds: [embed], ephemeral: true });
                    });
                }

            } else if (amount > 100) {

                embed = new EmbedBuilder()
                    .setTitle('System')
                    .setDescription(`You can't delete ${amount} messages at once!\n لا يمكنك حذف ${amount} رسالة مره وحده`)
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp(Date.now())
                    .setColor('Red')

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {

                embed = new EmbedBuilder()
                    .setTitle('System')
                    .setDescription(`Please select amount of messages to delete, You can't delete ${amount} message.`)
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp(Date.now())
                    .setColor('Red')

                await interaction.reply({ embeds: [embed], ephemeral: true });


            }

        } catch (err) {
            interaction.reply({ content: `Something went wrong!\n حدث خطأ ما!`, ephemeral: true })
            return;
        }

    }
}