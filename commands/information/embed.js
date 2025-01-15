const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "embed",
  category: "info",
  premium: true,
  run: async (client, message, args) => {
    const prefix = message.guild.prefix || "=";

    if (!args[0]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Command usage:\n` +
                `\`${prefix}embed $color$ $title$ $description$ $thumbnail$ $image$ $author$ $footer$\``
            ),
        ],
      });
    }

    const content = args.join(" ");

    const regex = /\$(.*?)\$(?=(?:[^$]*\$|$))/gs;
    const matches = [...content.matchAll(regex)];

    const embedData = {
      color: matches[0]?.[1].trim() || "#c7b700",
      title: matches[1]?.[1].trim() || "",
      description: matches[2]?.[1].trim() || "",
      thumbnail: matches[3]?.[1].trim() || "",
      image: matches[4]?.[1].trim() || "",
      author: matches[5]?.[1].trim() || "",
      footer: matches[6]?.[1].trim() || "",
    };

    try {
      const embed = new EmbedBuilder();

      if (embedData.color.startsWith("#")) {
        embed.setColor(parseInt(embedData.color.replace("#", ""), 16));
      } else {
        embed.setColor(embedData.color);
      }

      if (embedData.title) embed.setTitle(embedData.title);
      if (embedData.description) embed.setDescription(embedData.description);
      if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail);
      if (embedData.image) embed.setImage(embedData.image);
      if (embedData.author) embed.setAuthor({ name: embedData.author });
      if (embedData.footer) embed.setFooter({ text: embedData.footer });

      await message.channel.send({ embeds: [embed] });

      if (message.deletable) {
        await message.delete();
      }
    } catch (error) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `${client.emoji.cross} | An error occurred while creating the embed.\n` +
                `Please check your inputs and try again.`
            ),
        ],
      });
      console.error("Embed creation error:", error);
    }
  },
};
