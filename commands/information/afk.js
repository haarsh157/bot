const { EmbedBuilder } = require("discord.js");
const db = require("../../models/afk.js");
const { category } = require("./help");

module.exports = {
  name: "afk",
  description: "Set's you AFK",
  category: "info",

  run: async (client, message, args) => {
    const noPrefixKey = `noprefix_${message.guild.id}`;
    const noPrefixUsers = (await client.db.get(noPrefixKey)) || [];
    const isNoPrefix = noPrefixUsers.includes(message.author.id);

    if (!isNoPrefix && !message.content.startsWith(client.prefix)) {
      return;
    }

    const data = await db.findOne({
      Guild: message.guildId,
      Member: message.author.id,
    });
    const reason = args.join(" ") ? args.join(" ") : "I'm AFK :)";

    if (data) {
      const embed = new EmbedBuilder()
        .setTitle("You are already AFK!")
        .setColor(parseInt("0xc7b700", 16))
      return message.channel.send({ embeds: [embed] });
    } else {
      const newData = new db({
        Guild: message.guildId,
        Member: message.author.id,
        Reason: reason,
        Time: Date.now(),
      });

      await newData.save();
      const embed = new EmbedBuilder()
        .setDescription(`Your AFK is now set to: **${reason}**`)
        .setColor(parseInt("0xc7b700", 16))
      return message.channel.send({ embeds: [embed] });
    }
  },
};
