const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");

module.exports = {
  name: "join",
  aliases: ["j"],
  category: "music",
  description: "Join a voice channel",
  usage: "{prefix}join",
  run: async (client, message, args) => {
    try {
      // Check if the user is in a voice channel
      const { channel } = message.member.voice;
      if (!channel) {
        return message.reply("You need to join a voice channel first!");
      }

      // Check if bot is already in a voice channel in this guild
      const existingConnection = getVoiceConnection(message.guild.id);
      if (existingConnection) {
        const currentChannel = message.guild.channels.cache.get(existingConnection.joinConfig.channelId);
        if (currentChannel.id !== channel.id) {
          return message.reply(`I'm already in ${currentChannel.name}!!`);
        }
        return message.reply(`I'm already in ${channel.name}!`);
      }

      // Join the voice channel
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      // Handle connection state changes
      connection.on(VoiceConnectionStatus.Ready, () => {
        message.channel.send(`Successfully joined ${channel.name}!`);
      });

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        message.channel.send(`Disconnected from ${channel.name}.`);
        connection.destroy();
      });

      connection.on("error", (error) => {
        console.error("Voice connection error:", error);
        message.channel.send("An error occurred while trying to join the voice channel.");
      });
    } catch (error) {
      console.error("Error in join command:", error);
      message.channel.send("An unexpected error occurred.");
    }
  },
};