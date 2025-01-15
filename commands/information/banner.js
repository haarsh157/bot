const {
  EmbedBuilder
} = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "banner",
  category: "info",
  premium: true,

  run: async (client, message, args) => {
    const embedColor = parseInt("0xc7b700", 16);
    let user =
      message.mentions.members.first() ||
      (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null) ||
      message.member;

    if (!user) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription("Could not find the specified user."),
        ],
      });
    }

    const userId = user.id || user.user?.id;

    // Fetch user banner
    const data = await axios
      .get(`https://discord.com/api/users/${userId}`, {
        headers: {
          Authorization: `Bot ${client.token}`,
        },
      })
      .then((d) => d.data)
      .catch(() => null);

    if (!data) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription("Failed to fetch user data from Discord API."),
        ],
      });
    }

    let userBannerURL = null;
    if (data.banner) {
      const format = data.banner.startsWith("a_") ? "gif" : "png";
      userBannerURL = `https://cdn.discordapp.com/banners/${userId}/${data.banner}.${format}?size=4096`;
    }

    // Fetch server banner
    const serverBannerURL = message.guild.bannerURL({ size: 4096 });

    if (!userBannerURL && !serverBannerURL) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(embedColor)
            .setDescription("Neither the user nor the server has a banner."),
        ],
      });
    }

    // Create the embed with the default banner (user or server banner)
    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setFooter({ text: `Requested By: ${message.author.tag}` })
      .setDescription(
        userBannerURL
          ? `Displaying user banner for ${user}`
          : `Displaying server banner for ${message.guild.name}`
      )
      .setImage(userBannerURL || serverBannerURL);

    // const row = new ActionRowBuilder().addComponents(
      // new ButtonBuilder()
      //   .setCustomId("user_banner")
      //   .setLabel("User Banner")
      //   .setStyle(ButtonStyle.Primary),
      // new ButtonBuilder()
      //   .setCustomId("server_banner")
      //   .setLabel("Server Banner")
      //   .setStyle(ButtonStyle.Secondary)
    // );

    const sentMessage = await message.channel.send({
      embeds: [embed],
      // components: [row],
    });

    const filter = (interaction) =>
      interaction.isButton() && interaction.message.id === sentMessage.id;
    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    // collector.on("collect", async (interaction) => {
    //   if (interaction.customId === "user_banner") {
    //     if (userBannerURL) {
    //       embed
    //         .setImage(userBannerURL)
    //         .setDescription(`User Banner for ${user}`);
    //     } else {
    //       embed.setDescription(`User does not have a banner.`);
    //     }
    //     await interaction.update({ embeds: [embed] });
    //   } else if (interaction.customId === "server_banner") {
    //     if (serverBannerURL) {
    //       embed
    //         .setImage(serverBannerURL)
    //         .setDescription(`Server Banner for ${message.guild.name}`);
    //     } else {
    //       embed.setDescription(`Server does not have a banner.`);
    //     }
    //     await interaction.update({ embeds: [embed] });
    //   }
    // });

    // collector.on("end", () => {
    //   const disabledRow = new ActionRowBuilder().addComponents(
        // new ButtonBuilder()
        //   .setCustomId("user_banner")
        //   .setLabel("User Banner")
        //   .setStyle(ButtonStyle.Primary)
        //   .setDisabled(true),
        // new ButtonBuilder()
        //   .setCustomId("server_banner")
        //   .setLabel("Server Banner")
        //   .setStyle(ButtonStyle.Secondary)
        //   .setDisabled(true)
    //   );

    //   sentMessage.edit({ components: [disabledRow] });
    // });
  },
};
