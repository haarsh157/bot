const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av"],
  category: "info",
  premium: true,
  run: async (client, message, args) => {
    const embedColor=parseInt("0xc7b700", 16);
    let member = await getUserFromMention(message, args[0]);
    if (!member) {
      try {
        member = await client.users.fetch(args[0]);
      } catch (error) {
        member = message.member.user;
      }
    }

    // Get the guild member object for server-specific avatar
    const guildMember = await message.guild.members.fetch(member.id);

    const userAvatarURL = member.displayAvatarURL({
      dynamic: true,
      size: 4096,
    });

    // Get the member's guild-specific avatar, fallback to global avatar if none exists
    const serverAvatarURL =
      guildMember.avatarURL({
        dynamic: true,
        size: 4096,
      }) || userAvatarURL;

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setFooter({ text: `Requested By ${message.author.tag}` })
      .setAuthor({ name: `${member.username}`, iconURL: userAvatarURL })
      .setImage(userAvatarURL)
      .setDescription(
        `[\`PNG\`](${userAvatarURL}?format=png) | [\`JPG\`](${userAvatarURL}?format=jpg) | [\`WEBP\`](${userAvatarURL}?format=webp)`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("user_avatar")
        .setLabel("Global Avatar")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("server_avatar")
        .setLabel("Server Avatar")
        .setStyle(ButtonStyle.Secondary)
    );

    const sentMessage = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    const filter = (interaction) =>
      interaction.isButton() && interaction.message.id === sentMessage.id;

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "user_avatar") {
        embed
          .setImage(userAvatarURL)
          .setDescription(
            `[\`PNG\`](${userAvatarURL}?format=png) | [\`JPG\`](${userAvatarURL}?format=jpg) | [\`WEBP\`](${userAvatarURL}?format=webp)`
          );
        await interaction.update({ embeds: [embed] });
      } else if (interaction.customId === "server_avatar") {
        embed
          .setImage(serverAvatarURL)
          .setDescription(
            `[\`PNG\`](${serverAvatarURL}?format=png) | [\`JPG\`](${serverAvatarURL}?format=jpg) | [\`WEBP\`](${serverAvatarURL}?format=webp)`
          );
        await interaction.update({ embeds: [embed] });
      }
    });

    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("user_avatar")
          .setLabel("Global Avatar")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("server_avatar")
          .setLabel("Server Avatar")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );
      sentMessage.edit({ components: [disabledRow] });
    });
  },
};

function getUserFromMention(message, mention) {
  if (!mention) return null;
  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return null;
  const id = matches[1];
  return message.client.users.fetch(id) || message.member;
}
