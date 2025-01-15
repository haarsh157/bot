const {
  Client,
  Message,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const wait = require("util").promisify(setTimeout); // Updated wait to use native util

module.exports = {
  name: "ban",
  aliases: ["hackban", "permaban", "banish"],
  category: "mod",
  premium: true,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // Check if the user has the Ban Members permission
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(
              `${client.emoji.cross} | You must have \`Ban Members\` permissions to use this command.`
            ),
        ],
      });
    }

    // Check if the bot has the Ban Members permission
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(
              `${client.emoji.cross} | I need \`Ban Members\` permissions to execute this command.`
            ),
        ],
      });
    }

    let user;
    // Resolve user by mention or ID
    try {
      user = await getUserFromMention(message, args[0]) || await client.users.fetch(args[0]);
    } catch (error) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(
              `${client.emoji.cross} | Please provide a valid user ID or mention a member.`
            ),
        ],
      });
    }

    // Ensure the user is valid
    if (!user) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(`${client.emoji.cross} | User not found.`),
        ],
      });
    }

    // Check if the user is already banned
    const banList = await message.guild.bans.fetch();
    const isAlreadyBanned = banList.has(user.id);

    if (isAlreadyBanned) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(`${client.emoji.cross} | This user is already banned from the server.`),
        ],
      });
    }

    // Prevent banning the bot itself
    if (user.id === client.user.id) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription("🤖 | I cannot ban myself!"),
        ],
      });
    }

    // Prevent banning the server owner
    if (user.id === message.guild.ownerId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(`${client.emoji.cross} | You cannot ban the server owner.`),
        ],
      });
    }

    // Prevent banning users with higher roles
    const memberToBan = await message.guild.members.fetch(user.id).catch(() => null);

    if (memberToBan && message.guild.members.me.roles.highest.comparePositionTo(memberToBan.roles.highest) <= 0) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(
              `${client.emoji.cross} | I cannot ban this user because their role is higher or equal to mine.`
            ),
        ],
      });
    }

    // Ban reason
    let reason = args.slice(1).join(" ") || "No reason provided.";
    reason = `${message.author.tag} (${message.author.id}): ${reason}`;

    // Confirmation embed
    const confirmEmbed = new EmbedBuilder()
      .setColor(0xc7b700)
      .setDescription(`⚠️ | Are you sure you want to ban **${user.tag}**?`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ban_yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("ban_no")
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
      if (interaction.customId === "ban_yes") {
        try {
          await message.guild.bans.create(user.id, { reason });
          const successEmbed = new EmbedBuilder()
            .setColor(0xc7b700)
            .setDescription(`${client.emoji.tick} | Successfully banned **${user.tag}**.`);
          await confirmationMessage.edit({ embeds: [successEmbed], components: [] });
        } catch (error) {
          console.error("Error banning user:", error);
          await message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0xc7b700)
                .setDescription(`${client.emoji.cross} | Failed to ban the user.`),
            ],
          });
        }
      } else if (interaction.customId === "ban_no") {
        const cancelEmbed = new EmbedBuilder()
          .setColor(0xc7b700)
          .setDescription(`${client.emoji.cross} | Ban action canceled.`);
        await confirmationMessage.edit({ embeds: [cancelEmbed], components: [] });
      }
      interaction.deferUpdate();
      collector.stop();
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        const timeoutEmbed = new EmbedBuilder()
          .setColor(0xc7b700)
          .setDescription("⏰ | Ban action timed out.");
        await confirmationMessage.edit({ embeds: [timeoutEmbed], components: [] });
      }
    });
  },
};

function getUserFromMention(message, mention) {
  if (!mention) return null;
  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return null;
  const id = matches[1];
  return message.client.users.fetch(id).catch(() => null);
}
