const { Message, Client, EmbedBuilder } = require("discord.js");
const { alias, category, premium } = require("../information/help");

module.exports = {
  name: "prefix",
  aliases: ["setprefix", "sp"],
  category: "mod",
  premium: true,

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    if (!message.member.permissions.has("Administrator")) {
      return message.channel.send(
        "You must have `Administration` perms to change the prefix of this server."
      );
    }
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`00e3ff`)
            .setDescription(`You didn't provided the new prefix.`),
        ],
      });
    }
    if (args[1]) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`0xc7b700`)
            .setDescription("You can not set prefix a double argument"),
        ],
      });
    }
    if (args[0].length > 3) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`00e3ff`)
            .setDescription("You can not send prefix more than 3 characters"),
        ],
      });
    }
    if (args.join("") === "&") {
      client.db.delete(`prefix_${message.guild.id}`);
      const embed = new EmbedBuilder()
        .setDescription("Reseted Prefix")
        .setColor("00e3ff");
      return await message.channel.send({ embeds: [embed] });
    }

    await client.db.set(`prefix_${message.guild.id}`, args[0]);
    client.util.setPrefix(message, client);
    const embed = new EmbedBuilder()
      .setColor("0xc7b700")
      .setDescription(`New Prefix For This Server Is ${args[0]}`);
    await message.channel.send({ embeds: [embed] });
  },
};
