const {
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { aliases } = require("./setup");

module.exports = {
  name: "nuke",
  category: "mod",
  premium: true,

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      let error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Manage Channels\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    const memberRole = message.member.roles.highest.position;
    const botRole = message.guild.members.me.roles.highest.position;

    if (memberRole <= botRole) {
      let error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `Your highest role must be higher than my highest role to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    try {
      let row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("YES")
          .setStyle(ButtonStyle.Success)
          .setLabel("Yes"),
        new ButtonBuilder()
          .setCustomId("NO")
          .setStyle(ButtonStyle.Danger)
          .setLabel("No")
      );

      const embed = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(`Are you sure that you want to nuke this channel?`);

      let msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const filter = (interaction) => interaction.user.id === message.author.id;

      const collector = msg.createMessageComponentCollector({
        filter,
        max: 1,
        time: 15000
      });

      collector.on("collect", async (buttonInteraction) => {
        const id = buttonInteraction.customId;
        if (id === "YES") {
          try {
            const newChannel = await message.channel.clone();
            const reason = args.join(" ") || "No Reason";

            await newChannel.setParent(message.channel.parent);
            await newChannel.setPosition(message.channel.position);

            await message.channel.delete();

            const nukeEmbed = new EmbedBuilder()
              .setTitle("**Channel Successfully Nuked**")
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `Channel nuked by ${message.author.tag} for: ${reason}`
              );

            const confirmationMsg = await newChannel.send({
              embeds: [nukeEmbed],
            });

            setTimeout(() => confirmationMsg.delete(), 5000);
          } catch (error) {
            console.error(error);
            buttonInteraction.reply({
              content: `Failed to nuke the channel. Try again later.`,
              ephemeral: true,
            });
          }
        }

        if (id === "NO") {
          await msg.delete();
        }
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          await msg.delete();
        }
      });
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`I was unable to nuke this channel.`),
        ],
      });
    }
  },
};
