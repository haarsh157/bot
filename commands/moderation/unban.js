const {
  Message,
  Client,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const wait = require("wait");

module.exports = {
  name: "unban",
  aliases: ["hackunban", "unfuckban", "unfuckoff"],
  category: "mod",
  premium: true,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have \`Ban Members\` permissions to use this command.`
            ),
        ],
      });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | I must have \`Ban Members\` permissions to use this command.`
            ),
        ],
      });
    }

    let user = await getUserFromMention(message, args[0]);
    if (!user) {
      try {
        user = await client.users.fetch(args[0]);
      } catch (error) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | Please Provide a valid user ID or Mention the user.`
              ),
          ],
        });
      }
    }

    try {
      const bans = await message.guild.bans.fetch();
      const bannedUser = bans.get(user.id);

      if (!bannedUser) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${client.emoji.cross} | This user is not banned.`
              ),
          ],
        });
      }

      const confirmEmbed = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `⚠️ | Are you sure you want to unban **<@${user.id}>**?`
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("unban_yes")
          .setLabel("Yes")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("unban_no")
          .setLabel("No")
          .setStyle(ButtonStyle.Secondary)
      );

      const confirmationMessage = await message.channel.send({
        embeds: [confirmEmbed],
        components: [row],
      });

      const filter = (interaction) => interaction.user.id === message.author.id;
      const collector = confirmationMessage.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (interaction) => {
        try {
          if (interaction.customId === "unban_yes") {
            await message.guild.members.unban(user.id);
            const unbanConfirmationEmbed = new EmbedBuilder()
              .setDescription(
                `${client.emoji.tick} | Successfully unbanned **<@${user.id}>** from the server.`
              )
              .setColor(parseInt("0xc7b700", 16));

            await confirmationMessage.edit({
              embeds: [unbanConfirmationEmbed],
              components: [],
            });
            interaction.deferUpdate();
          } else if (interaction.customId === "unban_no") {
            const cancelEmbed = new EmbedBuilder()
              .setDescription(`${client.emoji.cross} | Unban action canceled.`)
              .setColor(parseInt("0xc7b700", 16));

            await confirmationMessage.edit({
              embeds: [cancelEmbed],
              components: [],
            });
            interaction.deferUpdate(); 
          }

          await wait(5000); 
          await confirmationMessage.delete(); 
        } catch (err) {
          console.error("Error handling interaction:", err);
        }
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          const timeoutEmbed = new EmbedBuilder()
            .setDescription(`${client.emoji.cross} | The action timed out.`)
            .setColor(parseInt("0xc7b700", 16));
          await confirmationMessage.edit({
            embeds: [timeoutEmbed],
            components: [],
          });
        }
      });
    } catch (err) {
      console.error("Error fetching bans:", err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | An error occurred while fetching the bans.`
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
  return message.client.users.fetch(id);
}
