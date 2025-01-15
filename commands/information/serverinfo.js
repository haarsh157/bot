const { EmbedBuilder, ChannelType } = require("discord.js");
const { category, aliases } = require("./addemoji");

const verificationLevels = {
  NONE: "None",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  VERY_HIGH: "Very High",
};
const booster = {
  NONE: "Level 0",
  TIER_1: "Level 1",
  TIER_2: "Level 2",
  TIER_3: "Level 3",
};

module.exports = {
  name: "serverinfo",
  category: "info",
  aliases: ["si"],
  description: "To Get Information About The Server",
  run: async (client, message, args) => {
    const guild = message.guild;
    const { createdTimestamp, ownerId, description } = guild;

    const disabled = client.emoji.cross;
    const enabled = client.emoji.tick;

    const checkDays = (date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / 86400000);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    };

    const roles = guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);

    let rolesDisplay =
      roles.length < 15
        ? roles.join(" ") || "None"
        : `\`Too many roles to show..\``;
    if (rolesDisplay.length > 1024)
      rolesDisplay = `${roles.slice(4).join(" ")} \`more..\``;

    const channels = guild.channels.cache;
    const emojis = guild.emojis.cache;

    let bansCount = 0;
    try {
      bansCount = await guild.bans.fetch().then((x) => x.size);
    } catch {
      bansCount = "Unavailable";
    }

    const embed = new EmbedBuilder()
      .setColor(parseInt("0xc7b700", 16))
      .setTitle(`${guild.name}'s Information`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setImage(guild.bannerURL({ size: 4096 }))
      .addFields([
        {
          name: "__About__",
          value: `**Name**: ${guild.name}\n**ID**: ${
            guild.id
          }\n**Owner <a:OWNER:1183476311038111865>:** <@!${guild.ownerId}> (${
            guild.ownerId
          })\n**Created at:** <t:${parseInt(
            createdTimestamp / 1000
          )}:R>\n**Members:** ${
            guild.memberCount
          }\n**Banned Members:** ${bansCount}`,
        },
        {
          name: "__Server Information__",
          value: `**Verification Level:** ${
            verificationLevels[guild.verificationLevel]
          }\n**Inactive Channel:** ${
            guild.afkChannelId ? `<#${guild.afkChannelId}>` : disabled
          }\n**Inactive Timeout:** ${
            guild.afkTimeout / 60
          } mins\n**System Messages Channel:** ${
            guild.systemChannelId ? `<#${guild.systemChannelId}>` : disabled
          }\n**Boost Bar Enabled:** ${
            guild.premiumProgressBarEnabled ? enabled : disabled
          }`,
        },
        {
          name: "__Channels__",
          value: `**Total:** ${channels.size}\n**Text Channels:** ${
            channels.filter((channel) => channel.type === ChannelType.GuildText)
              .size
          } | **Voice Channels:** ${
            channels.filter(
              (channel) => channel.type === ChannelType.GuildVoice
            ).size
          }`,
        },
        {
          name: "__Emoji Info__",
          value: `**Regular:** ${
            emojis.filter((emoji) => !emoji.animated).size
          }\n**Animated:** ${
            emojis.filter((emoji) => emoji.animated).size
          }\n**Total:** ${emojis.size}`,
        },
        {
          name: "__Boost Status__",
          value: `${
            booster[guild.premiumTier]
          } [<a:boost:1183480032035876936> ${
            guild.premiumSubscriptionCount || "0"
          } Boosts]`,
        },
        {
          name: `__Server Roles__ [${roles.length}]`,
          value: rolesDisplay,
        },
      ])
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
