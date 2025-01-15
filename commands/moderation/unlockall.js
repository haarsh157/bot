const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unlockall",
  category: "mod",
  premium: true,

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Manage Channels\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (
      message.member.roles.highest.position <=
      message.guild.members.me.roles.highest.position
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `Your highest role must be higher than my highest role to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    let unlocked = 0;
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.channel;

    message.guild.channels.cache.forEach((channel) => {
      if (channel.manageable) {
        setTimeout(() => {
          channel.permissionOverwrites.edit(message.guild.id, {
            SendMessages: true,
            reason: `UNLOCKALL BY ${message.author.tag} (${message.author.id})`,
          });
        }, 5000);

        unlocked++;
      }
    });

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `Successfully **unlocked** ${unlocked} channels from this server.`
          ),
      ],
    });
  },
};
