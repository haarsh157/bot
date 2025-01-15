const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "vcunmute",
  category: "voice",
  run: async (client, message, args) => {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Mute members\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.MuteMembers
      )
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `I must have \`Mute members\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
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

    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must mention someone whom you want to unmute in your VC.`
            ),
        ],
      });
    }

    if (member.voice.channelId !== message.member.voice.channelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`<@${member.user.id}> is not in your VC.`),
        ],
      });
    }

    try {
      await member.voice.setMute(
        false,
        `${message.author.tag} (${message.author.id})`
      );

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully unmuted <@${member.user.id}> from voice!`
            ),
        ],
      });
    } catch (err) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`I was unable to unmute <@${member.user.id}>.`),
        ],
      });
    }
  },
};
