const {
  Client,
  Message,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "unbanall",
  aliases: [],
  category: "mod",
  premium: true,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have \`Ban Members\` permissions to use this command.`
            ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I must have \`Ban Members\` permissions to execute this command.`
            ),
        ],
      });
    }

    const isOwner = message.author.id === message.guild.ownerId;
    if (!isOwner && !client.util.hasHigher(message.member)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have a higher role than me to use this command.`
            ),
        ],
      });
    }

    try {
      const bans = await message.guild.bans.fetch();
      if (bans.size === 0) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | There is no one banned in this server.`
              ),
          ],
        });
      }

      let unbannedCount = 0;
      for (const [userId] of bans) {
        await message.guild.members.unban(userId).catch(() => null); 
        unbannedCount++;
      }

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully *unbanned* \`${unbannedCount}\` users from the server.`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | An error occurred while trying to unban users.`
            ),
        ],
      });
    }
  },
};
