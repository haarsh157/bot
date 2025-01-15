const { EmbedBuilder } = require("discord.js");

module.exports = async (client) => {
  client.on("guildMemberAdd", async (member) => {
    if (member.user.bot) return;
    let check = await client.util.BlacklistCheck(member.guild);
    if (check) return;
    const userCount = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );

    try {
      const welcomeEmbed = new EmbedBuilder()
        .setTitle("Welcome to 𝙸𝙽𝙴𝙵𝙵𝙰𝙱𝙻𝙴! 🎉")
        .setDescription(
          `𝐃𝐨𝐧'𝐭 𝐟𝐨𝐫𝐠𝐞𝐭 𝐭𝐨 𝐠𝐨 𝐭𝐡𝐫𝐨𝐮𝐠𝐡\n[Aʙᴏᴜᴛ Uꜱ](https://discord.com/channels/1147476895009624125/1147485419437572226) • [Rᴜʟᴇꜱ](https://discord.com/channels/1147476895009624125/1147485434448990238) • [Rᴏʟᴇꜱ](https://discord.com/channels/1147476895009624125/1147485434448990238) • [Iɴᴛʀᴏ](https://discord.com/channels/1147476895009624125/1181875971339595816) • [Nᴇᴇᴅ Hᴇʟᴘ ?](https://discord.com/channels/1147476895009624125/1213418876210253844)\nWe are at our ${userCount}ᵗʰ member !!!!`
        )
        .setColor("#000000")
        .setThumbnail(member.user.displayAvatarURL())
        .setImage(
          "https://media.discordapp.net/attachments/1147485466443124898/1322328786808864799/bgmi_dividers.png?ex=6773c5e6&is=67727466&hm=651c428fb8c1a404edad6396279440c9faf88556e5a0b4177f55d82b4ce95eed&=&format=webp&quality=lossless&width=1440&height=112"
        )
        .setTimestamp();

      await member.send({ embeds: [welcomeEmbed] });
    } catch (error) {
      console.log("Welcome DM failed: ", error);
    }
  });

  // Send goodbye message to a designated channel instead
  client.on("guildMemberRemove", async (member) => {
    if (member.user.bot) return;
    let check = await client.util.BlacklistCheck(member.guild);
    if (check) return;

    try {
      // Replace 'goodbye-channel' with your channel ID
      const goodbyeChannel = member.guild.channels.cache.find(
        (channel) => channel.name === "goodbye-channel"
      );
      if (!goodbyeChannel) return;

      const goodbyeEmbed = new EmbedBuilder()
        .setColor("0x000000")
        .setTitle("Goodbye! 👋")
        .setDescription(`${member.user.username} has left the server!`)
        .setColor("#e74c3c")
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

      await goodbyeChannel.send({ embeds: [goodbyeEmbed] });
    } catch (error) {
      console.error("Goodbye message failed:", error);
    }
  });
};
