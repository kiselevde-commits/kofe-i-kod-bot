# Пошаговая инструкция по публикации проекта на GitHub

## Шаг 1: Подготовка репозитория

1. Убедитесь, что у вас установлен Git:
   ```bash
   git --version
   ```

2. Если Git не установлен, скачайте его с [git-scm.com](https://git-scm.com/).

3. Настройте Git (если ещё не настроено):
   ```bash
   git config --global user.name "Ваше имя"
   git config --global user.email "ваш.email@example.com"
   ```

## Шаг 2: Инициализация локального репозитория

1. Перейдите в папку проекта:
   ```bash
   cd f:/Project/Shkkolatte
   ```

2. Инициализируйте Git-репозиторий:
   ```bash
   git init
   ```

3. Проверьте статус:
   ```bash
   git status
   ```

## Шаг 3: Добавление файлов в репозиторий

1. Добавьте все файлы проекта:
   ```bash
   git add .
   ```

2. Проверьте, что файлы добавлены:
   ```bash
   git status
   ```

   Вы должны увидеть список файлов, готовых к коммиту, включая:
   - `bot.py`
   - `index.html`, `script.js`, `style.css`
   - `Procfile`, `render.yaml`, `runtime.txt`, `requirements.txt`, `amvera.yml`
   - `.env.example`, `.gitignore`
   - `README.md`, `GITHUB_DEPLOY.md`
   - `assets/` (изображения и шрифты)

   **Важно:** Файл `.env` не должен быть добавлен (он в `.gitignore`).

## Шаг 4: Первый коммит

1. Сделайте первый коммит:
   ```bash
   git commit -m "Initial commit: ShoKKo&Latte Telegram Bot"
   ```

## Шаг 5: Создание репозитория на GitHub

1. Перейдите на [github.com](https://github.com) и войдите в аккаунт.

2. Нажмите на иконку «+» в правом верхнем углу и выберите «New repository».

3. Заполните форму:
   - **Repository name**: `ShoKKoLatte` (или любое другое имя)
   - **Description**: `Telegram-бот для кофейни ShoKKo&Latte`
   - **Public** или **Private** — выберите подходящий вариант
   - **Не** ставьте галочку «Add a README file» (у нас уже есть свой)
   - **Не** ставьте галочку «Add .gitignore» (у нас уже есть свой)
   - **Не** ставьте галочку «Choose a license» (можно добавить позже)

4. Нажмите «Create repository».

## Шаг 6: Связывание локального репозитория с GitHub

1. На странице созданного репозитория скопируйте URL (HTTPS или SSH).

2. Свяжите локальный репозиторий с удалённым:
   ```bash
   git remote add origin https://github.com/ваш-username/ShoKKoLatte.git
   ```

   Замените `ваш-username` на ваше имя пользователя GitHub.

3. Переименуйте ветку в `main` (стандарт для GitHub):
   ```bash
   git branch -M main
   ```

4. Отправьте код на GitHub:
   ```bash
   git push -u origin main
   ```

## Шаг 7: Проверка

1. Обновите страницу репозитория на GitHub.

2. Убедитесь, что все файлы загружены.

3. Проверьте, что `.env` не попал в репозиторий (он должен быть в `.gitignore`).

## Шаг 8: Настройка переменных окружения на платформе деплоя

### Для Render:

1. Перейдите на [render.com](https://render.com).

2. Создайте новый Web Service или Worker.

3. Подключите ваш GitHub-репозиторий.

4. В разделе «Environment Variables» добавьте:
   - `BOT_TOKEN` — токен от @BotFather
   - `MANAGER_USERNAME` — имя менеджера (например, `@Jabby`)
   - `WELCOME_IMAGE_URL` — URL изображения (необязательно)

5. Нажмите «Create Web Service».

### Для Amvera:

1. Перейдите на [amvera.io](https://amvera.io).

2. Создайте новый проект.

3. Подключите GitHub-репозиторий.

4. Добавьте переменные окружения:
   - `BOT_TOKEN`
   - `MANAGER_USERNAME`
   - `WELCOME_IMAGE_URL`

5. Разверните проект.

## Шаг 9: Работа с репозиторием (будущие изменения)

1. Внесите изменения в код.

2. Добавьте изменения:
   ```bash
   git add .
   ```

3. Сделайте коммит:
   ```bash
   git commit -m "Описание изменений"
   ```

4. Отправьте на GitHub:
   ```bash
   git push origin main
   ```

## Полезные команды Git

| Команда | Описание |
|---------|----------|
| `git status` | Показать статус репозитория |
| `git log` | Показать историю коммитов |
| `git pull origin main` | Получить изменения из удалённого репозитория |
| `git branch` | Показать список веток |
| `git checkout -b dev` | Создать и переключиться на ветку `dev` |

## Советы

- **Никогда не коммитьте файл `.env`** — он содержит конфиденциальные данные.
- Используйте `.env.example` как шаблон для других разработчиков.
- Создавайте отдельные ветки для новых функций (например, `feature/menu-update`).
- Перед пушем всегда проверяйте `git status`, чтобы не добавить лишние файлы.