const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "addemoji",
  aliases: ["addemote", "steal"],
  cooldown: 5,
  category: "info",
  run: async (client, message, args) => {
    const embedColor=parseInt("0xc7b700", 16);
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageEmojis)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(
              `${client.emoji.cross} | You must have \`Manage Emojis\` permission to use this command.`
            ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ManageEmojis
      )
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(
              `${client.emoji.cross} | I must have \`Manage Emojis\` permission to use this command.`
            ),
        ],
      });
    }

    const emoji = args[0];
    if (!emoji) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(
              `${client.emoji.cross} | You didn't provide any emoji to add.`
            ),
        ],
      });
    }

    const emojiRegex = /<a?:\w+:(\d+)>/;
    const match = emoji.match(emojiRegex);
    if (!match) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(
              `${client.emoji.cross} | You provided an invalid or non-custom emoji.`
            ),
        ],
      });
    }

    const emojiId = match[1];
    const isAnimated = emoji.startsWith("<a:");
    const link = `https://cdn.discordapp.com/emojis/${emojiId}.${
      isAnimated ? "gif" : "png"
    }`;
    const name = args[1] || "stolen_emoji";

    try {
      const newEmoji = await message.guild.emojis.create({
        attachment: link,
        name,
      });
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(
              `${
                client.emoji.tick
              } | Successfully added the emoji ${newEmoji.toString()}.`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription(
              `${client.emoji.cross} | I was unable to add the emoji.\nPossible reasons: \`Mass emojis added\`, \`Slots are full\`.`
            ),
        ],
      });
    }
  },
};
