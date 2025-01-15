const {
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "vcmove",
  category: "voice",
  run: async (client, message, args) => {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Move Members\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.MoveMembers
      )
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `I must have \`Move Members\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (args.length < 2) {
      const usage = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `**Usage:** \`/vcmove @user <voiceChannel>\`\n\n` +
            `Move a user to the specified voice channel. Make sure to mention the user and provide the target voice channel.`
        );
      return message.channel.send({ embeds: [usage] });
    }

    const user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    const voiceChannel =
      message.guild.channels.cache.get(args[1]) || message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You must specify or be in a valid voice channel first.`
            ),
        ],
      });
    }

    if (voiceChannel.type !== ChannelType.GuildVoice) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`Please provide a valid voice channel.`),
        ],
      });
    }

    if (!user) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`Please mention a user who is in a voice channel.`),
        ],
      });
    }

    if (!user.voice.channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `The mentioned user is not connected to any voice channel.`
            ),
        ],
      });
    }

    try {
      await user.voice.setChannel(voiceChannel);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `Successfully moved <@${user.id}> to **${voiceChannel.name}**.`
            ),
        ],
      });
    } catch (error) {
      console.error(error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `I was unable to move the user to the specified voice channel.`
            ),
        ],
      });
    }
  },
};
