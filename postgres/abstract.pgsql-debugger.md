# Postgres - установка, отладчик, развертывание

## Развертывание Postgres-14 под WSL2:

### Установка конкретной версии

1. Ставим по [руководству](https://www.postgresql.org/download/linux/ubuntu/)
2. Меняем пароль через psql
  - может понадобится в pg_hba.conf выставить для локальных подключений trust
  `local  all  all  trust`
  - далее для встроенного пользователя postgres меняем пароль
  `sudo -u postgres psql`
  `ALTER USER postgres with PASSWORD 'PASS_WORD'`

### Сеть и авторизация (/etc/postgresql/14/main)

1. в postgresql.conf -- CONNECTIONS AND AUTHENTICATION -- слушаем все адреса
`listen_addresses = '*'`
2. в pg_hba.conf разрешаем пользователю (здесь - postgres) соединяться с любого адреса
`host  all  postgres  0.0.0.0/0  md5`
3. Стартуем
`service postgresql start 14`

### Установка отладчика процедур на клиент и сервер
 - отладка работает только под *nix (точно для Debian и Ubuntu)
 - установка плагина отладчика для [dBeaver](https://github.com/dbeaver/dbeaver/wiki/DebugPluginInstall)
 - установка плагина отладчика для [Postgres Server](https://github.com/dbeaver/dbeaver/wiki/PGDebugger)
 - содержимое временных таблиц отладчик [не видит](https://stackoverflow.com/questions/15092457/with-pgadmin-debugger-is-it-possible-to-examine-the-contents-of-temporary-tables)

