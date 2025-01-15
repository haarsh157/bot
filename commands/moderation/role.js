const {
  Message,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const wait = require("wait");
const { aliases, category, premium } = require("../dev/noprefix");

module.exports = {
  name: "role",
  category: "mod",
  premium: true,

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const embed = new EmbedBuilder().setColor(parseInt("0xc7b700", 16));
    const own = message.author.id === message.guild.ownerId;

    if (!message.member.permissions.has("ManageRoles")) {
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

    let option = args[0];
    if (option === "all") {
      let roleToAdd = await findMatchingRoles(
        message.guild,
        args.slice(1).join(" ")
      );
      roleToAdd = roleToAdd[0];
      let activeRole = false;

      if (!roleToAdd) {
        return message.channel.send({
          embeds: [
            embed.setDescription(
              `${client.emoji.cross} | The role provided is invalid. Please try again.`
            ),
          ],
        });
      }

      if (roleToAdd.permissions.has("Administrator")) {
        return message.channel.send({
          embeds: [
            embed.setDescription(
              `${client.emoji.cross} | This Role has dangerous permissions \`ADMINISTRATOR\`.`
            ),
          ],
        });
      }

      const startTime = Date.now();
      const totalMembers = message.guild.members.cache.size;
      const estimatedTime = (totalMembers * 1300) / 2;

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("yes_button")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("no_button")
          .setLabel("No")
          .setStyle(ButtonStyle.Danger)
      );

      const interactionMessage = await message.channel.send({
        embeds: [
          embed.setDescription(
            `Do you want to start adding roles to all members?`
          ),
        ],
        components: [row],
      });

      const collector = interactionMessage.createMessageComponentCollector({
        time: 10000,
      });

      collector.on("collect", async (interaction) => {
        if (interaction.isButton()) {
          if (interaction.customId === "yes_button") {
            interactionMessage.edit({
              embeds: [
                embed.setDescription(
                  `${client.emoji.tick} | Successfully started adding <@&${
                    roleToAdd.id
                  }> to all members. Estimated time: <t:${Math.floor(
                    (startTime + estimatedTime) / 1000
                  )}:R>`
                ),
              ],
              components: [],
            });
            collector.stop();

            activeRole = true;
            message.guild.members.cache.forEach(async (member) => {
              if (member.roles.cache.has(roleToAdd.id)) return;
              await wait(1300);
              await member.roles.add(
                roleToAdd.id,
                `${message.author.tag}(${message.author.id})`
              );
            });
          } else if (interaction.customId === "no_button") {
            interactionMessage.edit({
              embeds: [embed.setDescription(`Role addition process canceled.`)],
              components: [],
            });

            collector.stop();
          }
        }
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          interactionMessage.edit({
            embeds: [
              embed.setDescription(
                `Role addition process canceled. No response received.`
              ),
            ],
            components: [],
          });
        }
      });
    } else if (option === "cancel") {
      return (activeRole = false);
    } else {
      let member =
        message.guild.members.cache.get(args[0]) ||
        message.mentions.members.first();

      if (!member) {
        try {
          member = await message.guild.members.fetch(args[0]);
        } catch (error) {
          return message.channel.send({
            embeds: [
              embed.setDescription(`${client.emoji.cross} | User not found.`),
            ],
          });
        }
      }

      const role = (
        await findMatchingRoles(message.guild, args.slice(1).join(" "))
      ).shift();

      if (!role) {
        return message.channel.send({
          embeds: [
            embed.setDescription(
              `${client.emoji.cross} | You didn't provide a valid role.`
            ),
          ],
        });
      }

      if (!botHighestRole || role.position >= botHighestRole.position) {
        return message.channel.send({
          embeds: [
            embed.setDescription(
              `${client.emoji.cross} | I can't assign this role as my highest role is below or equal to it.`
            ),
          ],
        });
      }

      if (!own && message.member.roles.highest.position <= role.position) {
        return message.channel.send({
          embeds: [
            embed.setDescription(
              `${client.emoji.cross} | Your highest role is below or equal to the target role.`
            ),
          ],
        });
      }

      if (member.roles.cache.has(role.id)) {
        member.roles.remove(
          role.id,
          `${message.author.tag}(${message.author.id})`
        );
        return message.channel.send({
          embeds: [
            embed.setDescription(
              `${client.emoji.tick} | Successfully removed <@&${role.id}> from <@${member.id}>.`
            ),
          ],
        });
      } else {
        member.roles.add(
          role.id,
          `${message.author.tag}(${message.author.id})`
        );
        return message.channel.send({
          embeds: [
            embed.setDescription(
              `${client.emoji.tick} | Successfully added <@&${role.id}> to <@${member.id}>.`
            ),
          ],
        });
      }
    }
  },
};

function findMatchingRoles(guild, query) {
  const ROLE_MENTION = /<?@?&?(\d{17,20})>?/;
  if (!guild || !query || typeof query !== "string") return [];

  const patternMatch = query.match(ROLE_MENTION);
  if (patternMatch) {
    const id = patternMatch[1];
    const role = guild.roles.cache.find((r) => r.id === id);
    if (role) return [role];
  }

  const exact = [];
  const startsWith = [];
  const includes = [];
  guild.roles.cache.forEach((role) => {
    const lowerName = role.name.toLowerCase();
    if (role.name === query) exact.push(role);
    if (lowerName.startsWith(query.toLowerCase())) startsWith.push(role);
    if (lowerName.includes(query.toLowerCase())) includes.push(role);
  });

  return exact.length > 0
    ? exact
    : startsWith.length > 0
    ? startsWith
    : includes;
}
