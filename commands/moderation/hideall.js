const {
  Message,
  Client,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "hideall",
  category: "mod",
  premium: true,

  run: async (client, message, args) => {
    // Check for the required permission to manage channels
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

    // Check if the user has a higher role than the bot
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

    let hided = 0;

    // Get the specified channel or default to the current channel
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.channel;

    // Loop through all the channels in the guild and hide them
    message.guild.channels.cache
      .filter((c) => c.name) // Make sure it's a valid channel
      .forEach((channel) => {
        if (channel.manageable) {
          setTimeout(() => {
            // Update permission overwrites for @everyone role to hide the channel
            channel.permissionOverwrites.edit(message.guild.id, {
              [PermissionsBitField.Flags.ViewChannel]: false,
              reason: `HIDEALL BY ${message.author.tag} (${message.author.id})`,
            });
          }, 5000);
          hided++;
        }
      });

    // Send confirmation message with how many channels were hidden
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `Successfully **hidden** ${hided} channels from this server.`
          ),
      ],
    });
  },
};
