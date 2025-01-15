const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "vcdeafenall",
  aliases: ["vcdeafall"],
  category: "voice",
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.DeafenMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must have \`Deafen Members\` permission to use this command.`
            ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionFlagsBits.DeafenMembers
      )
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `I must have \`Deafen Members\` permission to use this command.`
            ),
        ],
      });
    }

    if (!message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`You must be connected to a voice channel first.`),
        ],
      });
    }

    const isOwner = message.author.id === message.guild.ownerId;
    if (
      !isOwner &&
      message.member.roles.highest.position <=
        message.guild.members.me.roles.highest.position
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must have a higher role than me to use this command.`
            ),
        ],
      });
    }

    try {
      let count = 0;

      for (const [memberId, member] of message.member.voice.channel.members) {
        if (!member.voice.deaf) {
          await member.voice.setDeaf(
            true,
            `${message.author.tag} | ${message.author.id}`
          );
          count++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `✅ | Successfully deafened \`${count}\` members in ${message.member.voice.channel}!`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `I don't have the required permissions to deafen members.`
            ),
        ],
      });
    }
  },
};
