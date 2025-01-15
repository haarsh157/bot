const {
  Message,
  Client,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const wait = require("wait");

module.exports = {
  name: "unhide",
  aliases: ["unhidechannel", "unlockchannel"],
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
              `${client.emoji.cross} | Please mention a valid channel to unhide.`
            ),
        ],
      });
    }

    const confirmEmbed = new EmbedBuilder()
      .setColor(parseInt("0xc7b700", 16))
      .setDescription(
        `<:emo1:1320351649063108662> | Are you sure you want to unhide the channel **${channel.name}** for the @everyone role?`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("unhide_yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("unhide_no")
        .setLabel("No")
        .setStyle(ButtonStyle.Secondary)
    );

    const confirmationMessage = await message.channel.send({
      embeds: [confirmEmbed],
      components: [row],
    });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = confirmationMessage.createMessageComponentCollector({
      filter,
      time: 15000, 
    });

    collector.on("collect", async (interaction) => {
      try {
        if (interaction.customId === "unhide_yes") {
          await channel.permissionOverwrites.edit(message.guild.id, {
            [PermissionsBitField.Flags.ViewChannel]: true,
          });
          const unhideConfirmationEmbed = new EmbedBuilder()
            .setDescription(
              `${client.emoji.tick} | Successfully unhid the channel **${channel.name}** for the @everyone role.`
            )
            .setColor(parseInt("0xc7b700", 16));

          await confirmationMessage.edit({ embeds: [unhideConfirmationEmbed] });
        } else if (interaction.customId === "unhide_no") {
          const cancelEmbed = new EmbedBuilder()
            .setDescription(`${client.emoji.cross} | Unhide action canceled.`)
            .setColor(parseInt("0xc7b700", 16));

          await confirmationMessage.edit({ embeds: [cancelEmbed] });
        }

        await wait(2000);
        await confirmationMessage.delete();
      } catch (err) {
        console.error("Error handling interaction:", err);
      }
    });

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
