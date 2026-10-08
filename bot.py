import os
import asyncio
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.filters import CommandStart

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
MANAGER_USERNAME = os.getenv("MANAGER_USERNAME", "@cafe_manager_username")
WELCOME_IMAGE_URL = os.getenv("WELCOME_IMAGE_URL")

CAFE_LATITUDE = 55.7558
CAFE_LONGITUDE = 37.6173

dp = Dispatcher()


def get_main_keyboard() -> ReplyKeyboardMarkup:
    kb = [
        [
            KeyboardButton(text="📄 Меню"),
            KeyboardButton(text="📍 Как нас найти"),
        ],
        [
            KeyboardButton(text="💬 Позвать менеджера"),
        ],
    ]
    return ReplyKeyboardMarkup(
        keyboard=kb,
        resize_keyboard=True,
        input_field_placeholder="Выберите пункт меню",
    )


WELCOME_TEXT = (
    "Привет! Добро пожаловать в «Кофе и Код» ☕️\n"
    "Здесь ты можешь посмотреть наше актуальное меню, "
    "узнать, как нас найти, или связаться с менеджером.\n\n"
    "Чем я могу помочь?"
)

MENU_TEXT = (
    "📄 *Наше меню:*\n\n"
    "☕️ *Кофе:*\n"
    "• Эспрессо — 150₽\n"
    "• Капучино — 220₽\n"
    "• Латте Халва — 280₽\n\n"
    "🍰 *Десерты:*\n"
    "• Круассан классический — 180₽\n"
    "• Чизкейк Сан-Себастьян — 310₽\n\n"
    "Чтобы сделать заказ, обратитесь к бариста на кассе ☺️"
)

LOCATION_TEXT = (
    "📍 *Наш адрес:*\n"
    "ул. Фрилансеров, д. 404\n\n"
    "🕐 *Часы работы:*\n"
    "Каждый день с 08:00 до 22:00\n\n"
    "Ждем в гости! ☕️"
)

MANAGER_TEXT = (
    "💬 Если у тебя возник вопрос или ты хочешь оставить отзыв, "
    f"напиши нашему управляющему: {MANAGER_USERNAME}\n\n"
    "Он ответит быстрее, чем остынет твой кофе! 😉"
)


@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    keyboard = get_main_keyboard()
    if WELCOME_IMAGE_URL:
        await message.answer_photo(
            photo=WELCOME_IMAGE_URL,
            caption=WELCOME_TEXT,
            reply_markup=keyboard,
        )
    else:
        await message.answer(WELCOME_TEXT, reply_markup=keyboard)


@dp.message(lambda message: message.text == "📄 Меню")
async def show_menu(message: types.Message):
    await message.answer(
        MENU_TEXT,
        parse_mode="Markdown",
        reply_markup=get_main_keyboard(),
    )


@dp.message(lambda message: message.text == "📍 Как нас найти")
async def show_location(message: types.Message):
    await message.answer(
        LOCATION_TEXT,
        parse_mode="Markdown",
        reply_markup=get_main_keyboard(),
    )
    await message.answer_location(
        latitude=CAFE_LATITUDE,
        longitude=CAFE_LONGITUDE,
        reply_markup=get_main_keyboard(),
    )


@dp.message(lambda message: message.text == "💬 Позвать менеджера")
async def call_manager(message: types.Message):
    await message.answer(
        MANAGER_TEXT,
        reply_markup=get_main_keyboard(),
    )


async def main():
    if not BOT_TOKEN:
        print(
            "❌ Ошибка: BOT_TOKEN не задан в файле .env\n"
            "👉 Получите токен у @BotFather и впишите его в .env"
        )
        return

    bot = Bot(token=BOT_TOKEN)
    print("Бот «Кофе и Код» запущен... ☕️")
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
