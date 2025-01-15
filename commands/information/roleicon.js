const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "roleicon",
  category: "info",
  premium: true,
  run: async (client, message, args) => {
    const responseEmbed = new EmbedBuilder().setColor(parseInt("0xc7b700", 16));
    const own = message.author.id === message.guild.ownerId;

    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | You must have \`Manage Roles\` permissions to use this command.`
          ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)
    ) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | I don't have \`Manage Roles\` permissions to execute this command.`
          ),
        ],
      });
    }

    if (
      !own &&
      message.member.roles.highest.position <=
        message.guild.members.me.roles.highest.position
    ) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | You must have a higher role than me to use this command.`
          ),
        ],
      });
    }

    const boostLevel = message.guild.premiumTier; // Now an integer in Discord.js v14.
    if (boostLevel < 2) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | Your server doesn't meet the **Role Icon** requirements. Servers with Level **2** boosts or higher can set role icons.`
          ),
        ],
      });
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | Usage: \`${
              message.guild.prefix || "/"
            }roleicon <role> <emoji>\``
          ),
        ],
      });
    }

    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(`${client.emoji.cross} | Please provide a valid role.`),
        ],
      });
    }

    if (!role.editable) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | I cannot modify the role \`${role.name}\` as it is higher than my highest role.`
          ),
        ],
      });
    }

    if (role.iconURL() && !args[1]) {
      try {
        await role.setIcon(null);
        return message.channel.send({
          embeds: [
            responseEmbed.setDescription(
              `${client.emoji.tick} | Successfully removed the icon from \`${role.name}\`.`
            ),
          ],
        });
      } catch (err) {
        return message.channel.send({
          embeds: [
            responseEmbed.setDescription(
              `${client.emoji.cross} | An error occurred while trying to remove the icon from \`${role.name}\`.`
            ),
          ],
        });
      }
    }

    if (!args[1]) {
      return message.channel.send({
        embeds: [responseEmbed.setDescription(`${client.emoji.cross} | Please provide an emoji.`)],
      });
    }

    const emojiRegex = /<a?:\w{2,}:\d{17,20}>/g;
    if (!args[1].match(emojiRegex)) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | Please provide a valid custom emoji.`
          ),
        ],
      });
    }

    const emojiID = args[1].replace(/[^0-9]/g, "");
    const baseUrl = `https://cdn.discordapp.com/emojis/${emojiID}`;
    try {
      await role.setIcon(baseUrl);
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.tick} | Successfully set the icon for \`${role.name}\`.`
          ),
        ],
      });
    } catch (err) {
      return message.channel.send({
        embeds: [
          responseEmbed.setDescription(
            `${client.emoji.cross} | An error occurred while trying to set the icon for \`${role.name}\`.`
          ),
        ],
      });
    }
  },
};
