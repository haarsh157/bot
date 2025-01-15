const { ActivityType } = require("discord.js");

module.exports = async (client) => {
  client.on("ready", async () => {
    // Set the bot's presence
    client.user.setPresence({
      activities: [
        {
          name: "=help at gg/inef.",
          type: ActivityType.Listening,
        },
      ],
      status: "online",
    });

    console.log(`Logged in as ${client.user.tag}`);
  });
};
