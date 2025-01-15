const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "vcundeafen",
  aliases: ["vcundeaf"],
  category: "voice",
  run: async (client, message, args) => {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Deafen members\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.DeafenMembers
      )
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `I must have \`Deafen members\` permission to use this command.`
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
              `You must mention someone whom you want to undeafen in your vc.`
            ),
        ],
      });
    }

    if (
      !member.voice.channel ||
      member.voice.channel.id !== message.member.voice.channel.id
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `<@${member.user.id}> is not in your voice channel.`
            ),
        ],
      });
    }

    try {
      await member.voice.setDeaf(
        false,
        `${message.author.tag} (${message.author.id})`
      );

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully undeafened <@${member.user.id}> from voice!`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`I was unable to undeafen <@${member.user.id}>.`),
        ],
      });
    }
  },
};
