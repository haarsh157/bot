const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "vclist",
  category: "voice",
  premium: true,

  run: async (client, message, args) => {
    if (!message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`You must be connected to a voice channel first.`),
        ],
      });
    }

    const members =
      message.member.voice.channel.members
        .map((m) => `${m.user.tag} | <@${m.user.id}>`)
        .join("\n") || "No users found in the voice channel.";

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle(
            `**Users in ${message.member.voice.channel.name} - ${message.member.voice.channel.members.size}**`
          )
          .setDescription(members),
      ],
    });
  },
};
