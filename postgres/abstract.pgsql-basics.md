# Postgres - SQL-запросы

## Базовые заметки

### Ограничения значений:
- функция ограничения целостности [CHECK](https://postgrespro.ru/docs/postgrespro/16/ddl-constraints),
- назначение столбца главным ключом (не NULL, уникальность), напр., `CONSTRAINT pk PRIMARY KEY(Id)`,
- указание для столбца внешнего ключа, напр., `"Id" int REFERENCES public."AnotherTable"("Id")`

### Некоторые особенности выборок
-
