import { get } from 'lodash';
import { getAllCryptocurrencies } from 'api/coinMarketCap';
import { parseTicker } from './parseTicker';
import fetchTicker from './fetchTicker';

module.exports = bot => {
  bot.command(['top10', 'Top10', 'topten', 'TopTen', 'topTen'], async ctx => {
    ctx.reply('I’m searching…');
    try {
      const { data } = await getAllCryptocurrencies({
        sortDir: 'desc',
        limit: 10,
      });
      const tickers = get(data, 'data', []);

      let message = '';
      for (const t of tickers) {
        const ticker = await fetchTicker(t.symbol);
        const tValue = await parseTicker(ticker, true);
        message +=
          `/${ticker.symbol} - *${ticker.name}*\n` +
          `\t\`USD: ${tValue.lastValueUsd}\`\n` +
          `\t\`EUR: ${tValue.lastValueEur}\`\n` +
          '\n';
      }
      message += '/help to see the others commands!';
      ctx.replyWithMarkdown(message);
    } catch (error) {
      ctx.reply('Sorry there is an error. Please try again in a few minutes.');
    }
  });
};
