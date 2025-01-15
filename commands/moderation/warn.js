const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "warn",
  category: "mod",
  premium: true,
  description: "Warn a user with a specific reason",
  usage: "warn <@user> <reason>",
  run: async (client, message, args) => {
    // Check if the user has permission to warn members
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} You don't have permission to warn members!`
            ),
        ],
      });
    }

    // Get the mentioned user
    const targetUser = message.mentions.members.first();

    // Check if a user was mentioned
    if (!targetUser) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Invalid format. Please use a valid format.\n${message.guild.prefix}warn \`<member>\` \`<reason>\``
            ),
        ],
      });
    }

    // Remove the mention from args and join the rest as the reason
    args.shift();
    const reason = args.join(" ");

    // Check if a reason was provided
    if (!reason) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} Please provide a reason for the warning!`
            ),
        ],
      });
    }

    // Check if trying to warn themselves
    if (targetUser.id === message.author.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`${client.emoji.cross} You cannot warn yourself!`),
        ],
      });
    }

    // Check if trying to warn the bot
    if (targetUser.id === client.user.id) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`${client.emoji.cross} You cannot warn the bot!`),
        ],
      });
    }

    // Check if the target user has a higher role
    if (
      message.member.roles.highest.position < targetUser.roles.highest.position
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} You cannot warn this user as they have a higher or equal role!`
            ),
        ],
      });
    }

    try {
      // Get current warnings count from database
      const warnings =
        (await client.db.get(
          `warnings_${message.guild.id}_${targetUser.id}`
        )) || 0;
      const newWarningCount = warnings + 1;

      // Update warnings in database
      await client.db.set(
        `warnings_${message.guild.id}_${targetUser.id}`,
        newWarningCount
      );

      // Create warning embed for the channel
      const warnEmbed = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `**Warned <@${targetUser.user.id}>** | Reason: ${reason}\nTotal Warnings: ${newWarningCount}`
        );

      // Send the warning embed in the channel
      await message.channel.send({ embeds: [warnEmbed] });

      // Try to DM the warned user
    //   try {
    //     const userEmbed = new EmbedBuilder()
    //     .setTitle("⚠️ You Have Been Warned!!")
    //       .setColor(parseInt("0xc7b700", 16))
    //       .setDescription(
    //         `**Reason: ${reason}\nTotal Warnings: ${newWarningCount}\nWarned By: ${message.author.tag}**`
    //       )
    //       .setTimestamp();

    //     await targetUser.send({ embeds: [userEmbed] });
    //   } catch (error) {
    //     console.log(`Couldn't DM user ${targetUser.user.tag}`);
    //   }
    } catch (error) {
      console.error("Error in warn command:", error);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} There was an error while executing the warning command!`
            ),
        ],
      });
    }
  },
};
