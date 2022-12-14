# Заметки об HTML

## Семантическая верстка

### article
Значение: независимая, отделяемая смысловая единица, например комментарий, твит, статья, виджет ВК и так далее.
Особенности: желателен заголовок внутри.

### section
Значение: неотделяемый смысловой раздел документа (в отличие от <article>)
Особенности: желателен заголовок внутри.

### aside
Значение: побочный, косвенный для страницы контент.
Особенности:
 - может иметь свой заголовок
 - может встречаться несколько раз на странице.
 - **Не следует** считать <aside> тегом для «боковой панели» и размечать этим тегом основной контент, который связан с окружающими его элементами.

### nav
Значение: навигационный раздел со ссылками на другие страницы или внутри текущей страницы.
Особенности: используется для основной навигации, а не для всех групп ссылок. Например, меню в подвале сайта можно не оборачивать в <nav>.

### header
Значение: вводная часть смыслового раздела или всего сайта, обычно содержит подсказки и навигацию. Чаще всего повторяется на всех страницах сайта.
Особенности: этих элементов может быть несколько на странице.
Типовые ошибки: использовать только как шапку сайта.

### main
Значение: основное, не повторяющееся на других страницах, содержание страницы.
Особенности: должен быть один на странице, исходя из определения.
Типовые ошибки: включать в этот тег то, что повторяется на других страницах (навигацию, копирайты и так далее).

### footer
Значение: заключительная часть смыслового раздела или всего сайта, обычно содержит информацию об авторах, список литературы, копирайт и так далее. Чаще всего повторяется на всех страницах сайта.
Особенности: этих элементов может быть несколько на странице. Тег <footer> не обязан находиться в конце раздела.
Типовые ошибки: использовать только как подвал сайта.

### Есть простые правила для выбора нужных тегов.
	- Получилось найти самый подходящий смысловой тег — использовать его.
	- Для потоковых контейнеров — <div>.
	- Для мелких фразовых элементов (слово или фраза) — <span>.
### Правило для определения <article>, <section> и <div>:
	- Можете дать имя разделу и вынести этот раздел на другой сайт? — <article>
	- Можете дать имя разделу, но вынести на другой сайт не можете? — <section>
	- Не можете дать имя? Получается что-то наподобие «новости и фотогалерея» или «правая колонка»? — <div>


## сверх-идея про "чистый блок",
	когда в одном стилевом файле лежат только относящиеся к блоку стили, а в другом все, что относится к позиционированию и внешним отступам, хороша без фанатизма. На практике это выглядит, например, логотип с классом `logo`, расположенный внутри блока `header`, при этом стили логотипа лежат в `logo.scss`, стили микса `header__logo` в `header.scss`, а все вместе выглядит как `div class="logo header__logo"`. Обычно это проще реализовать непосредственно в `logo` в качестве модификатора.

