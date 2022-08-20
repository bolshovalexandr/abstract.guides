# Использование SSH-ключей

## Создание пары SSH-ключей
- Создание пары SSH-ключей `ssh-keygen -t rsa -b 4096`

## Размещение ключей
- приватный ключ размещаем на клиенте
	(тонкость с **правами под Windows** - ключи лучше размещать в `C:\Users\%username%\.ssh\` из-за проблемы `Permissions for 'private-key.ppk' are too open`)
- публичный, по ситуации
	- **GitHub** в личном кабинете (будет работать только если репозиторий склонирован по SSH)
	- Linux - в каталоге .ssh внутри домашнего каталога пользователя создаем файл `authorized_keys` и пишем содержимое открытого ключа в него

## Конфигурация ssh в Windows
Выполняется в файле C:\Users\%username%\.ssh\config

Host github.com
	HostName github.com
	User %username%
	IdentityFile C:\Users\%username%\.ssh\KEY_FILE - путь к секретному ключу
