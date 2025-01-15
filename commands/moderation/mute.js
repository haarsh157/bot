const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "mute",
  aliases: ["timeout", "stfu"],
  category: "mod",
  run: async (client, message, args) => {
    const prefix = message.guild.prefix || "="; 
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have \`Timeout Members\` permission to use this command.`
            ),
        ],
      });
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I must have \`Timeout Members\` permission to run this command.`
            ),
        ],
      });
    }

    let user;
    // First try to get user from mention
    const mentionedUser = getUserFromMention(message, args[0]);
    if (mentionedUser) {
      user = await mentionedUser;
    } else {
      // If not a mention, try to get by ID
      try {
        user = await message.guild.members.fetch(args[0]);
      } catch (error) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | You didn't mention the member you want to mute.\n${message.guild.prefix}mute \`<member>\` \`<time>\` \`<reason>\``
              ),
          ],
        });
      }
    }

    if (!user) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`${client.emoji.cross} | The user is not valid.`),
        ],
      });
    }

    if (!args[0]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Command usage: \`${prefix}mute <user> [duration] [reason]\``
            ),
        ],
      });
    }

    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No reason given";

    let time = args[1];
    if (!time) time = "27d";

    let dur = ms(time);

    if (!dur) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Invalid time format. Please use a valid time format.\n${message.guild.prefix}mute \`<member>\` \`<time>\` \`<reason>\``
            ),
        ],
      });
    }

    // Check if user is currently muted and if the timeout hasn't expired
    if (user.communicationDisabledUntil && user.communicationDisabledUntil > new Date()) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | <@${user.user.id}> is already muted! Their mute expires <t:${Math.floor(user.communicationDisabledUntil.getTime() / 1000)}:R>`
            ),
        ],
      });
    }

    if (user.id === client.user.id) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`${client.emoji.cross} | You can't mute me!`),
        ],
      });
    }

    if (user.id === message.guild.ownerId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You can't mute the server owner!`
            ),
        ],
      });
    }

    if (user.id === message.member.id) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`${client.emoji.cross} | You can't mute yourself!`),
        ],
      });
    }

    if (!user.manageable) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I don't have enough permissions to mute <@${user.user.id}>`
            ),
        ],
      });
    }

    const muteMessage = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `You have been muted in ${message.guild.name} \nExecutor: ${message.author.tag} \nReason: \`${reason}\` \nDuration: \`${time}\``
      )
      .setColor(parseInt("0xc7b700", 16))
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

    await user
      .timeout(dur, `${message.author.tag} | ${reason}`)
      .then(() => user.send({ embeds: [muteMessage] }))
      .catch(() => null);

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `${client.emoji.tick} | Successfully muted <@${user.user.id}> for \`${time}\`!`
          ),
      ],
    });
  },
};

function getUserFromMention(message, mention) {
  if (!mention) return null;

  // Handle both normal mentions (<@id>) and nickname mentions (<@!id>)
  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return null;

  const id = matches[1];
  return message.guild.members.fetch(id);
}