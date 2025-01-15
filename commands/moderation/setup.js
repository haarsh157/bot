const {
  Message,
  Client,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "setup",
  aliases: ["customrole"],
  subcommand: ["add", "remove", "config", "reset", "list", "reqrole"],
  category: "customrole",
  run: async (client, message, args) => {
    // if (message.guild.memberCount < 30) {
    //   return message.channel.send({
    //     embeds: [
    //       new EmbedBuilder()
    //         .setColor(parseInt("0x000000", 16))
    //         .setDescription(
    //           `${client.emoji.cross} | Your Server Doesn't Meet My 30 Member Criteria`
    //         ),
    //     ],
    //   });
    // }

    const embed = new EmbedBuilder().setColor(parseInt("0xc7b700", 16));
    let own = message.author.id === message.guild.ownerId;
    if (!message.member.permissions.has("Administrator")) {
      return message.channel.send({
        embeds: [
          embed.setDescription(
            `${client.emoji.cross} | You must have \`Administration\` permissions to use this command.`
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

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.guild.name,
              iconURL:
                message.guild.iconURL({ dynamic: true }) ||
                client.user.displayAvatarURL(),
            })
            .setFooter({ text: `${client.user.username}` })
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `\n\`${message.guild.prefix}setup add <name> <role>\`\nSetups a role with the provided name.\n\n\`${message.guild.prefix}setup remove <name>\`\nRemoves a role with the provided name.\n\n\`${message.guild.prefix}setup list\`\nShows you the list of all custom roles.\n\n\`${message.guild.prefix}setup reset\`\nClear the configuration of custom roles.`
            ),
        ],
      });
    }

    const input = args[0].toLowerCase();

    if (input === "add") {
      const data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) {
        await client.db?.set(`customrole_${message.guild.id}`, {
          names: [],
          roles: [],
          reqrole: null,
        });
        let msg = await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `Please wait, setting up configuration for your server. This may take a moment...`
              ),
          ],
        });
        await client.util.sleep(2000);

        const setupRoleEmbed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle(`Server Configuration Complete!`)
          .setDescription(
            `Congratulations! Your server has been configured successfully. You can now use custom roles and enjoy the enhanced features hassle-free! 🚀`
          )
          .setFooter({
            text: `Setup completed by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });
        return await msg.edit({ embeds: [setupRoleEmbed] });
      }

      if (data) {
        if (data.names.length > 50) {
          const embed = new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | Sorry, you've reached the limit of **50** custom role setups. Please remove some setups to add new ones.`
            );

          return message.channel.send({ embeds: [embed] });
        }
      }

      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | ${message.guild.prefix}setup add <name> <role>`
              ),
          ],
        });
      }

      let id = args[1].replace(/[<@&#>]/giu, "");
      const check = message.guild.roles.cache.get(id);

      if (check) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | ${message.guild.prefix}setup add <name> <role>`
              ),
          ],
        });
      }

      const name = args[1].toLowerCase();
      if (data) {
        if (data.names.length > 0) {
          if (data.names.includes(name)) {
            const embed = new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | Oops! The custom role **${name}** already exists in my list. Please choose a different name.`
              );

            return message.channel.send({ embeds: [embed] });
          }
        }
      }

      if (!args[2]) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | ${message.guild.prefix}setup add ${args[1]} <role>`
              ),
          ],
        });
      }

      const role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[2]) ||
        message.guild.roles.cache.find(
          (r) => r.name.toLowerCase() === args.slice(2).join(" ").toLowerCase()
        );

      if (!role)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(`${client.emoji.cross} | Role **not** found!`),
          ],
        });
      if (role.managed)
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | <@&${role.id}> isn't a **server** role!`
              ),
          ],
        });

      const array = [PermissionsBitField.Flags.Administrator];

      if (role.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const restrictedPermissions = role.permissions
          .toArray()
          .filter((perm) => array.includes(perm))
          .map((perm) => `\`${perm}\``)
          .join(", ");

        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${client.emoji.cross} | I can't **add** <@&${role.id}> to my **custom role** list because it has Administrator permissions.`
              )
              .setColor(parseInt("0xc7b700", 16)),
          ],
        });
      }

      let names = [],
        roles = [];
      if (data) {
        if (data.roles.length > 0) data.roles.map((r) => roles.push(r));
        if (data.names.length > 0) data.names.map((r) => names.push(r));
      }
      roles.push(role.id);
      names.push(name);
      await client.db?.set(`customrole_${message.guild.id}`, {
        names: names,
        roles: roles,
        reqrole: data ? data.reqrole : null,
      });
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setTitle(`Custom Role Added`)
            .setDescription(
              `The role <@&${role.id}> has been successfully added to my custom role list.`
            )
            .addFields(
              { name: "Role Name", value: `<@&${role.id}>`, inline: true },
              {
                name: "List Size",
                value: `${data.names.length + 1}`,
                inline: true,
              }
            )
            .setFooter({
              text: `${client.user.username}`,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } else if (input == "remove") {
      let data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) {
        await client.db?.set(`customrole_${message.guild.id}`, {
          names: [],
          roles: [],
          reqrole: null,
        });

        let msg = await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `Please wait, setting up configuration for your server. This may take a moment...`
              ),
          ],
        });

        await client.util.sleep(2000);
        const setupRoleEmbed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle(`Server Configuration Complete!`)
          .setDescription(
            `Congratulations! Your server has been configured successfully. You can now use custom roles and enjoy the enhanced features hassle-free! 🚀`
          )
          .setFooter({
            text: `Setup completed by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });
        return await msg.edit({ embeds: [setupRoleEmbed] });
      }

      if (!data.names.length) {
        const embed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `${client.emoji.cross} | Oops! It seems like there are no custom role setups configured yet. Use \`${message.guild.prefix}setup\` to create custom roles.`
          );
        return message.channel.send({ embeds: [embed] });
      }

      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(`${message.guild.prefix}setup remove <name>`),
          ],
        });
      }

      const roleName = args[1].toLowerCase();
      const roleIndex = data.names.indexOf(roleName);

      if (roleIndex === -1) {
        const embed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `${client.emoji.cross} | Oops! The role with the name **${roleName}** couldn't be found in my custom role setups. Double-check the name and try again.`
          );
        return message.channel.send({ embeds: [embed] });
      }

      data.names.splice(roleIndex, 1);
      data.roles.splice(roleIndex, 1);

      await client.db?.set(`customrole_${message.guildId}`, data);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setTitle(`Custom Role Removed`)
            .setDescription(
              `The role **${roleName}** has been successfully removed from my custom role list.`
            )
            .addFields(
              { name: "Removed Role", value: roleName, inline: true },
              {
                name: "Remaining Roles",
                value: `${data.names.length}`,
                inline: true,
              }
            )
            .setFooter({
              text: `Role removed by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } else if (input === "list") {
      const data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data || data.names.length === 0) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setTitle(`No Custom Roles Found`)
              .setDescription(
                `Oops! It seems like there are no custom roles configured yet. Use \`${message.guild.prefix}setup add <name> <role>\` to create custom roles.`
              ),
          ],
        });
      }

      const rolesList = data.names
        .map(
          (name, index) =>
            `${index + 1}. **${name}** - <@&${data.roles[index]}>`
        )
        .join("\n");

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setTitle(`Custom Roles List`)
            .setDescription(
              `Here are the custom roles currently configured for this server:\n\n${rolesList}`
            )
            .setFooter({
              text: `${client.user.username}`,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } else if (input === "reset") {
      const data = await client.db?.get(`customrole_${message.guild.id}`);
      if (!data) {
        const embed = new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setTitle(`No Custom Role Setups Found`)
          .setDescription(
            `Oops! It appears there are no custom role setups configured yet. Use \`${message.guild.prefix}setup\` to create custom roles and enhance your server experience.`
          );

        return message.channel.send({ embeds: [embed] });
      }
      await client.db?.delete(`customrole_${message.guild.id}`);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setTitle(`Custom Role Module Successfully Reset`)
            .setDescription(
              `The custom role module has been successfully reset. All custom roles, configurations, and settings have been cleared. You can now start fresh with your custom role setups.`
            )
            .setFooter({
              text: `Reset by ${message.author.tag}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    } 
    // else if (input === "config") {
    //   const data = await client.db?.get(`customrole_${message.guild.id}`);
    //   if (!data) {
    //     return message.channel.send({
    //       embeds: [
    //         new EmbedBuilder()
    //           .setAuthor({
    //             name: message.guild.name,
    //             iconURL:
    //               message.guild.iconURL({ dynamic: true }) ||
    //               client.user.displayAvatarURL(),
    //           })
    //           .setFooter({ text: `${client.user.username}` })
    //           .setColor(parseInt("0xc7b700", 16))
    //           .setDescription(
    //             `**__Reqrole__**\n\n*Role Not set*.\n\n**__Girl__**\n\n*Role Not set*.\n\n**__Guest__**\n*Role Not set*.\n\n**__Vip__**\n\n*Role Not set*.\n\n**__Official__**\n\n*Role Not set*.`
    //           )
    //           .setThumbnail(client.user.displayAvatarURL()),
    //       ],
    //     });
    //   }

    //   if (data.roles.length < 1 && data.names.length < 1 && !data.reqrole) {
    //     return message.channel.send({
    //       embeds: [
    //         new EmbedBuilder()
    //           .setAuthor({
    //             name: message.guild.name,
    //             iconURL:
    //               message.guild.iconURL({ dynamic: true }) ||
    //               client.user.displayAvatarURL(),
    //           })
    //           .setFooter({ text: `${client.user.username}` })
    //           .setColor(parseInt("0xc7b700", 16))
    //           .setDescription(
    //             `**__Reqrole__**\n*Role Not set*.\n\n**__Girl__**\n*Role Not set*.\n\n**__Guest__**\n*Role Not set*.\n\n**__Vip__**\n*Role Not set*.\n\n**__Official__**\n*Role Not set*.`
    //           )
    //           .setThumbnail(client.user.displayAvatarURL()),
    //       ],
    //     });
    //   }

    //   let reqrole, girl, guest, vip, official;

    //   const check = await message.guild.roles.fetch(data.reqrole);
    //   const check1 = await message.guild.roles.fetch(
    //     data.roles[
    //       data.names.indexOf(data.names.find((n) => n.toLowerCase() === "girl"))
    //     ]
    //   );
    //   const check2 = await message.guild.roles.fetch(
    //     data.roles[
    //       data.names.indexOf(
    //         data.names.find((n) => n.toLowerCase() === "guest")
    //       )
    //     ]
    //   );
    //   const check3 = await message.guild.roles.fetch(
    //     data.roles[
    //       data.names.indexOf(data.names.find((n) => n.toLowerCase() === "vip"))
    //     ]
    //   );
    //   const check4 = await message.guild.roles.fetch(
    //     data.roles[
    //       data.names.indexOf(
    //         data.names.find((n) => n.toLowerCase() === "official")
    //       )
    //     ]
    //   );

    //   reqrole = check || "*Role Not set*";
    //   girl = check1 || "*Role Not set*";
    //   guest = check2 || "*Role Not set*";
    //   vip = check3 || "*Role Not set*";
    //   official = check4 || "*Role Not set*";

    //   const description =
    //     `**__Reqrole__**\n${
    //       reqrole.id ? `<@&${reqrole.id}>` : "*Role Not set*"
    //     }.` +
    //     `\n\n**__Girl__**\n${girl.id ? `<@&${girl.id}>` : "*Role Not set*"}.` +
    //     `\n\n**__Guest__**\n${
    //       guest.id ? `<@&${guest.id}>` : "*Role Not set*"
    //     }.` +
    //     `\n\n**__Vip__**\n${vip.id ? `<@&${vip.id}>` : "*Role Not set*"}.` +
    //     `\n\n**__Official__**\n${
    //       official.id ? `<@&${official.id}>` : "*Role Not set*"
    //     }.\n`;

    //   return message.channel.send({
    //     embeds: [
    //       new EmbedBuilder()
    //         .setAuthor({
    //           name: message.guild.name,
    //           iconURL:
    //             message.guild.iconURL({ dynamic: true }) ||
    //             client.user.displayAvatarURL(),
    //         })
    //         .setFooter({ text: `${client.user.username}` })
    //         .setThumbnail(client.user.displayAvatarURL())
    //         .setColor(parseInt("0xc7b700", 16))
    //         .setDescription(description),
    //     ],
    //   });
    // } 
    else {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.guild.name,
              iconURL:
                message.guild.iconURL({ dynamic: true }) ||
                client.user.displayAvatarURL(),
            })
            .setFooter({ text: `${client.user.username}` })
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `\n\`${message.guild.prefix}setup add <name> <role>\`\nSetups a role with the provided name.\n\n\`${message.guild.prefix}setup remove <name>\`\nRemoves a role with the provided name.\n\n\`${message.guild.prefix}setup list\`\nShows you the list of all custom roles.\n\n\`${message.guild.prefix}setup reset\`\nClear the configuration of custom roles.`
            ),
        ],
      });
    }
  },
};
