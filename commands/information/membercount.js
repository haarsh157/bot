const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "membercount",
  aliases: ["mc"],
  category: "info",
  premium: true,
  permissions: [PermissionFlagsBits.SendMessages],
  run: async (client, message, args) => {
    const guild = message.guild;

    const members = await guild.members.fetch();

    const totalMembers = guild.memberCount;
    const bots = members.filter((member) => member.user.bot).size;
    const humans = totalMembers - bots;

    const embed = new EmbedBuilder()
      .setColor(0xc7b700)
      .setTitle(`${guild.name} Member Statistics`)
      .setDescription(
        `**Total Members:** ${totalMembers}\n` +
          `**Humans:** ${humans}\n` +
          `**Bots:** ${bots}`
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${message.author.tag}` });

    await message.reply({ embeds: [embed] });
  },
};
