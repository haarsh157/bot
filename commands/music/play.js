// const {
//   joinVoiceChannel,
//   createAudioPlayer,
//   createAudioResource,
//   VoiceConnectionStatus,
//   getVoiceConnection,
// } = require("@discordjs/voice");
// const ytdl = require("ytdl-core");
// const play = require("play-dl");

// const yt =
//   /^(?:(?:(?:https?:)?\/\/)?(?:www\.)?)?(?:youtube\.com\/(?:[^\/\s]+\/\S+\/|(?:c|channel|user)\/\S+|embed\/\S+|watch\?(?=.*v=\S+)(?:\S+&)*v=\S+)|(?:youtu\.be\/\S+)|yt:\S+)$/i;

// module.exports = {
//   name: "play",
//   aliases: ["p"],
//   category: "music",
//   description: "Play a song from a query, YouTube link, or Spotify link",
//   usage: "{prefix}play <song name/YouTube link/Spotify link>",
//   run: async (client, message, args) => {
//     try {
//       const query = args.join(" ");
//       if (!query) {
//         return message.reply("Please provide a song name, YouTube link, or Spotify link.");
//       }

//       const { channel } = message.member.voice;
//       if (!channel) {
//         return message.reply("You need to join a voice channel first!");
//       }

//       let connection = getVoiceConnection(message.guild.id);
//       if (!connection) {
//         connection = joinVoiceChannel({
//           channelId: channel.id,
//           guildId: message.guild.id,
//           adapterCreator: message.guild.voiceAdapterCreator,
//         });

//         connection.on(VoiceConnectionStatus.Ready, () => {
//           console.log(`Connected to ${channel.name}`);
//         });
//       }

//       const player = createAudioPlayer();
//       connection.subscribe(player);

//       let stream;
//       if (ytdl.validateURL(query)) {
//         stream = ytdl(query, { filter: "audioonly" });
//       } else if (play.is_expired()) {
//         await play.refreshToken();
//         try {
//           const { stream: songStream } = await play.stream(query);
//           stream = songStream;
//       } catch (err) {
//           console.error("play-dl error:", err);
//           return message.reply("Failed to fetch the audio stream. Please try again.");
//       }

//       } else {
//         const searchResult = await play.search(query, { limit: 1 });
//         if (!searchResult || searchResult.length === 0) {
//           return message.reply("No results found for your query.");
//         }
//         const { stream: songStream } = await play.stream(searchResult[0].url);
//         stream = songStream;
//       }

//       const resource = createAudioResource(stream, { inlineVolume: true });
//       resource.volume.setVolume(0.5); // Set initial volume to 50%

//       player.play(resource);
//       player.on("error", (error) => {
//         console.error("Audio player error:", error);
//         message.channel.send("An error occurred while playing the audio.");
//       });

//       message.channel.send(`Now playing: ${query}`);
//     } catch (error) {
//       console.error("Error in play command:", error);
//       message.channel.send("An unexpected error occurred.");
//     }
//   },
// };

// const { EmbedBuilder } = require("discord.js");
// const { QueryType } = require("discord-player");

// module.exports = {
//   name: "play",
//   aliases: ["p"],
//   category: "music",
//   description: "Play a song from a query, YouTube link, or playlist",
//   usage: "{prefix}play <song name/YouTube link/playlist link>",
//   run: async (client, message, args) => {
//     // Check if user provided arguments
//     if (!args.length)
//       return message.reply("Please provide a song name, URL, or playlist link!");

//     // Check if user is in a voice channel
//     if (!message.member.voice.channel)
//       return message.reply("You need to be in a voice channel to play music!");

//     // Create or get the server queue using the new API
//     const queue = client.player.nodes.create(message.guild, {
//       metadata: {
//         channel: message.channel,
//       },
//     });

//     try {
//       // Connect to the voice channel
//       if (!queue.connection) await queue.connect(message.member.voice.channel);
//     } catch (error) {
//       console.error("Error connecting to voice channel:", error);
//       return message.reply("Unable to join your voice channel!");
//     }

//     let embed = new EmbedBuilder();

//     const query = args.join(" ");
//     console.log(`Received query: ${query}`); // Log the query for debugging

//     // Detect if the query is a YouTube URL
//     const isYouTubeUrl = query.match(
//       /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/[^\s]+$/i
//     );

//     try {
//       let result;

//       if (isYouTubeUrl && query.includes("list=")) {
//         // If the query is a YouTube playlist URL
//         result = await client.player.search(query, {
//           requestedBy: message.author,
//           searchEngine: QueryType.YOUTUBE_PLAYLIST,
//         });
//         console.log(result)

//         if (!result || !result.tracks.length)
//           return message.reply("No playlists found with the provided URL!");

//         const playlist = result.playlist;
//         await queue.addTracks(result.tracks);

//         embed
//           .setDescription(
//             `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the queue.`
//           )
//           .setThumbnail(playlist.thumbnail);

//       } else if (isYouTubeUrl) {
//         // If the query is a single YouTube video URL
//         result = await client.player.search(query, {
//           requestedBy: message.author,
//           searchEngine: QueryType.YOUTUBE_VIDEO,
//         });
//         console.log(result)

//         if (!result || !result.tracks.length)
//           return message.reply("No results found!");

//         const song = result.tracks[0];
//         await queue.addTrack(song);

//         embed
//           .setDescription(
//             `**[${song.title}](${song.url})** has been added to the queue.`
//           )
//           .setThumbnail(song.thumbnail)
//           .setFooter({ text: `Duration: ${song.duration}` });

//       } else {
//         // If the query is a search term
//         result = await client.player.search(query, {
//           requestedBy: message.author,
//           searchEngine: QueryType.AUTO,
//         });
//         console.log(result)

