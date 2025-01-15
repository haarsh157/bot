const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "vckickall",
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

    if (
      message.member.roles.highest.position <=
        message.guild.members.me.roles.highest.position &&
      message.author.id !== message.guild.ownerId
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

      for (const member of message.member.voice.channel.members.values()) {
        count++;
        await member.voice.disconnect(
          `${message.author.tag} (${message.author.id})`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
      }

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `✅ Successfully disconnected ${count} members from ${message.member.voice.channel}!`
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
              `An error occurred while disconnecting members. Ensure I have the proper permissions.`
            ),
        ],
      });
    }
  },
};
