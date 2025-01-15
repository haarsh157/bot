const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "vcunmuteall",
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

    let own = message.author.id === message.guild.ownerId;
    if (
      !own &&
      message.member.roles.highest.position <=
        message.guild.members.me.roles.highest.position
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have a higher role than me to use this command.`
            ),
        ],
      });
    }

    try {
      let i = 0;
      message.member.voice.channel.members.forEach(async (member) => {
        i++;
        await member.voice.setMute(
          false,
          `${message.author.tag} | ${message.author.id}`
        );
        await client.util.sleep(1000);
      });

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully unmuted ${i} members in ${message.member.voice.channel}!`
            ),
        ],
      });
    } catch (err) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `I don't have the required permissions to unmute members.`
            ),
        ],
      });
    }
  },
};
