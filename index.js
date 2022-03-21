const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const API = require('./dexguru_api');

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const bot = new TelegramBot(token, {polling: true});


bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
  
    bot.sendMessage(
        chatId,
        '*Welcome to the The Dex Guru Bot! 🤖*\n\nYou can use this bot to track prices, volume, set liquidity alerts, trading volume alerts and much more!\n\nIf you wish to get more information on everything I can do, feel free to use the /help command',
        {parse_mode: 'Markdown'}
    );
});

bot.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;
  
    bot.sendMessage(
        chatId,
        'Overview of all built-in features\n\n*TRACKING*\n/price _tokenaddress_ - Shows data about a given token, only ETH chain supported for now\n/p _tokenaddress_ - Shorthand for the price command, can also be used without argument to track default token\n\n*ALERTING*\n_No commands yet...😔_',
        {parse_mode: 'Markdown'}
    );
});

bot.onText(/\/(p|price) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const token_address = match[2];

    try {
        const tokenInfo = await API.getTokenInfo(1, token_address);
        const tokenMarketData = await API.getTokenData(1, token_address);
        console.log('tokenInfo', tokenInfo);
        console.log('tokenMarketData', tokenMarketData);

        if (tokenMarketData.error || tokenInfo.error) {
            if (tokenMarketData.status == 404) {
                bot.sendMessage(chatId, 'Token not found, please enter a valid token address:\n`/p token_address`', {'parse_mode': 'MarkdownV2'});
            } else {
                bot.sendMessage(chatId, 'Something went wrong, please enter a valid token address:\n`/p token_address`', {'parse_mode': 'MarkdownV2'});
            }
        } else {
            bot.sendMessage(chatId, `
*${tokenInfo.name} [${tokenInfo.symbol}]*

Token: _${token_address}_
Price: *$${tokenMarketData.price_usd.toFixed(2)} (${tokenMarketData.price_24h_delta_usd > 0 ? '⬆️' : '⬇️'} ${(tokenMarketData.price_24h_delta_usd * 100).toFixed(2)}%)*
Volume 24 hour: *$${tokenMarketData.volume_24h_usd.toFixed(2)}*
Liquidity: *$${tokenMarketData.liquidity_usd.toFixed(2)}*
`,
    {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'View graph',
                        url: `https://dex.guru/token/${token_address}-eth`
                    },
                    {
                        text: 'Etherscan',
                        url: `https://etherscan.io/token/${token_address}`
                    }
                ]
            ]
        }
    });
        }
    } catch (e) {

    }
});

bot.onText(/\/bruh/, (msg, match) => {
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, 'BRUH');
});

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

// });
