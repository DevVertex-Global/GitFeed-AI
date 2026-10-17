import html

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update, WebAppInfo
from telegram.constants import ParseMode
from telegram.ext import ContextTypes

from config import WEBAPP_URL


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.effective_user:
        return

    user_name = html.escape(update.effective_user.first_name or "Developer")
    text = (
        f"👋 হ্যালো <b>{user_name}</b>!\n\n"
        "<b>GitFeed-AI</b>-এ আপনাকে স্বাগতম। এটি গিটহাব ডেভেলপারদের জন্য একটি "
        "সিকিউর এবং এআই-পাওয়ারড মিনি অ্যাপ ও বট।\n\n"
    )

    reply_markup = None
    if WEBAPP_URL.startswith("https://"):
        text += "নিচের বাটনে ক্লিক করে মিনি অ্যাপ ড্যাশবোর্ড ওপেন করুন:"
        reply_markup = InlineKeyboardMarkup(
            [[InlineKeyboardButton("🚀 Open GitFeed Mini App", web_app=WebAppInfo(url=WEBAPP_URL))]]
        )
    else:
        # Telegram Mini Apps require a public HTTPS URL.
        text += "⚠️ মিনি অ্যাপের HTTPS লিংক (WEBAPP_URL) এখনও সেট করা হয়নি।"

    await update.message.reply_text(text, reply_markup=reply_markup, parse_mode=ParseMode.HTML)
