const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "servericon",
  aliases: ["serverav", "serveravatar"],
  category: "info",
  premium: true,

  run: async (client, message, args) => {
    const iconURL = message.guild.iconURL({ dynamic: true, size: 2048 });

    if (!iconURL) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription("❌ | This server does not have an icon."),
        ],
      });
    }

    const embed = new EmbedBuilder()
      .setDescription(
        `[\`PNG\`](${message.guild.iconURL({
          size: 2048,
          format: "png",
        })}) | [\`JPG\`](${message.guild.iconURL({
          size: 2048,
          format: "jpg",
        })}) | [\`WEBP\`](${message.guild.iconURL({
          size: 2048,
          format: "webp",
        })})`
      )
      .setColor(parseInt("0xc7b700", 16))
      .setImage(iconURL);

    message.channel.send({ embeds: [embed] });
  },
};
