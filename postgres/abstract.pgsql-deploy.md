# Postgres - установка, отладчик, развертывание

## Развертывание Postgres-14 под WSL2:

### Установка конкретной версии

1. Ставим по [руководству](https://www.postgresql.org/download/linux/ubuntu/)
2. Меняем пароль через psql
  - может понадобится в pg_hba.conf выставить для локальных подключений trust
  `local  all  all  trust`
  - далее для встроенного пользователя postgres меняем пароль
  `sudo -u postgres psql`
  `ALTER USER postgres with PASSWORD 'PGroot'`

### Сеть и авторизация (/etc/postgresql/14/main)

1. в postgresql.conf -- CONNECTIONS AND AUTHENTICATION -- слушаем все адреса
`listen_addresses = '*'`
2. в pg_hba.conf разрешаем пользователю (здесь - postgres) соединяться с любого адреса
`host  all  postgres  0.0.0.0/0  md5`
3. Стартуем
`service postgresql start 14`

### Развертывание пустой базы и миграция G1 через проект PostgresDbUp
- создаем базу
- устанавливаем на базе необходимые расширения из `0000_00_00_0002_extensions.sql`
- **для пустой базы** .env-файл с пользователями по-умолчанию в корень проекта
```txt
    CUSTOMCONNSTR_NpgsqlConnectionString="host=172.30.67.132;username=postgres;password=PGroot;port=5432;database=G1"
    JWT__Secret="6Lrg8Io0MPs6WnNHYCPTJOSgCK1mZGy1aRQwsPHvQ9Y/T7v09P0BwV6zr66VP8BzwaXux2PdMni1zLreflaMtg=="
    FCMConfig__ApiToken="AAAASCfaQ3E:APA91bFAfRrbbd-VIkvqLw9Wq_n5JqnqLZRmILG7jsSMTkv9UifhWu_wB0at7-hFCpUFKuVes3pg3RGr-uy60rZoyABzFLBF9_xxqN3yOp4aK2LH3690jpL9GcABfoWUoc-hZnDCWdNc"
    DefaultUsers__0__Name="Super"
    DefaultUsers__0__Surname="User"
    DefaultUsers__0__Login="superuser"
    DefaultUsers__0__Email="superuser@org1.ru"
    DefaultUsers__0__Roles__0="Admin"
    DefaultUsers__0__Roles__1="Moderators"
    DefaultUsers__0__Roles__2="SystemOperators"
    DefaultUsers__0__Password="Z123456z!"
```
- пример строки подключения `Server=localhost; User Id=postgres; Password=PGroot; Port=5432; Database=gandiva_test`

### Установка отладчика процедур на клиент и сервер
 - отладка работает только под *nix (точно для Debian и Ubuntu)
 - установка плагина отладчика для [dBeaver](https://github.com/dbeaver/dbeaver/wiki/DebugPluginInstall)
 - установка плагина отладчика для [Postgres Server](https://github.com/dbeaver/dbeaver/wiki/PGDebugger)
 - содержимое временных таблиц отладчик [не видит](https://stackoverflow.com/questions/15092457/with-pgadmin-debugger-is-it-possible-to-examine-the-contents-of-temporary-tables)

