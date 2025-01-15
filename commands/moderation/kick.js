const {
  Message,
  Client,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "kick",
  aliases: [],
  category: "mod",
  premium: true,
  run: async (client, message, args) => {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have \`Kick Members\` permissions to use this command.`
            ),
        ],
      });
    }

    let isown = message.author.id == message.guild.ownerId;
    let user = await getUserFromMention(message, args[0]);
    if (!user) {
      try {
        user = await message.guild.members.fetch(args[0]);
      } catch (error) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | Please Provide Valid user ID or Mention Member.`
              ),
          ],
        });
      }
    }

    if (!user || typeof user === "string")
      return message.channel.send({ embeds: [kaalo] });

    let rea = args.slice(1).join(" ") || "No Reason Provided";
    rea = `${message.author.tag} (${message.author.id}) | ` + rea;

    const kaalo = new EmbedBuilder()
      .setDescription(`${client.emoji.cross} | User Not Found`)
      .setColor(parseInt("0xc7b700", 16));
    const teddy = new EmbedBuilder()
      .setDescription(`${client.emoji.cross} | Mention the user first`)
      .setColor(parseInt("0xc7b700", 16));

    if (!user) return message.channel.send({ embeds: [teddy] });
    if (user === undefined) return message.channel.send({ embeds: [kaalo] });

    if (user.id === client.user.id)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`${client.emoji.cross} | You can't kick me.`),
        ],
      });

    if (user.id === message.guild.ownerId)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I can't kick the owner of this server.`
            ),
        ],
      });

    // Role comparison check (to ensure user has higher role than bot)
    if (
      !message.member.roles.highest.position >
        message.guild.members.me.roles.highest.position &&
      !isown
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have a higher role than me to use this command.`
            ),
        ],
      });
    }

    if (!user.kickable) {
      const embed = new EmbedBuilder()
        .setDescription(
          `${client.emoji.cross} |  My highest role is below **<@${user.id}>** `
        )
        .setColor(parseInt("0xc7b700", 16));
      return message.channel.send({ embeds: [embed] });
    }

    const banmess = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `You Have Been kicked From ${
          message.guild ? message.guild.name : "this server"
        } \nExecutor: ${message.author.tag} \nReason: \`${rea}\``
      )
      .setColor(parseInt("0xc7b700", 16))
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

    await message.guild.members.kick(user.id, rea).catch((err) => null);
    await user.send({ embeds: [banmess] }).catch((err) => null);

    const done = new EmbedBuilder()
      .setDescription(
        `${client.emoji.tick} | Successfully kicked **${user.user.tag}** from the server.`
      )
      .setColor(parseInt("0xc7b700", 16));
    return message.channel.send({ embeds: [done] });
  },
};

async function getUserFromMention(message, mention) {
  if (!mention) return null;

  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return null;

  const userId = matches[1];

  try {
    // Fetch user object based on ID
    return await message.guild.members.fetch(userId);
  } catch (error) {
    // Handle the error if the user is not found
    return null;
  }
}
