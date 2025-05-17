const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  category: "info",
  premium: false,
  run: async (client, message, args) => {
    const emojis = {
      mod: "<:icons_stagemoderator:1154471926023082035>",
      voice: "<:Voice:1322506880324468767>",
      utility: "<:icons_info:1154471807794036787>",
      extra: "<:extra:1322506155649531936>",
    };

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("categorySelect")
      .setPlaceholder("> wixbot Get Started!!")
      .addOptions([
        // {
        //   label: "AntiNuke",
        //   value: "antinuke",
        //   emoji: "<:emo1:1320351649063108662>",
        // },
        {
          label: "Moderation",
          value: "mod",
          emoji: "<:icons_stagemoderator:1154471926023082035>",
        },
        {
          label: "Utility",
          value: "info",
          emoji: "<:icons_info:1154471807794036787>",
        },
        // {
        //   label: "Welcomer",
        //   value: "welcomer",
        //   emoji: "<:emo1:1320351649063108662>",
        // },
        // {
        //   label: "Automod",
        //   value: "automod",
        //   emoji: "<:emo1:1320351649063108662>",
        // },
        // {
        //   label: "Logging",
        //   value: "logging",
        //   emoji: "<:emo1:1320351649063108662>",
        // },
        {
          label: "Voice",
          value: "voice",
          emoji: "<:Voice:1322506880324468767>",
        },
        // {
        //   label: "Custom Role",
        //   value: "customrole",
        //   emoji: "<:emo1:1320351649063108662>",
        // },
        // {
        //   label: "Extra",
        //   value: "extra",
        //   emoji: "<:emo1:1320351649063108662>",
        // },
      ]);

    const row1 = new ActionRowBuilder().addComponents(
      // new ButtonBuilder()
      //   .setCustomId("antinuke")
      //   .setLabel("AntiNuke")
      //   .setStyle(ButtonStyle.Secondary)
      //   .setEmoji("1320351649063108662"),
      new ButtonBuilder()
        .setCustomId("mod")
        .setLabel("Moderation")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("1154471926023082035"),
      new ButtonBuilder()
        .setCustomId("info")
        .setLabel("Utility")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("1154471807794036787")
      // new ButtonBuilder()
      //   .setCustomId("welcomer")
      //   .setLabel("Welcomer")
      //   .setStyle(ButtonStyle.Secondary)
      //   .setEmoji("1320351649063108662")
    );

    const row2 = new ActionRowBuilder().addComponents(
      // new ButtonBuilder()
      //   .setCustomId("automod")
      //   .setLabel("Automod")
      //   .setStyle(ButtonStyle.Secondary)
      //   .setEmoji("1320351649063108662"),
      // new ButtonBuilder()
      //   .setCustomId("logging")
      //   .setLabel("Logging")
      //   .setStyle(ButtonStyle.Secondary)
      //   .setEmoji("1320351649063108662"),
      new ButtonBuilder()
        .setCustomId("voice")
        .setLabel("Voice")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("1322506880324468767")
      // new ButtonBuilder()
      // .setCustomId("customrole")
      // .setLabel("Custom Role")
      // .setStyle(ButtonStyle.Secondary)
      // .setEmoji("1320351649063108662"),
      // new ButtonBuilder()
      //   .setCustomId("extra")
      //   .setLabel("Extra")
      //   .setStyle(ButtonStyle.Secondary)
      //   .setEmoji("1320351649063108662")
    );

    const embed = new EmbedBuilder()
      .setColor(parseInt("0xc7b700", 16))
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
      .setDescription(
        "**Help Menu & Support Panel**\n```yaml\n<> = Required Argument, [] = Optional Argument```"
      )
      .addFields([
        {
          name: "**__Modules__**",
          value:
            // `> <:emo1:1320351649063108662> \`:\` **[AntiNuke](https://discord.gg/wixbot)**\n` +
            `> ${emojis.mod} \`:\` **[Moderation](https://discord.gg/wixbot)**\n` +
            // `> <:emo1:1320351649063108662> \`:\` **[Welcomer](https://discord.gg/wixbot)**\n` +
            // `> <:emo1:1320351649063108662> \`:\` **[Automod](https://discord.gg/wixbot)**\n` +
            `> ${emojis.utility} \`:\` **[Utility](https://discord.gg/wixbot)**`,
          inline: true,
        },
        {
          name: "** **",
          value:
            // `> <:emo1:1320351649063108662> \`:\` **[Logging](https://discord.gg/wixbot)**\n` +
            `> ${emojis.voice} \`:\` **[Voice](https://discord.gg/wixbot)**\n` +
            // `> <:emo1:1320351649063108662> \`:\` **[Custom Role](https://discord.gg/wixbot)**\n` +
            `> ${emojis.extra} \`:\` **[Extra](https://discord.gg/wixbot)**`,
          inline: true,
        },
        {
          name: ":link: **__Links__**",
          value: `[Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&integration_type=0&scope=bot) | [Support](https://discord.gg/wixbot) | [Vote](https://discord.gg/wixbot)\n\n**Check our Official handles**\n[<:Instagram:1139539696301637745> **INSTAGRAM**](https://www.instagram.com/dc_wixbot/) | [<:wixbot_twitter:1230530649438421082> **TWITTER**](https://x.com/DC_wixbot) | [<:wixbot_Youtube:1191078411020546058> **YOUTUBE**](https://www.youtube.com/@dc_wixbot/)\n`,
          inline: false,
        },
      ])
      .setImage(
        "https://media.discordapp.net/attachments/1147485466443124898/1322328786808864799/bgmi_dividers.png?ex=67751766&is=6773c5e6&hm=8768d91ba142bac04e71c1ddbfe64f0e733c8c497ffa709c320b956fe487e5b3&=&format=webp&quality=lossless&width=1440&height=112"
      );

    const helpMessage = await message.channel.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(selectMenu),
        row1,
        row2,
      ],
    });

    const collector = helpMessage.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      try {
        if (i.isButton() || i.isStringSelectMenu()) {
          const category = i.isButton() ? i.customId : i.values[0];
          let commands = [];

          const categoryMap = {
            antinuke: "security",
            mod: "mod",
            info: "info",
            welcomer: "welcomer",
            automod: "automod",
            logging: "logging",
            utility: "utility",
            voice: "voice",
            customrole: "customrole",
            extra: "extra",
          };

          commands = client.commands
            .filter((x) => x.category && x.category === categoryMap[category])
            .map((x) => `\`${x.name}\``);

          const categoryEmbed = new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setThumbnail(i.guild.iconURL({ dynamic: true }))
            .setDescription(
              `**${
                category.charAt(0).toUpperCase() + category.slice(1)
              } Commands**\n${commands.join(", ")}`
            );

          // Check if interaction can be replied to
          if (i.replied || i.deferred) {
            await i.editReply({ embeds: [categoryEmbed] });
          } else {
            await i.reply({ embeds: [categoryEmbed], ephemeral: true });
          }
        }
      } catch (error) {
        // If interaction fails, try to send a followup
        try {
          if (!i.replied && !i.deferred) {
            await i.followUp({
              content: "An error occurred while processing your request.",
              ephemeral: true,
            });
          }
        } catch (followUpError) {
          console.error("Error handling interaction:", error);
          console.error("Error sending followup:", followUpError);
        }
      }
    });

    collector.on("end", () => {
      // Disable all components when collector ends
      try {
        const disabledRow1 = row1.setComponents(
          row1.components.map((button) => button.setDisabled(true))
        );
        const disabledRow2 = row2.setComponents(
          row2.components.map((button) => button.setDisabled(true))
        );
        const disabledSelectMenu = new ActionRowBuilder().addComponents(
          selectMenu.setDisabled(true)
        );

        helpMessage
          .edit({
            components: [disabledSelectMenu, disabledRow1, disabledRow2],
          })
          .catch(console.error);
      } catch (error) {
        console.error("Error disabling components:", error);
      }
    });
  },
};
