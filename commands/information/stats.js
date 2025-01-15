const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const moment = require("moment");
const os = require("os");

module.exports = {
  name: "stats",
  category: "info",
  aliases: ["botinfo", "bi"],
  usage: "stats",
  run: async (client, message, args) => {
    // Button setup
    let buttonTeam = new ButtonBuilder()
      .setLabel("Team Info")
      .setCustomId("team")
      .setStyle(ButtonStyle.Secondary);

    let buttonGeneral = new ButtonBuilder()
      .setLabel("General Info")
      .setCustomId("general")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    let buttonSystem = new ButtonBuilder()
      .setLabel("System Info")
      .setCustomId("system")
      .setStyle(ButtonStyle.Secondary);

    let buttonPartners = new ButtonBuilder()
      .setLabel("Partners")
      .setCustomId("partners")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents([
      buttonTeam,
      buttonGeneral,
      buttonSystem,
      buttonPartners,
    ]);

    const uptime = moment(Date.now() - client.uptime).fromNow();
    const guildCount = client.guilds.cache.size;
    const memberCount = client.guilds.cache.reduce(
      (sum, guild) => sum + guild.memberCount,
      0
    );

    const generalEmbed = new EmbedBuilder()
      .setColor(parseInt("0xc7b700", 16))
      .setAuthor({
        name: "Ineffable Information",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `**__General Information__**\n` +
          `Bot Mention: <@${client.user.id}>\n` +
          `Bot Tag: ${client.user.tag}\n` +
          `Bot Version: 1.0.0\n` +
          `Total Servers: ${guildCount}\n` +
          `Total Users: ${memberCount}\n` +
          `Total Channels: ${client.channels.cache.size}\n` +
          `Last Rebooted: ${uptime}`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL(),
      });

    const msg = await message.channel.send({
      embeds: [generalEmbed],
      components: [row],
    });

    // Collector
    const collector = msg.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "partners") {
        await interaction.deferUpdate();
        const partnersEmbed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle("INEFFABLE Partners")
          .setFooter({ text: "Powered by xyz" })
          .setThumbnail(client.user.displayAvatarURL());

        await msg.edit({ embeds: [partnersEmbed], components: [row] });
      } else if (interaction.customId === "team") {
        await interaction.deferUpdate();
        const teamEmbed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle("Team Information")
          .setDescription("**Developers:**\n" + "- Wixxeyy\n\n")
          .setThumbnail(client.user.displayAvatarURL());

        await msg.edit({ embeds: [teamEmbed], components: [row] });
      } else if (interaction.customId === "system") {
        await interaction.deferUpdate();
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);
        const cpuModel = os.cpus()[0].model;

        const systemEmbed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle("System Information")
          .setDescription(
            `**System Latency:** ${client.ws.ping}ms\n` +
              `**Platform:** ${process.platform}\n` +
              `**Architecture:** ${process.arch}\n` +
              `**Memory Usage:** ${usedMem} GB / ${totalMem} GB\n` +
              `**CPU Model:** ${cpuModel}`
          )
          .setThumbnail(client.user.displayAvatarURL());

        await msg.edit({ embeds: [systemEmbed], components: [row] });
      } else if (interaction.customId === "general") {
        await interaction.deferUpdate();
        await msg.edit({ embeds: [generalEmbed], components: [row] });
      }
    });

    collector.on("end", () => {
      const disabledRow = new ActionRowBuilder().addComponents(
        buttonTeam.setDisabled(true),
        buttonGeneral.setDisabled(true),
        buttonSystem.setDisabled(true),
        buttonPartners.setDisabled(true)
      );

      msg.edit({ components: [disabledRow] });
    });
  },
};
