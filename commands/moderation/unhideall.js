const { Client, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unhideall",
  category: "mod",
  premium: true,

  run: async (client, message, args) => {
    if (!message.guild) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription("This command cannot be used in DMs."),
        ],
      });
    }

    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)
    ) {
      let error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Manage Channels\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    const userHighestRole = message.member.roles.highest.position;
    const botHighestRole = message.guild.members.me.roles.highest.position;

    if (userHighestRole <= botHighestRole) {
      let error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `Your highest role must be higher than my highest role to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    let unhidden = 0;

    message.guild.channels.cache.forEach((channel) => {
      if (channel && channel.manageable) {
        setTimeout(() => {
          channel.permissionOverwrites
            .edit(message.guild.id, {
              [PermissionsBitField.Flags.ViewChannel]: true,
              reason: `UNHIDEALL BY ${message.author.tag} (${message.author.id})`,
            })
            .catch((err) => {
              console.error(
                `Failed to update permissions for ${channel.name}:`,
                err
              );
            });
        }, 5000);
        unhidden++;
      }
    });

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `Successfully **unhidden** ${unhidden} channels from this server.`
          ),
      ],
    });
  },
};
