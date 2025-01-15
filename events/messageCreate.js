const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  Collection,
  WebhookClient,
} = require("discord.js");

module.exports = async (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    try {
      let check = await client.util.BlacklistCheck(message?.guild);
      if (check) return;

      let uprem = await client.db.get(`uprem_${message.author.id}`);
      let upremend = await client.db.get(`upremend_${message.author.id}`);
      // user premium ^^
      let sprem = await client.db.get(`sprem_${message.guild.id}`);
      let spremend = await client.db.get(`spremend_${message.guild.id}`);
      // server premium ^^

      let scot = 0;
      let slink = "https://discord.gg/";

      if (upremend && Date.now() >= upremend) {
        let upremcount =
          (await client.db.get(`upremcount_${message.author.id}`)) || 0;
        let upremserver =
          (await client.db.get(`upremserver_${message.author.id}`)) || [];

        for (let i = 0; i < upremserver.length; i++) {
          scot += 1;
          await client.db.delete(`sprem_${upremserver[i]}`);
          await client.db.delete(`spremend_${upremserver[i]}`);
          await client.db.delete(`spremown_${upremserver[i]}`);
        }

        await client.db.delete(`uprem_${message.author.id}`);
        await client.db.delete(`upremend_${message.author.id}`);
        await client.db.delete(`upremserver_${message.author.id}`);

        const premrow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Buy Premium")
            .setURL("https://discord.gg/")
            .setStyle(ButtonStyle.Link)
        );

        message.author
          .send({
            embeds: [
              new EmbedBuilder()
                .setColor(`0xc7b700`)
                .setDescription(
                  `Your Premium Has Got Expired.\nTotal **\`${scot}\`** Servers [Premium](https://discord.gg/) was removed.\nClick [here](https://discord.gg/) To Buy [Premium](https://discord.gg/).`
                ),
            ],
            components: [premrow],
          })
          .catch((err) => console.error("Failed to send DM:", err));
      }

      if (spremend && Date.now() >= spremend) {
        let scount = 0;

        let us = await client.db.get(`spremown_${message.guild.id}`);

        let upremserver = (await client.db.get(`upremserver_${us}`)) || [];
        let upremcount = (await client.db.get(`upremcount_${us}`)) || 0;

        let spremown = await client.db
          .get(`spremown_${message.guild.id}`)
          .then((r) => client.db.get(`upremend_${r}`));

        await client.db.delete(`sprem_${message.guild.id}`);
        await client.db.delete(`spremend_${message.guild.id}`);

        if (spremown && Date.now() > spremown) {
          await client.db.delete(`upremcount_${us}`);
          await client.db.delete(`uprem_${us}`);
          await client.db.delete(`upremend_${us}`);

          for (let i = 0; i < upremserver.length; i++) {
            scount += 1;
            await client.db.delete(`sprem_${upremserver[i]}`);
            await client.db.delete(`spremend_${upremserver[i]}`);
            await client.db.delete(`spremown_${upremserver[i]}`);
          }

          try {
            const premrow = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Buy Premium")
                .setURL("https://discord.gg/")
                .setStyle(ButtonStyle.Link)
            );

            await client.users.cache
              .get(`${us}`)
              .send({
                embeds: [
                  new EmbedBuilder() // Updated from MessageEmbed to EmbedBuilder
                    .setColor(`0xc7b700`)
                    .setDescription(
                      `Your Premium Has Got Expired.\nTotal **\`${scount}\`** Servers [Premium](https://discord.gg/) was removed.\nClick [here](https://discord.gg/) To Buy [Premium](https://discord.gg/).`
                    ),
                ],
                components: [premrow],
              })
              .catch((err) => console.error("Failed to send DM:", err));
          } catch (errors) {
            console.error("Error while sending DM:", errors);
          }
        }

        await client.db.delete(`upremserver_${us}`);
        await client.db.delete(`spremown_${message.guild.id}`);

        const premrow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Buy Premium")
            .setURL("https://discord.gg/")
            .setStyle(ButtonStyle.Link)
        );

        message.channel
          .send({
            embeds: [
              new EmbedBuilder() // Updated from MessageEmbed to EmbedBuilder
                .setColor(`0xc7b700`)
                .setDescription(
                  `The Premium Of This Server Has Got Expired.\nClick [here](https://discord.gg/) To Buy [Premium](https://discord.gg/).`
                ),
            ],
            components: [premrow],
          })
          .catch((err) => console.error("Failed to send message:", err));
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Invite Me")
          .setStyle(ButtonStyle.Link)
          .setURL(
            `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
          ),
        new ButtonBuilder()
          .setLabel("Support")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.gg/`)
      );

      client.util.setPrefix(message, client);
      client.util.noprefix();
      client.util.blacklist();

      let blacklistdb = client.blacklist || [];
      if (
        blacklistdb.includes(message.author.id) &&
        !client.config.owner.includes(message.author.id)
      ) {
        return;
      }

      let user = await client.users.fetch(`865411261847306241`);
      if (message.content === `<@${client.user.id}>`) {
        client.util.setPrefix(message, client);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setTitle(message.guild.name)
              .setDescription(
                `Heyy ${message.author}, \nMy Prefix here is: \`${message.guild.prefix}\`\nServer ID: \`${message.guild.id}\`\n\nType \`${message.guild.prefix}help\` To Get Command List.`
              )
              .setFooter({
                text: `Developed By Someone`,
                iconURL: user.displayAvatarURL({
                  dynamic: true,
                }),
              }),
          ],
          components: [row],
        });
      }

      const noPrefixKey = `noprefix_${message.guild.id}`;
      const noPrefixUsers = (await client.db.get(noPrefixKey)) || [];

      let prefix = message.guild.prefix || "&";
      if (!noPrefixUsers.includes(message.author.id)) {
        if (!message.content.startsWith(prefix)) return;
      }

      const args =
        noPrefixUsers.includes(message.author.id) == false
          ? message.content.slice(prefix.length).trim().split(/ +/)
          : message.content.startsWith(prefix) == true
          ? message.content.slice(prefix.length).trim().split(/ +/)
          : message.content.trim().split(/ +/);

      const cmd = args.shift().toLowerCase();

      const command =
        client.commands.get(cmd) ||
        client.commands.find((c) => c.aliases && c.aliases.includes(cmd));

      if (!command) return;
      const ignore = (await client.db?.get(`ignore_${message.guild.id}`)) ?? {
        channel: [],
        role: [],
      };
      if (
        ignore.channel.includes(message.channel.id) &&
        !message.member.roles.cache.some((role) =>
          ignore.role.includes(role.id)
        )
      ) {
        console.log(
          `Command '${cmd}' ignored in channel ${message.channel.name} (${message.channel.id}) of guild ${message.guild.name} (${message.guild.id})`
        );
        return await message.channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setColor(parseInt("0xc7b700", 16))
                .setDescription(
                  `This channel is currently in my ignore list, so commands can't be executed here. Please try another channel or reach out to the server administrator for assistance.`
                ),
            ],
          })
          .then((x) => {
            setTimeout(() => {
              () => msg.delete().catch(() => {});
            }, 3000);
          });
      }

      message.guild.prefix = prefix || "&";
      const commandLimit = 5;
      if (
        client.config.cooldown &&
        !client.config.owner.includes(message.author.id)
      ) {
        if (!client.cooldowns.has(command.name)) {
          client.cooldowns.set(command.name, new Collection());
        }
        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown ? command.cooldown : 3) * 1000;
        if (timestamps.has(message.author.id)) {
          const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;
          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            let commandCount =
              timestamps.get(`${message.author.id}_count`) || 0;
            commandCount++;
            timestamps.set(`${message.author.id}_count`, commandCount);

            if (commandCount > commandLimit) {
              let blacklistedUsers =
                (await client.data.get(`blacklist_${client.user.id}`)) || [];
              if (!blacklistedUsers.includes(message.author.id)) {
                blacklistedUsers.push(message.author.id);
                await client.data.set(
                  `blacklist_${client.user.id}`,
                  blacklistedUsers
                );
                client.util.blacklist();
              }

              const ricky = new EmbedBuilder()
                .setColor(parseInt("0xc7b700", 16))
                .setTitle("Blacklisted for Spamming")
                .setDescription(
                  `You have been blacklisted for spamming commands. Please refrain from such behavior.`
                )
                .addFields({
                  name: "Support Server",
                  value:
                    "[Join our support server](https://discord.gg/zB6qdkETXr)",
                  inline: true,
                })
                .setTimestamp();

              return message.channel.send({ embeds: [ricky] });
            }

            return message.channel
              .send({
                embeds: [
                  new EmbedBuilder()
                    .setColor(parseInt("0x000000", 16))
                    .setDescription(
                      `Please wait, this command is on cooldown for \`${timeLeft.toFixed(
                        1
                      )}s\``
                    ),
                ],
              })
              .then((msg) => {
                setTimeout(() => msg.delete().catch((e) => {}), 5000);
              });
          }
        }
        timestamps.set(message.author.id, now);
        timestamps.set(`${message.author.id}_count`, 1); // Reset command usage count
        setTimeout(() => {
          timestamps.delete(message.author.id);
          timestamps.delete(`${message.author.id}_count`);
        }, cooldownAmount);
      }

      try {
        await command.run(client, message, args);

        if (command && command.run) {
          // webhook1
          const weboo = new WebhookClient({
            url: `https://discord.com/api/webhooks/1321064496093069412/FMgoOFu4YSO-7faYlJIGF0-GFvICSGfVv8F94HxVBzkAhUV1_M7d4ZXSIvsSH34OyNFa`,
          });

          const commandlog = new EmbedBuilder()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setColor(parseInt("0x000000", 16))
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(
              `**Command Ran In:** \`${message.guild.name} | ${message.guild.id}\`\n` +
                `**Command Ran In Channel:** \`${message.channel.name} | ${message.channel.id}\`\n` +
                `**Command Name:** \`${command.name}\`\n` +
                `**Command Executor:** \`${message.author.tag} | ${message.author.id}\`\n` +
                `**Command Content:** \`${message.content}\``
            );

          weboo.send({ embeds: [commandlog] });
        }
      } catch (err) {
        console.error("An error occurred:", err);

        // Handle rate limiting
        if (err.code === 429) {
          await client.util.handleRateLimit();
        }

        return;
      }
    } catch (err) {
      console.error("An error occurred:", err);
      if (err.code === 429) {
        await client.util.handleRateLimit();
      }
      return;
    }
  });
};
