const {
  Client,
  Message,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

const wait = require("wait");

module.exports = {
  name: "+",
  category: "mod",

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const embed = new EmbedBuilder().setColor(parseInt("0xc7b700", 16));

    const customRoles = await client.db?.get(`customrole_${message.guild.id}`);

    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
    ) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | You must have \`Manage Roles\` permissions to use this command.`
          ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ManageRoles
      )
    ) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | I don't have \`Manage Roles\` permissions to execute this command.`
          ),
        ],
      });
    }

    const botHighestRole = message.guild.members.me.roles.highest;
    if (!botHighestRole) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | Unable to determine my highest role. Ensure I have proper permissions and roles.`
          ),
        ],
      });
    }

    const command = args[0]?.toLowerCase();
    const targetMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[1]);

    if (!command || !customRoles.names.includes(command)) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | Invalid command. Please use a valid role command.`
          ),
        ],
      });
    }

    if (!targetMember) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | You must specify a valid user to assign the role.`
          ),
        ],
      });
    }

    const roleId = customRoles.roles[customRoles.names.indexOf(command)];
    const roleToAssign = message.guild.roles.cache.get(roleId);

    if (!roleToAssign) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | The role associated with this command does not exist in the server.`
          ),
        ],
      });
    }

    if (!botHighestRole || roleToAssign.position >= botHighestRole.position) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | I can't assign this role as my highest role is below or equal to it.`
          ),
        ],
      });
    }

    if (targetMember.roles.cache.has(roleToAssign.id)) {
      await targetMember.roles.remove(
        roleToAssign.id,
        `${message.author.tag}(${message.author.id})`
      );
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.tick} | Successfully removed <@&${roleToAssign.id}> from <@${targetMember.id}>.`
          ),
        ],
      });
    }

    try {
      await targetMember.roles.add(
        roleToAssign.id,
        `${message.author.tag}(${message.author.id})`
      );
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.tick} | Successfully added <@&${roleToAssign.id}> to <@${targetMember.id}>.`
          ),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | An error occurred while assigning the role. Please try again.`
          ),
        ],
      });
    }
  },
};
