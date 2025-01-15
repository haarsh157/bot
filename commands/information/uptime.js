const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "uptime",
  category: "info",
  premium: true,

  run: async (client, message, args) => {
    const duration1 = Math.round((Date.now() - message.client.uptime) / 1000);
    const embed = new EmbedBuilder();
    embed.setColor(parseInt("0xc7b700", 16));
    embed.setDescription(`I am online from <t:${duration1}:R>`);
    message.channel.send({ embeds: [embed] });
  },
};
