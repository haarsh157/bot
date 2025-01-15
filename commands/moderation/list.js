const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "list",
  aliases: ["l"],
  category: "mod",
  premium: true,

  run: async (client, message, args) => {
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You didn't provide the list type.\nList Options: \`admin\`, \`bot\`, \`inrole\``
            ),
        ],
      });
    }
    const require = args[0].toLowerCase();
    if (
      require === "admin" ||
      require === "admins" ||
      require === "administration"
    ) {
      const administrators = message.guild.members.cache.filter((member) =>
        member.permissions.has("Administrator")
      );
      const embed = new EmbedBuilder()
        .setTitle("List For Admin In This Server")
        .setDescription(
          `${administrators.map(({ id }) => `<@${id}> | ${id}`).join("\n")}`
        )
        .setColor(parseInt("0xc7b700", 16));
      return message.channel.send({ embeds: [embed] });
    }

    if (require === "bot" || require === "bots") {
      const bots = message.guild.members.cache.filter(
        (member) => member.user.bot
      );
      if (bots.size === 0)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | There are no bots in this server.`
              ),
          ],
        });
      const embed = new EmbedBuilder()
        .setTitle("List Of Bots In This Server")
        .setDescription(
          `${bots.map(({ id }) => `<@${id}> | ${id}`).join("\n")}`
        )
        .setColor(parseInt("0xc7b700", 16));
      return message.channel.send({ embeds: [embed] });
    }

    if (require === "inrole" || require === "role") {
      const role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]) ||
        (await message.guild.roles.fetch(args[1]));
      if (!role)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(`${client.emoji.cross} | No roles found.`),
          ],
        });
      const embed = new EmbedBuilder()
        .setTitle(`Members Having ${role.name}:`)
        .setDescription(
          `${role.members.map(({ id }) => `<@${id}> | ${id}`).join("\n")}`
        )
        .setColor(parseInt("0xc7b700", 16));
      return message.channel.send({ embeds: [embed] });
    }

    if (require === "ban" || require === "bans") {
      let bans = await message.guild.bans.fetch();
      let banList = bans.map(
        (us) =>
          `[${us.user.username}](https://discord.com/users/${us.user.id}) | ${us.user.id}`
      );
      if (banList.length === 0) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(`There are no banned users.`),
          ],
        });
      }
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription("**" + banList.join("\n") + "**")
            .setTitle(`List Of Banned Members In ${message.guild.name}`),
        ],
      });
    } else {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `You didn't provide the list type.\nList Options: \`admin\`, \`bot\`, \`inrole\``
            ),
        ],
      });
    }
  },
};
