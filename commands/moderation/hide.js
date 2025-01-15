const {
  Message,
  Client,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const wait = require("wait"); // Import the wait module

module.exports = {
  name: "hide",
  aliases: ["hidechannel", "lockchannel"],
  category: "mod",
  premium: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have \`Manage Channels\` permissions to use this command.`
            ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I must have \`Manage Channels\` permissions to use this command.`
            ),
        ],
      });
    }

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Please mention a valid channel to hide.`
            ),
        ],
      });
    }

    const confirmEmbed = new EmbedBuilder()
      .setColor(parseInt("0xc7b700", 16))
      .setDescription(
        `<:emo1:1320351649063108662> | Are you sure you want to hide the channel **${channel.name}** from the @everyone role?`
      );

    // Creating the buttons (Yes and No)
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("hide_yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("hide_no")
        .setLabel("No")
        .setStyle(ButtonStyle.Secondary)
    );

    // Sending the message with buttons
    const confirmationMessage = await message.channel.send({
      embeds: [confirmEmbed],
      components: [row],
    });

    // Collecting button interaction
    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = confirmationMessage.createMessageComponentCollector({
      filter,
      time: 15000, // 15 seconds timeout
    });

    collector.on("collect", async (interaction) => {
      try {
        if (interaction.customId === "hide_yes") {
          // Hide the channel for @everyone role using correct permissions flag
          await channel.permissionOverwrites.edit(message.guild.id, {
            [PermissionsBitField.Flags.ViewChannel]: false, // Hiding the channel
          });
          const hideConfirmationEmbed = new EmbedBuilder()
            .setDescription(
              `${client.emoji.tick} | Successfully hidden the channel **${channel.name}** from the @everyone role.`
            )
            .setColor(parseInt("0xc7b700", 16));

          // Edit the confirmation message to show hide success
          await confirmationMessage.edit({ embeds: [hideConfirmationEmbed] });
        } else if (interaction.customId === "hide_no") {
          // User decided not to hide the channel
          const cancelEmbed = new EmbedBuilder()
            .setDescription(`${client.emoji.cross} | Hide action canceled.`)
            .setColor(parseInt("0xc7b700", 16));

          // Edit the confirmation message to show cancellation
          await confirmationMessage.edit({ embeds: [cancelEmbed] });
        }

        // Wait for 2 seconds before deleting the confirmation message
        await wait(2000); // Wait for 2 seconds
        await confirmationMessage.delete(); // Delete the confirmation message after 2 seconds
      } catch (err) {
        console.error("Error handling interaction:", err);
      }
    });

    // Timeout message for no response
    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        const timeoutEmbed = new EmbedBuilder()
          .setDescription(`${client.emoji.cross} | The action timed out.`)
          .setColor(parseInt("0xc7b700", 16));
        confirmationMessage.edit({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
};
