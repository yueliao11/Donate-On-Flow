import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

export class TelegramBotService {
  private bot: Telegraf;

  constructor(token: string) {
    this.bot = new Telegraf(token);
    this.setupCommands();
    this.setupMessageHandlers();
  }

  private setupCommands() {
    this.bot.command('start', (ctx) => {
      ctx.reply('Welcome to CharityFlow! 🌟\n\nI can help you:\n' +
        '📋 Create new charity projects\n' +
        '💰 Track donations\n' +
        '📢 Share projects with your community\n' +
        '📊 View project statistics\n\n' +
        'Use /help to see all available commands.');
    });

    this.bot.command('help', (ctx) => {
      ctx.reply('Available commands:\n\n' +
        '/start - Start the bot\n' +
        '/create - Create a new project\n' +
        '/projects - List your projects\n' +
        '/donate - Make a donation\n' +
        '/stats - View statistics');
    });

    this.bot.command('create', (ctx) => {
      ctx.reply('Let\'s create a new charity project! 🎯\n' +
        'Please provide the following information:\n\n' +
        '1. Project title\n' +
        '2. Description\n' +
        '3. Target amount\n' +
        '4. End date\n\n' +
        'You can also use our web interface for a better experience: [Your Web URL]');
    });
  }

  private setupMessageHandlers() {
    this.bot.on(message('text'), (ctx) => {
      // Handle text messages
      ctx.reply('I received your message. Please use commands to interact with me.');
    });

    this.bot.on(message('photo'), (ctx) => {
      // Handle photo uploads for projects
      ctx.reply('Thanks for sharing the photo! You can add it to your project.');
    });
  }

  public async shareProject(chatId: string, projectData: any) {
    const message = `🌟 New Charity Project!\n\n` +
      `📋 ${projectData.title}\n` +
      `💬 ${projectData.description}\n` +
      `🎯 Target: ${projectData.targetAmount} FLOW\n` +
      `⏰ Ends: ${projectData.endDate}\n\n` +
      `Support this cause: [Project Link]`;

    await this.bot.telegram.sendMessage(chatId, message);
  }

  public async sendDonationUpdate(chatId: string, donationData: any) {
    const message = `🎉 New Donation Received!\n\n` +
      `💰 Amount: ${donationData.amount} FLOW\n` +
      `👤 From: ${donationData.donor}\n` +
      `📊 Project Progress: ${donationData.progress}%`;

    await this.bot.telegram.sendMessage(chatId, message);
  }

  public launch() {
    this.bot.launch();
  }
}
