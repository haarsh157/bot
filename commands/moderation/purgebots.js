const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "purgebot",
  aliases: ["pb"],
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

    const amount = args[0] ? parseInt(args[0]) : 10;

    if (!amount || isNaN(amount)) {
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

    deleteBotMessages(message.channel, amount);

    const confirmationMessage = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(parseInt("0xc7b700", 16))
          .setDescription(
            `${client.emoji.tick} | Successfully deleted ${amount} bot messages.`
          ),
      ],
    });

    setTimeout(() => {
      confirmationMessage.delete().catch(() => {});
    }, 2000);
  },
};

async function deleteBotMessages(channel, amount) {
  const messages = await channel.messages.fetch({ limit: 100 });
  const botMessagesArray = Array.from(
    messages.filter((msg) => msg.author.bot).values()
  );

  const toDelete = botMessagesArray.slice(0, amount);

  if (toDelete.length > 0) {
    await channel.bulkDelete(toDelete, true).catch(() => {});
  }
}
