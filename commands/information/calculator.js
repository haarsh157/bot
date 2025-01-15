const { EmbedBuilder } = require("discord.js");
const simplydjs = require("simply-djs");

module.exports = {
  name: "calculator",
  category: "info",
  aliases: ["calc"],
  usage: "!calculator or !calc",
  description: "Opens an interactive calculator for you to use.",
  run: async (client, message, args) => {
    try {
      simplydjs.calculator(message, {
        embed: new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle("Calculator"),
        credit: false,
      });
    } catch (error) {
      console.error("An error occurred while using the calculator:", error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("RED")
            .setDescription(
              "❌ An error occurred while opening the calculator. Please try again later."
            ),
        ],
      });
    }
  },
};
