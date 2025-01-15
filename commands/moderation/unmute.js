const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "unmute",
  aliases: ["untimeout"],
  category: "mod",
  premium: true,
  run: async (client, message, args) => {
    // Check if member has the permission either directly or via roles
    if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have \`Moderate Members\` permissions to use this command.`
            ),
        ],
      });
    }

    // Check bot permissions
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I must have \`Moderate Members\` permissions to run this command.`
            ),
        ],
      });
    }

    const member = message.mentions.members.first() || 
                   message.guild.members.cache.get(args[0]);
    
    if (!member) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You didn't mention the member whom you want to unmute.`
            ),
        ],
      });
    }

    // Check if the bot's role is higher than the target's role
    if (message.guild.members.me.roles.highest.position <= member.roles.highest.position) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | My highest role must be above the target member's highest role.`
            ),
        ],
      });
    }

    // Check if the command user's role is higher than the target's role
    if (message.member.roles.highest.position < member.roles.highest.position) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Your highest role must be above the target member's highest role.`
            ),
        ],
      });
    }

    let reason = args.slice(1).join(" ").trim();
    if (!reason) reason = "No Reason";
    reason = `${message.author.tag} (${message.author.id}) | ${reason}`;

    try {
      if (!member.communicationDisabledUntilTimestamp || 
          member.communicationDisabledUntilTimestamp < Date.now()) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | This user is not muted.`
              ),
          ],
        });
      }

      await member.timeout(null, reason);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully unmuted ${member.user.tag}!`
            ),
        ],
      });
    } catch (error) {
      console.error('Unmute error:', error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | An error occurred while trying to unmute the member.`
            ),
        ],
      });
    }
  },
};