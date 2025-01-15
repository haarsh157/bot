const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "queue",
  category: "music",
  description: "Display the current song queue",
  usage: "{prefix}queue",
  run: async (client, message, args) => {
    // Retrieve the queue for the guild
    const serverQueue = message.client.queue?.get(message.guild.id);

    if (!serverQueue || !serverQueue.songs.length) {
      return message.reply("There is nothing playing in the queue.");
    }

    // Map the song queue into a formatted string
    const queueDescription = serverQueue.songs
      .map((song, index) => `**${index + 1}.** ${song.title}`)
      .join("\n");

    // Embed for the song queue
    const queueEmbed = new EmbedBuilder()
      .setColor("#0099ff") // You can customize the embed color
      .setTitle("🎶 Song Queue")
      .setDescription(
        `**Now Playing:** ${serverQueue.songs[0].title}\n\n${queueDescription}`
      )
      .setFooter({ text: `Requested by ${message.author.tag}` })
      .setTimestamp();

    // Send the embed to the channel
    return message.channel.send({ embeds: [queueEmbed] });
  },
};
