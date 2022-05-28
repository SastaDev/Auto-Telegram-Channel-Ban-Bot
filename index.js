const { Telegraf } = require('telegraf')
const { Markup } = require('telegraf')
const config = require('./config.json')

BOT_TOKEN = config.BOT_TOKEN

const bot = new Telegraf(BOT_TOKEN);

function start(ctx) {
    const msgid = ctx.update.message.message_id
    const msg = `
Hello, thanks for starting me!
I'm a telegram bot made to ban channels in groups, except linked channel.
How To Use Me!?
Simply, add me to your group as admin, with <b>ban users</b> right and then i will ban and delete messages of the channels in the group.
<i>Send /help for steps!</i>
Written in <b>Node.JS</b> by <a href='https://telegram.dog/SastaNetwork'>Sasta Network</a>.
<b>Source Code:</b> https://github.com/SastaDev/Auto-Telegram-Channel-Ban-Bot
© 2022 <a href='https://telegram.dog/SastaNetwork'>Sasta Network</a>.
    `
    ctx.replyWithHTML(msg, Markup.inlineKeyboard([
        [Markup.button.url('➕ Add me to your groups ➕', `https://telegram.dog/${ctx.botInfo.username}?startgroup=true`)],
        [Markup.button.url('🤖 Bot Source Code (GitHub) 🤖', 'https://github.com/SastaDev/Auto-Telegram-Channel-Ban-Bot')]
                ]), {reply_to_message_id: msgid})
}

function help(ctx) {
    const msgid = ctx.update.message.message_id
    const msg = `
• <b>A Very Easy Two Steps!</b>
1. Add me to your group.
2. Make me admin with <b>ban users</b> right.
<b>Now, you are done! i will ban and delete messages of the channels in the group.</b>
    `
    ctx.replyWithHTML(msg, {reply_to_message_id: msgid})
}

function added(ctx) {
    const message = ctx.update.message
    const msgid = message.message_id
    if (message.new_chat_participant) {
        const new_chat_p = message.new_chat_participant
        if (new_chat_p.id === bot.botInfo.id) {
            const msg = `
Thank You <a href='tg://user?id=${message.from.id}'>${message.from.first_name} ${message.from.last_name ? message.from.last_name : '\u200b'}</a> for adding me here!
• Promote me as admin with <b>ban users</b> right to ban and delete messages sent as channel (except linked channel).
            `
            ctx.replyWithHTML(msg, {reply_to_message_id: msgid})
        }
    }
}

function autochannelban(ctx) {
    const message = ctx.update.message
    if (message.sender_chat) {
        if (message.is_automatic_forward) {
            return
        }
        const channel_id = message.sender_chat.id
        const _channel_id = channel_id.toString().replace('-100', '').replace('-', '')
        const title = message.sender_chat.title
        try {
            ctx.deleteMessage()
            ctx.banChatSenderChat(channel_id)
            const msg = `
🚫 <b>Banned Channel:</b> <a href='tg://openmessage?chat_id=${_channel_id}'>${title}</a>
            `
            ctx.replyWithHTML(msg)
        } catch (error) {}
    }
}

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.command('start', ctx => start(ctx))
bot.command('help', ctx => help(ctx))
bot.on('message', ctx => [added(ctx), autochannelban(ctx)])

bot.launch()

console.log('Auto Channel Ban Telegram Bot Has Been Started!')
