const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "nick",
  aliases: [],
  category: "mod",
  premium: true,

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Manage Nicknames\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageNicknames
      )
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `I must have \`Manage Nicknames\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    const memberRolePosition = message.member.roles.highest.position;
    const botRolePosition = message.guild.members.me.roles.highest.position;


    if (args.length < 2) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Usage: \`${message.guild.prefix}nick <mention> <newnick>\`. You need to provide both a member mention and a new nickname.`
            ),
        ],
      });
    }

    let member = await getUserFromMention(message, args[0]);
    let name = args.slice(1).join(" ");

    if (!member) {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch (error) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | Please provide a valid member.`
              ),
          ],
        });
      }
    }

    try {
      if (!name) {
        await member.setNickname(null);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.tick} | ${member}'s nickname has been successfully removed.`
              ),
          ],
        });
      } else {
        await member.setNickname(name);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.tick} | ${member}'s nickname has been successfully changed to ${name}.`
              ),
          ],
        });
      }
    } catch (err) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I may not have sufficient permissions or my highest role may not be above or the same as ${member}.`
            ),
        ],
      });
    }
  },
};

function getUserFromMention(message, mention) {
  if (!mention) return null;

  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return null;

  const id = matches[1];
  return message.guild.members.fetch(id).catch(() => null);
}
