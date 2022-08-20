# Развертывание VPS-сервера для хостинга NodeJS приложений на базе Ubuntu

## Настройка сервера и окружения
`apt-get update`
`apt-get install -y mc nano sudo curl`

## Установка NodeJS и npm
(https://github.com/nodesource/distributions/blob/master/README.md)

curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs


## Настраиваем Modgo

### Установка Mongo
**Mongo НАДО ставить по инструкции с сайта, а не из репозитория Ubuntu**
(https://docs.mongodb.com/v4.0/tutorial/install-mongodb-on-ubuntu/)

### Запуск Mongo

1. После установки Mongo запустится как сервис
2. Останавливаем сервис `sudo service mongod stop`
3. Создаем директорию для данных в корне `data/db`
4. Стартуем mongod без авторизации на localhost `--bind_ip localhost`
--bind_ip_all

### Создание баз и пользователей через командную строку
ОСОБЕННОСТЬ: мы можем индивидуально назначать правда для каждой БД (readWrite, read и т.д.), но если права назначены для базы admin, то они распространяются на весь кластер

1. Подключаемся `mongo localhost`
2. Создаем базу `use dbName`
3. Создаем пользователя базы
`db.createUser({user: "LOGIN", pwd: "PASS", roles: [ { role: "readWrite", db: "dbName" } ]})`
4. Проверяем, перезапустив базу с авторизацией по всем портам
`mongod --bind_ip_all --auth`
и подключаясь как через Robo 3T, так и через консоль
локально: `mongo`
удаленно: `"C:\Program Files\MongoDB\Server\3.6\bin\mongo.exe" --host HOST --port PORT`
Далее: `db.auth("LOGIN", "PASS")`
**NB** сейчас пароль открытым текстом в аргумент не передается, используется (**напр., для суперпользователя root в образе mongo docker**)
`use admin`
`db.auth("root", passwordPrompt())`
`db.changeUserPassword("root", passwordPrompt())`

5. Создание суперпользователя кластера
- создаем суперпользователя,  и чистим лишнее
db.createUser({user: "LOGIN", pwd: "PASS", roles: [
        {
            "role" : "root",
            "db" : "admin"
        },
        {
            "role" : "clusterAdmin",
            "db" : "admin"
        },
        {
            "role" : "readWriteAnyDatabase",
            "db" : "admin"
        },
        {
            "role" : "dbAdminAnyDatabase",
            "db" : "admin"
        }
		]
	}
)
после этого проверяем колекцию system.users

### Запуск Mongo как сервиса
1. Создаем директорию для базы, например
/mongoData/db

2. Выставляем права
sudo chown -R mongodb:mongodb /mongoData/
sudo chown -R mongodb:mongodb /mongoData/db

3. В конфигурационном файле /etc/mongo.conf пишем:
```
storage:
  dbPath: /mongoData/db

# network interfaces
net:
  port: 27017
  bindIpAll: true

security:
  authorization: enabled
```

4. Комментируем раздел security, стартуем как сервис `sudo service mongod start`, заводим нужных пользователей, перезапускаемся в защищенном режиме, проверяем
5. Логи надо смотреть как в /var/mongodb/, так и в /var/syslog

### Экспорт / импорт баз
mongoimport --username LOGIN --password PASS --db messages --file ./nodes/FILE_NAME.json  --jsonArray
mongoexport --username LOGIN --password PASS --db messages --collection COLLECTION_NAME  --out FILE_NAME.json

mongodump --db messages --username LOGIN --password PASS --out /root/mongoBackup
mongorestore --db messages --username LOGIN --password PASS /root/mongoBackup
mongorestore --db articles --username root --password example /home/all-collections.archive


## Настраиваем в сервере автозапуски и убираем все лишнее (вариант для SSR by Gatsby)

### Команды
- Список сервисов в автозагрузке: `systemctl list-units --type=service`
- Проверка наличия сервиса в автозагрузке: `systemctl is-enabled apache`
- Список сервисов, которые сейчас выполняются `systemctl list-units --type=service --state=running`
- Сервисы, которые уже добавлены в автозагрузку `systemctl list-unit-files --type=service --state=enabled`
- Добавить сервис в автозагрузку `sudo systemctl enable имя_сервиса`
- Удалить сервис из автозагрузки `sudo systemctl disable имя_сервиса`

### Подготовка
- убираем Apache
- стартуем Mongo

## Настраиваем NodeJS
screen -d -m mongod --bind_ip_all --auth
screen -d -m node ./nodes/index.js --server

## Nginx
полезная статья по сниппетам (в т.ч. по редиректам): https://habr.com/ru/post/272381/

## letsencrypt + certbot
 - останавливаем веб-сервер
 - запрашиваем сертификат `certbot certonly --nginx`
 - выгружаем сертификаты `/etc/letsencrypt/live/DOMAIN_NAME/`, где (fullchain.pem -> server.crt, privkey.pem -> server.key)
 - убиваем экземпляр NGinx, запущенный certbot'ом `netstat -tulpn | grep --color :80`
