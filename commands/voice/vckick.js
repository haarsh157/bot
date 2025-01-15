const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "vckick",
  category: "voice",
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.MoveMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must have \`Move Members\` permission to use this command.`
            ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(PermissionFlagsBits.MoveMembers)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `I must have \`Move Members\` permission to use this command.`
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

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must mention someone whom you want to kick from your voice channel.`
            ),
        ],
      });
    }

    if (!member.voice.channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`<@${member.user.id}> is not in a voice channel.`),
        ],
      });
    }

    try {
      await member.voice.disconnect();
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully kicked <@${member.user.id}> from the voice channel!`
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
              `I was unable to kick <@${member.user.id}> from the voice channel.`
            ),
        ],
      });
    }
  },
};
