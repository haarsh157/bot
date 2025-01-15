const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "userinfo",
  aliases: ["ui", "whois"],
  category: "info",
  description: "Get information about a user",
  run: async (client, message, args) => {
    const permissions = {
      Administrator: "Administrator",
      ManageGuild: "Manage Server",
      ManageRoles: "Manage Roles",
      ManageChannels: "Manage Channels",
      KickMembers: "Kick Members",
      BanMembers: "Ban Members",
      ManageNicknames: "Manage Nicknames",
      ManageEmojisAndStickers: "Manage Emojis and Stickers",
      ManageWebhooks: "Manage Webhooks",
      ManageMessages: "Manage Messages",
      MentionEveryone: "Mention Everyone",
    };

    const mention =
      (await getUserFromMention(message, args[0])) ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    if (!mention) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`❌ | Please provide a valid user mention or ID.`),
        ],
      });
    }

    const user = mention.user || mention;
    const member = mention.guild ? mention : null;

    const userFlags = (await user.fetchFlags()).toArray();
    const nick = member?.nickname || "None";
    const usericon = user.displayAvatarURL({ dynamic: true });

    const memberPermissions = member?.permissions?.toArray() || [];
    const finalPermissions = memberPermissions
      .map((perm) => permissions[perm] || perm)
      .filter(Boolean);

    const flags = {
      Staff: "<:discord_employee:1026903789262880800>",
      Partner: "<:partners:1026903940685627443>",
      BugHunterLevel1: "<:bug_hunter:1026904095895859240>",
      BugHunterLevel2: "<:BugHunter2:1026904223234932806>",
      Hypesquad: "<:hypesquad_events:1026904392022102086>",
      HypeSquadOnlineHouse1: "<:bravery:1026904604660748369>",
      HypeSquadOnlineHouse2: "<:brilliance:1026904485819326595>",
      HypeSquadOnlineHouse3: "<:balance:1026904705890254859>",
      EarlySupporter: "<:EarlySupporter:1026904834663788674>",
      VerifiedDeveloper: "<:BotDeveloper:1026905242618576956>",
      VerifiedBot: "<:VerifiedBot:1026905121042477106>",
    };

    const badges = userFlags.length
      ? userFlags.map((flag) => flags[flag] || flag).join(" ")
      : "None";

    const topRole = member?.roles?.highest || "None";
    const roles =
      member?.roles?.cache
        .filter((r) => r.name !== "@everyone")
        .map((role) => `<@&${role.id}>`)
        .join(", ") || "None";

    const truncatedRoles =
      roles.length > 1024 ? `${roles.slice(0, 1000)}...` : roles;
    const truncatedPermissions =
      finalPermissions.length > 1024
        ? `${finalPermissions.slice(0, 1000).join(", ")}...`
        : finalPermissions.join(", ");

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${user.tag}'s Information`, iconURL: usericon })
      .setThumbnail(usericon)
      .addFields(
        {
          name: "General Information",
          value: `Name: \`${user.tag}\`\nNickname: \`${nick}\`\nID: \`${user.id}\`\n`,
        },
        {
          name: "Overview",
          value: `Badges: ${badges}\nType: ${user.bot ? "Bot" : "Human"}`,
        }
      );

    if (member) {
      embed.addFields({
        name: "Server Related Information",
        value: `Top Role: ${topRole}\nRoles: ${truncatedRoles}\nKey Permissions: ${truncatedPermissions}`,
      });
    } else {
      embed.addFields({
        name: "Misc Information",
        value: `Created On: ${moment(user.createdAt).format(
          "llll"
        )}\nThis user is not in this server.`,
      });
    }

    embed
      .setColor(parseInt("0xc7b700", 16))
      .setFooter({
        text: `Requested By: ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};

function getUserFromMention(message, mention) {
  if (!mention) return null;

  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return null;

  const id = matches[1];
  return (
    message.client.users.cache.get(id) || message.guild.members.cache.get(id)
  );
}
