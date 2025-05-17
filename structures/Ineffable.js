const { Client, Collection, WebhookClient } = require("discord.js");
const { Player } = require("discord-player");
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require("fs");
const mongoose = require("mongoose");
const Utils = require("./util.js");
const { glob } = require("glob");
const { Database } = require("quickmongo");
const axios = require("axios");
const Sweepers = require("./sweepers.js");
const { QuickDB } = require("quick.db");
const chalk = require("chalk");

module.exports = class wixbot extends Client {
  constructor() {
    super({
      intents: 3276543,
      fetchAllMembers: false,
      shards: "auto",
      disableEveryone: true,
    });

    process.emitWarning = (warning, type, code, ctor, detail) => {
      if (
        warning.includes("DeprecationWarning") ||
        warning.includes("ExperimentalWarning") ||
        warning.includes("MaxListenersExceededWarning")
      ) {
        return;
      }
      process.emit("warning", warning, type, code, ctor, detail);
    };

    this.config = require(`${process.cwd()}/config.json`);
    this.logger = require("./logger");
    this.commands = new Collection();
    this.categories = fs.readdirSync("./commands/");
    this.emoji = {
      tick: "<:right:1138768598534455346>",
      cross: "<:wrong:1138768256673513505>",
      dot: "•",
    };
    this.util = new Utils(this);
    this.Sweeper = new Sweepers(this);
    this.color = `0x000000`;
    this.support = ` `;
    this.cooldowns = new Collection();
    this.snek = require("axios");
    // webhook3
    this.ratelimit = new WebhookClient({
      url: "https://discord.com/api/webhooks/1321065165709639762/em9Id3z_4STGLOE7xBsfxhCB7RxWyfwCGjeBcfa_XUuDlBsF82a6qFve3pYfKh7Pmos9",
    });
    // webhook 4
    this.error = new WebhookClient({
      url: "https://discord.com/api/webhooks/1321065298673139766/b9C09guS4feyzWfnKVwOo7yVG6UCOD1O7UXuldwe4Qmvu7Y636RTXcjYLrfOFPXt85Fo",
    });

    this.on("error", (error) => {
      this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
    });
    process.on("unhandledRejection", (error) => {
      this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
    });
    process.on("uncaughtException", (error) => {
      this.error.send(`\`\`\`js\n${error.stack}\`\`\``);
    });
    process.on("warning", (warn) => {
      this.error.send(`\`\`\`js\n${warn}\`\`\``);
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
      this.error.send(`\`\`\`js\n${err},${origin}\`\`\``);
    });
    this.on("rateLimit", (info) => {
      this.ratelimit.send({
        content: `\`\`\`js\nTimeout: ${info.timeout},\nLimit: ${info.limit},\nMethod: ${info.method},\nPath: ${info.path},\nRoute: ${info.route},\nGlobal: ${info.global}\`\`\``,
      });
    });
  }

  async initializeData() {
    try {
      this.database = new QuickDB();
      this.logger.log(
        `${chalk.green("Connecting to SQL database...")}`,
        "event"
      );

      this.logger.log(
        `${chalk.green("SQL Database connected successfully.")}`,
        "ready"
      );
    } catch (error) {
      this.logger.error(
        `${chalk.red("Failed to connect to SQL Database:")} ${error.message}`
      );
      throw error;
    }
  }

  async initializeMongoose() {
    try {
      this.db = new Database(this.config.MONGO_DB);
      await this.db.connect();
      this.logger.log(`${chalk.green("Connecting to MongoDB...")}`, "event");

      await mongoose.connect(this.config.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.logger.log(
        `${chalk.green("MongoDB connected successfully.")}`,
        "ready"
      );
    } catch (error) {
      this.logger.error(
        `${chalk.red("Failed to connect to MongoDB:")} ${error.message}`
      );
      throw error;
    }
  }

  async loadPlayer() {
    try {
      // Initialize the player with the client
      this.player = new Player(this);
      
      // Load the default extractors using the new method
      await this.player.extractors.loadMulti(DefaultExtractors);

      // Configure player events
      this.player.events.on('error', (queue, error) => {
        this.logger.error(`Player error: ${error.message}`);
      });

      this.player.events.on('playerError', (queue, error) => {
        this.logger.error(`Player playback error: ${error.message}`);
      });

      this.logger.log(
        `${chalk.green("Music player initialized successfully.")}`,
        "ready"
      );
    } catch (error) {
      this.logger.error(
        `${chalk.red("Failed to connect to Player:")} ${error.message}`
      );
      throw error;
    }
  }

  async loadEvents() {
    try {
      const eventsPath = `${process.cwd()}/events/`;
      const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".js"));

      this.logger.log(
        `${chalk.yellow("Loading events...")} Found ${chalk.cyan(
          eventFiles.length
        )} event(s).`,
        "event"
      );

      for (const file of eventFiles) {
        const event = require(`${eventsPath}${file}`);
        if (typeof event === "function") {
          event(this);
          this.logger.log(
            `${chalk.green("Loaded event:")} ${chalk.blue(file)}`,
            "event"
          );
        } else {
          this.logger.warn(
            `${chalk.red("Invalid event file:")} ${chalk.blue(file)}`
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `${chalk.red("Error loading events:")} ${error.message}`
      );
      throw error;
    }
  }

  async loadLogs() {
    try {
      const logsPath = `${process.cwd()}/logs/`;
      const logFiles = fs
        .readdirSync(logsPath)
        .filter((file) => file.endsWith(".js"));

      this.logger.log(
        `${chalk.yellow("Loading logs...")} Found ${chalk.cyan(
          logFiles.length
        )} log file(s).`,
        "event"
      );

      for (const file of logFiles) {
        const log = require(`${logsPath}${file}`);
        if (typeof log === "function") {
          log(this);
          this.logger.log(
            `${chalk.green("Loaded log:")} ${chalk.blue(file)}`,
            "event"
          );
        } else {
          this.logger.warn(
            `${chalk.red("Invalid log file:")} ${chalk.blue(file)}`
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `${chalk.red("Error loading log files:")} ${error.message}`
      );
      throw error;
    }
  }

  async loadMain() {
    try {
      const commandsPath = `${process.cwd()}/commands`;
      const commandFiles = [];

      // Get all command directories
      const commandDirectories = fs.readdirSync(commandsPath);

      // Collect all command files from directories
      for (const directory of commandDirectories) {
        const files = fs
          .readdirSync(`${commandsPath}/${directory}`)
          .filter((file) => file.endsWith(".js"));

        for (const file of files) {
          commandFiles.push(`${commandsPath}/${directory}/${file}`);
        }
      }

      // Process and load each command file
      for (const filePath of commandFiles) {
        const command = require(filePath);
        const directory = filePath.split("/").slice(-2, -1)[0];

        if (command.name) {
          const commandProperties = { directory, ...command };
          this.commands.set(command.name, commandProperties);
          this.logger.log(
            `${chalk.green("Loaded command:")} ${chalk.blue(command.name)}`,
            "cmd"
          );
        } else {
          this.logger.warn(
            `${chalk.red("Invalid command file:")} ${chalk.blue(filePath)}`
          );
        }
      }

      this.logger.log(
        `${chalk.yellow("Finished loading commands.")} Total: ${chalk.cyan(
          this.commands.size
        )}.`,
        "cmd"
      );
    } catch (error) {
      this.logger.error(
        `${chalk.red("Error loading commands:")} ${error.message}`
      );
      throw error;
    }
  }
};
