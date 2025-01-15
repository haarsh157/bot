const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "roleinfo",
  aliases: ["ri"],
  category: "info",
  description: "To Get Information About A Role",
  run: async (client, message, args) => {
    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`❌ | You didn't provide a valid role.`),
        ],
      });
    }

    const color =
      role.hexColor === "#000000" ? "Default (Black)" : role.hexColor;
    const created = `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`;
    const permissions = role.permissions.has(
      PermissionsBitField.Flags.Administrator
    )
      ? "`ADMINISTRATOR`"
      : role.permissions
          .toArray()
          .sort((a, b) => a.localeCompare(b))
          .map((perm) => `\`${perm}\``)
          .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${role.name}'s Information`,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields(
        {
          name: "General Info",
          value: `**Role Name:** ${role.name}\n**Role ID:** \`${role.id}\`\n**Role Position:** ${role.position}\n**Hex Color:** ${color}\n**Created At:** ${created}\n**Mentionable:** ${role.mentionable}\n**Managed (Integration):** ${role.managed}`,
        },
        {
          name: "Allowed Permissions",
          value: permissions,
        }
      )
      .setColor(role.hexColor);

    message.channel.send({ embeds: [embed] });
  },
};
