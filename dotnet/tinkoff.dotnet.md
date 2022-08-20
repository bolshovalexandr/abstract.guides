# Работа с Tinkoff OpenAPI

## Ссылки
- оф.руководство https://docs.microsoft.com/ru-ru/aspnet/core/tutorials/first-web-api

## Подготовка (создание Web-API)

### поток сознания
- создаем webAPI с готовым шаблоном WeatherForecast - работает
- по умолчанию в `Properties/launchSettings.json` в поле `launchUrl` содержится swagger, меняем его на `api/TodoItems`
- создаем **модель** данных - набор классов, представляющих данные, которыми управляет приложение:
	- создаем внутри решения новый каталог Models
	- внутри каталога создаем новые классы (в нашем случае один - TodoItem)

### полезные заметки
- `Properties/launchSettings.json` хранит все профили запуска приложения (стартовый URL, переменные окружения и всякие разные настройки для запуска)


