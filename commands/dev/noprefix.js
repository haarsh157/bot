const { Message, Client, EmbedBuilder } = require("discord.js");
const config = require(`${process.cwd()}/config.json`);

module.exports = {
  name: "noprefix",
  aliases: ["noprefix", "np"],
  category: "mod",
  premium: true,

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const botOwners = [config.owner];
    const botAdmins = config.admin || [];

    const isAuthorized =
      botOwners.includes(message.author.id) ||
      botAdmins.includes(message.author.id);

    if (!isAuthorized) {
      return;
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              "You need to specify an action (`add`, `remove`, or `list`) and a user ID for `add` or `remove`."
            ),
        ],
      });
    }

    const action = args[0].toLowerCase();
    const userId = args[1];

    if (!["add", "+", "a", "remove", "-", "r", "list"].includes(action)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              "Invalid action. Use `add` to exempt a user from prefixes, `remove` to remove them from the no-prefix list, or `list` to view all no-prefix users."
            ),
        ],
      });
    }

    const noPrefixKey = `noprefix_${message.guild.id}`;
    const noPrefixUsers = (await client.db.get(noPrefixKey)) || [];

    if (action === "add" || action === "a" || action === "+") {
      if (!userId || isNaN(userId)) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription("You need to provide a valid user ID to add."),
          ],
        });
      }
      const user = await client.users.fetch(userId).catch(() => null);
      if (!user) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription("Could not find a user with the provided ID."),
          ],
        });
      }

      if (noPrefixUsers.includes(userId)) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                `${user.tag} is already exempt from prefix requirements.`
              ),
          ],
        });
      }

      noPrefixUsers.push(userId);
      await client.db.set(noPrefixKey, noPrefixUsers);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${user.tag} has been added to the no-prefix list.`
            ),
        ],
      });
    } else if (action === "remove" || action === "-" || action === "r") {
      if (!userId || isNaN(userId)) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription("You need to provide a valid user ID to remove."),
          ],
        });
      }

      const user = await client.users.fetch(userId).catch(() => null);
      if (!user) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription("Could not find a user with the provided ID."),
          ],
        });
      }

      if (!noPrefixUsers.includes(userId)) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(`${user.tag} is not in the no-prefix list.`),
          ],
        });
      }

      const updatedList = noPrefixUsers.filter((id) => id !== userId);
      await client.db.set(noPrefixKey, updatedList);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${user.tag} has been removed from the no-prefix list.`
            ),
        ],
      });
    } else if (action === "list") {
      if (noPrefixUsers.length === 0) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(parseInt("0xc7b700", 16))
              .setDescription(
                "No users are currently exempt from prefix requirements."
              ),
          ],
        });
      }

      const userList = await Promise.all(
        noPrefixUsers.map(async (id) => {
          const user = await client.users.fetch(id).catch(() => null);
          return user ? `${user.tag} (${id})` : `Unknown User (${id})`;
        })
      );

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setTitle("No-Prefix Users")
            .setDescription(userList.join("\n")),
        ],
      });
    }
  },
};
