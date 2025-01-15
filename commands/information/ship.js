const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ship",
  category: "info",
  aliases: ["ship"],
  run: async (client, message, args) => {
    const members = await message.guild.members.fetch();
    let targetUser;

    if (args[0]) {
      const userId = args[0].replace(/[<@!>]/g, '');
      targetUser = await client.users.fetch(userId).catch(() => null);
    }

    const userToShip = targetUser || members.filter(member => !member.user.bot && member.user.id !== message.author.id).random();

    if (!userToShip) {
      return message.channel.send("Could not find someone to ship with!");
    }

    const shipperName = message.author.username;
    const shippedName = targetUser ? targetUser.username : userToShip.user.username;

    const shipPercentage = calculateShippingPercentage(shipperName, shippedName);

    let shipMessage = "";
    if (shipPercentage <= 10) {
      shipMessage = "Ouch! This ship isn't sailing anywhere anytime soon... 😬";
    } else if (shipPercentage <= 40) {
      shipMessage = "It's a rocky start, but there's still hope! 😅";
    } else if (shipPercentage <= 60) {
      shipMessage = "It's a decent ship! Maybe it'll grow stronger over time! 💑";
    } else if (shipPercentage <= 90) {
      shipMessage = "Looking pretty good! You two make a great pair! 😍";
    } else {
      shipMessage = "Wow, this is a perfect match! 💖 You two are unstoppable!";
    }

    const embed = new EmbedBuilder()
      .setTitle(`Shipping Compatibility: ${shipPercentage}%`)
      .setDescription(
        `**<@${message.author.id}>** 💞 **<@${targetUser ? targetUser.id : userToShip.user.id}>**!!`
      )
      .setColor(parseInt("0xc7b700", 16))
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1262644150961045515/1323299943544258741/image.gif?ex=6774029c&is=6772b11c&hm=11b735a3ab20a99d2847e127e4535161bed59c5cff234c50319774bb18c0268b&"
      )
      .addFields({ name: " ", value: shipMessage });

    message.channel.send({ embeds: [embed] });
  },
};

function calculateShippingPercentage(name1, name2) {
  let sum = 0;
  const combinedName = name1 + name2;
  for (const char of combinedName) {
    sum += char.charCodeAt(0);
  }
  return sum % 101;
}