const { EmbedBuilder, Events, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "snipe",
  aliases: [],
  category: "info",
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must have \`Manage Messages\` permissions to run this command.`
            ),
        ],
      });
    }

    client.on(Events.MessageDelete, async (deletedMessage) => {
      if (deletedMessage.author?.bot) return;

      const snipeData = {
        content: deletedMessage.content || "No content available",
        author: deletedMessage.author?.tag || "Unknown Author",
        timestamp: deletedMessage.createdTimestamp,
        imageUrl:
          deletedMessage.attachments.size > 0
            ? deletedMessage.attachments.first().url
            : null,
      };

      await client.data.set(
        `snipe_${deletedMessage.guild.id}_${deletedMessage.channel.id}`,
        snipeData
      );
    });

    const snipe = await client.data.get(
      `snipe_${message.guild.id}_${message.channel.id}`
    );

    if (!snipe) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`There are no deleted messages to snipe.`),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setColor(parseInt("0xc7b700", 16))
      .setTitle("Sniped Message")
      .addFields(
        {
          name: `Author`,
          value: `${snipe.author}`,
        },
        {
          name: `Timestamp`,
          value: `${new Date(snipe.timestamp).toLocaleString()}`,
        }
      )
      .setDescription(`**Content**\n${snipe.content}`);

    if (snipe.imageUrl) embed.setImage(snipe.imageUrl);

    message.channel.send({ embeds: [embed] });
  },
};
