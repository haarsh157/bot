const {
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "vcmoveall",
  category: "voice",
  run: async (client, message, args) => {
    const guildId = message.guild.id;
    let prefix = await client.db.get(`prefix_${guildId}`); 

    if (!prefix) {
      prefix = "!"; 
    }

    if (args.length < 1) {
      const usageMessage = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `**Usage:** \`${prefix}vcmoveall <channel>\`\n\nYou must mention a valid voice channel to move the members to.`
        );
      return message.channel.send({ embeds: [usageMessage] });
    }

    if (
      !message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `You must have \`Move Members\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.Flags.MoveMembers
      )
    ) {
      const error = new EmbedBuilder()
        .setColor(parseInt("0xc7b700", 16))
        .setDescription(
          `I must have \`Move Members\` permission to use this command.`
        );
      return message.channel.send({ embeds: [error] });
    }

    if (!message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`You must be connected to a voice channel first.`),
        ],
      });
    }

    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(`Invalid or non-existent voice channel provided.`),
        ],
      });
    }

    let own = message.author.id === message.guild.ownerId;
    if (
      !own &&
      message.member.roles.highest.position <=
        message.guild.members.me.roles.highest.position
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.cross} | You must have a higher role than me to use this command.`
            ),
        ],
      });
    }

    try {
      let i = 0;
      message.member.voice.channel.members.forEach(async (member) => {
        i++;
        await member.voice.setChannel(
          channel,
          `${message.author.tag} | ${message.author.id}`
        );
        await client.util.sleep(1000);
      });

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `${client.emoji.tick} | Successfully moved ${i} members to ${channel}.`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(parseInt("0xc7b700", 16))
            .setDescription(
              `I don't have the required permissions to move members to ${channel}.`
            ),
        ],
      });
    }
  },
};
