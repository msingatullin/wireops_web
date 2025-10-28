# WireOps Web

Web-приложение для системы управления монтажным бизнесом.

## Технологии

- **React 18.3** - UI библиотека
- **TypeScript 5.3** - типизация
- **Vite** - сборщик
- **React Router** - роутинг
- **TanStack Query** - управление серверным состоянием
- **Zustand** - глобальное состояние
- **Tailwind CSS** - стилизация
- **shadcn/ui** - компоненты UI
- **Recharts** - графики

## Установка

```bash
# Установка зависимостей
npm install

# Создать .env файл
cp .env.example .env
```

## Запуск

```bash
# Development режим
npm run dev

# Production сборка
npm run build

# Preview production сборки
npm run preview
```

Приложение будет доступно на http://localhost:3000

## Структура

```
web/
├── src/
│   ├── components/    # React компоненты
│   │   ├── layouts/   # Layouts (Dashboard, Auth)
│   │   └── ui/        # UI компоненты (shadcn/ui)
│   ├── pages/         # Страницы приложения
│   ├── lib/           # Утилиты и API клиент
│   ├── store/         # Zustand stores
│   └── types/         # TypeScript типы
├── public/            # Статические файлы
└── index.html         # HTML entry point
```

## Основные страницы

- `/` - Дашборд
- `/login` - Вход в систему
- `/clients` - Клиенты
- `/projects` - Проекты
- `/estimates` - Сметы
- `/materials` - Материалы
- `/workers` - Работники
- `/finance` - Финансы
- `/analytics` - Аналитика

## API Integration

API клиент настроен в `src/lib/api.ts`. Автоматически добавляет JWT токен к запросам и обрабатывает обновление токена при истечении.

## Разработка

### Добавление новой страницы

1. Создать компонент в `src/pages/`
2. Добавить роут в `src/App.tsx`
3. Добавить ссылку в `src/components/layouts/DashboardLayout.tsx`

### Добавление нового API endpoint

Добавить метод в соответствующий API объект в `src/lib/api.ts`

## Deployment

```bash
# Build для production
npm run build

# Файлы сборки будут в папке dist/
```

Deploy на Vercel/Netlify:
- Подключить GitHub репозиторий
- Команда сборки: `npm run build`
- Директория: `dist`


