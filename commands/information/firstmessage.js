const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "firstmsg",
  aliases: ["firstmessage"],
  category: "info",
  run: async (client, message, args) => {
    try {
      const fetchMessages = await message.channel.messages.fetch({
        after: 1,
        limit: 1,
      });
      const msg = fetchMessages.first();

      const embed = new EmbedBuilder()
        .setTitle(`First Message in ${message.guild.name}`)
        .setURL(msg.url)
        .setDescription(`Content: ${msg.content || "No content"}`)
        .addFields(
          { name: "Author", value: `${msg.author.tag}`, inline: true },
          { name: "Message ID", value: `${msg.id}`, inline: true },
          {
            name: "Created At",
            value: `${msg.createdAt.toLocaleDateString()}`,
            inline: false,
          }
        )
        .setColor(parseInt("0xc7b700", 16)); // Default color in case client.color is undefined

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching the first message:", error);
      message.channel.send(
        "Could not fetch the first message. Please try again."
      );
    }
  },
};
