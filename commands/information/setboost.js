const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("../../models/boost.js");

module.exports = {
  name: "setboost",
  aliases: ["boost"],
  category: "info",
  run: async (client, message, args) => {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${
                client.emoji.cross || `${client.emoji.cross}`
              } | You must have \`Administrator\` permissions to run this command.`
            ),
        ],
      });
    }

    const disable = args[0]?.toLowerCase() === "off";
    let channel, hasPerms;

    if (!disable) {
      channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]);
      if (!channel) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${
                  client.emoji.cross || `${client.emoji.cross}`
                } | You didn't provide a valid channel.`
              ),
          ],
        });
      }

      hasPerms = channel
        .permissionsFor(message.guild.members.me)
        .has(PermissionsBitField.Flags.SendMessages);

      if (!hasPerms) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${
                  client.emoji.cross || `${client.emoji.cross}`
                } | I don't have permission to send messages in <#${
                  channel.id
                }>.`
              ),
          ],
        });
      }
    }

    let data = await db.findOne({ Guild: message.guildId });
    if (!data) {
      data = new db({
        Guild: message.guild.id,
        Boost: disable ? null : channel.id,
      });
    } else {
      data.Boost = disable ? null : channel.id;
    }
    await data.save();

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            disable
              ? `${
                  client.emoji.tick || `${client.emoji.tick}`
                } | I'll no longer send messages when someone boosts the server.`
              : `${client.emoji.tick || `${client.emoji.tick}`} | I'll now send messages to <#${
                  channel.id
                }> when someone boosts the server.`
          ),
      ],
    });
  },
};
