const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "vcdeafen",
  aliases: ["vcdeaf"],
  category: "voice",
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.DeafenMembers)) {
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
        PermissionsBitField.DeafenMembers
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

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must mention someone whom you want to deafen in your VC.`
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
      await member.voice.setDeaf(
        true,
        `${message.author.tag} (${message.author.id})`
      );
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully deafened <@${member.user.id}> in the voice channel!`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `I was unable to deafen <@${member.user.id}> in the voice channel.`
            ),
        ],
      });
    }
  },
};
