const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "purge",
  aliases: ["clear"],
  category: "mod",
  premium: true,

  run: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have \`Manage Messages\` permission to use this command.`
            ),
        ],
      });
    }

    const amount = args[0];
    if (!amount) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must provide the number of messages to be deleted.`
            ),
        ],
      });
    }

    if (!parseInt(amount)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must provide a valid number of messages to be deleted.`
            ),
        ],
      });
    }

    if (amount >= 1000) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You can't delete more than **999** messages at a time.`
            ),
        ],
      });
    }

    await message.delete().catch((_) => {});

    deleteMessages(message.channel, amount);

    const confirmationMessage = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `${client.emoji.tick} | Successfully deleted ${amount} messages.`
          ),
      ],
    });

    setTimeout(() => {
      confirmationMessage.delete().catch(() => {});
    }, 2000);
  },
};

async function deleteMessages(channel, amount) {
  for (let i = amount; i > 0; i -= 100) {
    if (i > 100) {
      await channel.bulkDelete(100, true).catch(() => {});
    } else {
      await channel.bulkDelete(i, true).catch(() => {});
    }
  }
}
