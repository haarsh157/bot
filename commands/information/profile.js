const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "profile",
  aliases: ["badge", "badges"],
  category: "info",
  premium: true,
  run: async (client, message, args) => {
    const user =
      message.mentions.users.first() ||
      client.users.cache.get(args[0]) ||
      message.author;

    const destroyer = user.id === "865411261847306241";
    let badges = "";

    const guild = await client.guilds.fetch("1114646437523886131");

    const sus = await guild.members.fetch(user.id).catch(() => {
      badges = "`No Badge Available`";
    });

    if (destroyer || user.id === "1212431696381612132")
      badges += `\n<:Hii:1220745498621771776>・**[Wixxeyy](https://discord.com/)**`;

    try {
      const roleChecks = [
        {
          id: "1215607059073212487",
          badge: "<:Developer:1138768207348498432>・**Developer**",
        },
        {
          id: "1210891293392371732",
          badge: "<a:OWNER:1183476311038111865>・**Owner**",
        },
        {
          id: "1181521598352719922",
          badge: "<:Admin:1183476832725647380>・**Admin**",
        },
        {
          id: "1181521599137062964",
          badge: "<:mods:1183478179390816257>・**Mod**",
        },
        {
          id: "1181521604862279730",
          badge: "<a:mod:1183478099619365015>・**Support Team**",
        },
        {
          id: "1181521600886091826",
          badge: "<:bug_hunter:1183478509922943108>・**Bug Hunter**",
        },
        {
          id: "1181521601708175392",
          badge: "<a:supporter:1183478957660704859>・**Supporter**",
        },
        {
          id: "1181521603201351681",
          badge: "<:Friendship:1183479192185217045>・**Friends**",
        },
      ];

      for (const { id, badge } of roleChecks) {
        if (sus.roles.cache.has(id)) {
          badges += `\n${badge}`;
        }
      }
    } catch (err) {
      badges = badges || "`No Badge Available`";
    }

    const pr = new EmbedBuilder()
      .setAuthor({
        name: `Profile For ${user.username}#${user.discriminator}`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor(parseInt("0xc7b700", 16)) // Default color in case client.color is undefined
      .setTimestamp()
      .setDescription(
        `**BADGES** <:inef_nitroboost:1149948007559741440>\n${
          badges || "`No Badge Available`"
        }`
      );

    message.channel.send({ embeds: [pr] });
  },
};
