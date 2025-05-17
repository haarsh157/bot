require("dotenv").config();
require("module-alias/register");
const path = require("path");
const wixbot = require("./structures/wixbot");
const config = require("./config.json");

// Utility function for controlled delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class BotInitializer {
  constructor() {
    this.client = new wixbot();
    this.config = config;
  }

  async initializeMongoose() {
    console.log("Initializing mongoose...");
    await this.client.initializeMongoose();
    console.log("Connected to DB successfully.");
  }

  async initializeData() {
    console.log("Initializing data...");
    await this.client.initializeData();
    console.log("Data initialized");
  }

  async waitForStartup() {
    console.log("Waiting for 3 seconds...");
    await delay(3000);
    console.log("Wait completed");
  }

  async loadEvents() {
    console.log("Loading events...");
    await this.client.loadEvents();
    console.log("Events loaded");
  }

  async loadPlayer() {
    console.log("Initializing player...");
    await this.client.loadPlayer();
    console.log("Player initialized");
  }

  async loadLogs() {
    console.log("Loading logs...");
    await this.client.loadLogs();
    console.log("Logs loaded.");
  }

  async loadMain() {
    console.log("Loading main...");
    await this.client.loadMain();
    console.log("Main Loaded.");
  }

  async login() {
    console.log("Logging in...");
    await this.client.login(this.config.TOKEN);
    console.log("Login successful");
  }

  async initialize() {
    try {
      await this.initializeMongoose();
      await this.initializeData();
      await this.waitForStartup();
      await this.loadEvents();
      await this.loadPlayer();
      await this.loadLogs();
      await this.loadMain();
      await this.login();

      console.log("Logged in");
    } catch (error) {
      console.error("Fatal error during initialization:", error);
      // Proper error handling - you might want to attempt reconnection or graceful shutdown
      process.exit(1);
    }
  }
}

// Usage
const botInitializer = new BotInitializer();
botInitializer.initialize();

// Handle uncaught errors
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