//         if (!result || !result.tracks.length)
//           return message.reply("No results found!");

//         const song = result.tracks[0];
//         await queue.addTrack(song);

//         embed
//           .setDescription(
//             `**[${song.title}](${song.url})** has been added to the queue.`
//           )
//           .setThumbnail(song.thumbnail)
//           .setFooter({ text: `Duration: ${song.duration}` });
//       }

//       // Play the song if not already playing
//       if (!queue.playing) await queue.play();

//       // Send the embed as a response
//       message.channel.send({ embeds: [embed] });
//     } catch (error) {
//       console.error("Error handling the play command:", error);
//       return message.reply("An error occurred while trying to play the song.");
//     }
//   },
// };


const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const play = require('play-dl');
const { Collection } = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
    NoSubscriberBehavior
} = require('@discordjs/voice');
const config = require(`${process.cwd()}/config.json`);

// Initialize play-dl's YouTube functionality
play.setToken({
    youtube: {
        cookie: config.YOUTUBE_COOKIE // Optional
    }
});

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "music",
    description: "Play a song from a query, YouTube link, or playlist",
    usage: "{prefix}play <song name/YouTube link/playlist link>",
    run: async (client, message, args) => {
        try {
            if (!client.queue) {
                client.queue = new Collection();
            }

            const member = message.member;
            const voiceChannel = member.voice.channel;

            if (!voiceChannel) {
                return message.reply({
                    content: "You need to be in a voice channel to play music!"
                });
            }

            const permissions = voiceChannel.permissionsFor(client.user);
            if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
                return message.reply({
                    content: "I need permissions to join and speak in your voice channel!"
                });
            }

            // Validate args
            if (!args || args.length === 0) {
                return message.reply({
                    content: "Please provide a song to play."
                });
            }

            const searchString = args.join(" ");
            if (!searchString) {
                return message.reply({
                    content: "Please provide a valid search string."
                });
            }

            const serverQueue = client.queue.get(message.guild.id);
            
            // Handle YouTube URL or search
            let videoUrl;
            let videoTitle;
            let videoThumbnail;

            try {
                const videoUrlType = play.yt_validate(searchString);

                if (videoUrlType === 'video') {
                    const videoInfo = await play.video_info(searchString);
                    videoUrl = searchString;
                    videoTitle = videoInfo.video_details.title;
                    videoThumbnail = videoInfo.video_details.thumbnails[0].url;
                } else {
                    const searchResults = await play.search(searchString, { limit: 1 });

                    if (!searchResults || searchResults.length === 0) {
                        return message.reply({
                            content: "No search results found!"
                        });
                    }

                    videoUrl = searchResults[0].url;
                    videoTitle = searchResults[0].title;
                    videoThumbnail = searchResults[0].thumbnails[0].url;
                }
            } catch (error) {
                console.error("Search/validation error:", error);
                return message.reply({
                    content: "Failed to process the video. Please try again."
                });
            }

            const song = {
                title: videoTitle,
                url: videoUrl,
                thumbnail: videoThumbnail
            };

            if (serverQueue) {
                serverQueue.songs.push(song);

                const addedEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('Added to Queue')
                    .setDescription(`**${song.title}** has been added to the queue!`)
                    .setThumbnail(song.thumbnail);

                return message.reply({ embeds: [addedEmbed] });
            }

            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                player: null,
                songs: [],
                volume: 1,
                playing: true,
            };

            client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);

            const playSong = async (song) => {
                const queue = client.queue.get(message.guild.id);
                if (!song) {
                    if (queue.connection) {
                        queue.connection.destroy();
                    }
                    client.queue.delete(message.guild.id);
                    return;
                }

                try {
                    const { stream, type } = await play.stream(song.url, {
                        discordPlayerCompatibility: true,
                        quality: 1,
                        seekTime: 0
                    });

                    const resource = createAudioResource(stream, {
                        inputType: type,
                        inlineVolume: true
                    });

                    if (!queue.player) {
                        queue.player = createAudioPlayer({
                            behaviors: {
                                noSubscriber: NoSubscriberBehavior.Play
                            }
                        });

                        queue.player.on(AudioPlayerStatus.Playing, () => {
                            console.log('Started playing:', song.title);
                        });

                        queue.player.on(AudioPlayerStatus.Idle, () => {
                            console.log('Finished playing:', song.title);
                            queue.songs.shift();
                            playSong(queue.songs[0]);
                        });

                        queue.player.on('error', error => {
                            console.error('Player error:', error);
                            queue.songs.shift();
                            playSong(queue.songs[0]);
                        });

                        queue.connection.subscribe(queue.player);
                    }

                    resource.volume?.setVolume(queue.volume);
                    queue.player.play(resource);

                    const playingEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Now Playing')
                        .setDescription(`🎶 **${song.title}**`)
                        .setThumbnail(song.thumbnail);

                    await queue.textChannel.send({ embeds: [playingEmbed] });
                } catch (error) {
                    console.error('Playback error:', error);
                    queue.textChannel.send({
                        content: `An error occurred while playing the song. Skipping to next song...`
                    });
                    queue.songs.shift();
                    playSong(queue.songs[0]);
                }
            };

            try {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: true
                });

                await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

                queueConstruct.connection = connection;
                await playSong(queueConstruct.songs[0]);
            } catch (error) {
                console.error(`Voice connection error:`, error);
                client.queue.delete(message.guild.id);
                return message.reply({
                    content: `Failed to join the voice channel. Error: ${error.message}`
                });
            }
        } catch (error) {
            console.error(error);
            return message.reply({
                content: `An error occurred: ${error.message}`
            });
        }
    },
};
