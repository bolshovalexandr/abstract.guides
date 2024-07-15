# Основные моменты из лекций по ASP.NET

## ГЛОБАЛЬНАЯ ЗАДАЧА

### Лекции 1-2: контроллеры, модели и сервисы, внедрение зависисмостей
#### MVC
- **Model**:
	- классы, описывающие сущности данных и представления
	- модели для представления MVC имеет постфикс ViewMode, для REST API - Model,  для бизнес логики - DTO, в домене постфикс отсутствует
	- Модели для представления обычно очень похожи на модели для бизнес-логики (DTO), однако не следует использовать модели DTO в части, отвечающей за представление


#### Внедрение зависимостей в контроллеры (aka слой бизнес логики и сервисы)
- зависимость можно разместить в отдельном проекте (Class Library) в рамках решения
- в слой бизнес-логики выносятся все преобразования, которые не касаются представления
- пример внедрения зависимости из отдельного проекта внутри решения (на примере `Tasker.Logic` внутри решения `Tasker`):
	- опишем модель `Tasker.Logic\Models\User\UserDTO.cs`
	- создадим класс сервиса `Tasker.Logic\UserService.cs`, в котором опишем класс с геттером UserDTO, возвращающего готовый объект типа UserDTO из модели
	- внедрим зависимость в Program.cs `builder.Services.AddScoped<UserService>();`
	- внедрим в контроллер, в конструктор по умолчанию, созданную библиотеку
	```cs
	private readonly UserService _userService;
	public UserController(UserService userService) {
			_userService = userService;
	}
	```
	- и выполним маппинг DTO во ViewModel (его можно настроить непосредственно в модели)
	```cs
		var user = _userService.Get(1);
		var userViewModel = new UserViewModel() {
				Id = user.Id,
				Name = user.Name,
				Surname = user.Surname,
				Email = user.Email
		};
		UserViewModel[] Users = new UserViewModel[1] { userViewModel };
	```

- области видимости при внедрении зависимостей
 - проект (здесь - веб-проект/REST API и `Program.cs` соотв.) знает о существовании логики
 - логика знает о существовании репозиториев
 - репозитории знаю о существовании домена
 - домен никогда не должен знать ничего о вебе


## СОБСТВЕННАЯ ЗАДАЧА - РЕАЛИЗАЦИЯ ДЕРЕВА

### 1. Подготовка
Создаем решение, включаем в него проекты WEB, DAL, Logic, PostgresMigrator

### 2. DB-first - миграция, доменная модель, EF (проекты Tree.PostgresMigrator и Tree.DAL)
#### Подготовка и миграция (проект Tree.PostgresMigrator)
- создаем БД
- настраиваем connectionString в UserSecrets
`"ConnectionStrings:NpgsqlConnectionString": "Server=localhost;port=5432;database=tree;username=USERNAME;password=PASSWORD;Include Error Detail=True"`
- ставим DbUp (`dbup-core`, `dbup-postgresql` и обязательно `Npgsql`, иначе скрипт миграции не исполнится) в проект PostgresMigrator
- создаем скрипты миграции (отмечаем их как `Embedded resourse` без копирования в `\Output` [зависит от настройки DbUp])
- создаем `PostgresMigrator.cs` с методом `Migrate` (со сборкой `WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly()`)

#### DAL, паттерн "Репозиторий" и работа с БД через Entity Framework (проект Tree.DAL)
*Entity Framework - это ORM (object-relational mapper) - инструмент, свзывающий объектную модель в коде (класс, коллекция, свойство) с реляционной моделью БД (таблица, столбец, запись)*
- определим классы моделей данных, соответствующие таблицам в БД (`Tree.DAL\Domain\`)
	**классы моделей данных в репозитории чистые, имена совпадают с именами в БД, нет методов**
- определим интерфейсы **репозитория** - запросов к БД и данных (`Tree.DAL\Repositories\Abstract`)
- определим классы  **репозитория** (`Tree.DAL\Repositories\`), реализующие интерфейсы из `Tree.DAL\Repositories\Abstract`
```cs
// при этом класс унаследуем от конкретного интерфейса данных и общего интерфейса репозитория
// IDE предложит создать методы на основе интерфейсов
public class GenreRepository : IGenreRepository, IRepository<Genre> {}
```

#### подключение БД как сервиса

- подключим БД с помощью EntityFramework
	- установка NuGet-пакета Npgsql.EntityFrameworkCore.PostgreSQL
	- для взаимодействия с БД опишем в репозитории (`Tree.DAL\TreeDAL.cs`) контекст данных (напр., `PostgreeContext`), который:
		- является классом, унаследованным от `Microsoft.EntityFrameworkCore.DbContext`,
		- содержит свойства типа DbSet, которые совпадают с именами таблиц в БД (`public DbSet<Genre> Genres`, `public DbSet<Node> Nodes`)
	- передадим созданный контекст в builder приложения (`builder.Services.AddDbContext<PostgreeContext>(options => options.UseNpgsql(connectionString))`)

### 3. Слой бизнес-логики и сервисов, добавление репозиториев в сервисы
#### Подготовка: модели, сервисы, добавление зависимости
- создадим модели с постфиксом DTO (напр., в `Tree.Logic\Models\Genres\` создадим `GenreDTO.cs` и `GenreListDTO.cs`)
- DTO - модели, которые мы возвращаем наверх
- создадим класс сервис (`Tree.Logic\GenreService.cs`), в котором в публичном методе `GenreService` (*кажется это конструктор по-умолчанию*) укажем, что при инициализации класс принимает объект типа репозитория
```cs
    public class GenreService
    {
        private readonly IGenreRepository _genreRepository;
        public GenreService(IGenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }
    }
```


#### пример добавления репозитория в проект
- теперь интерфейс данных мы можем указать в слое бизнес-логики, при этом слой бизнес-логики:
  - **для возврата данных в контроллер** при необходимости может обращаться к нескольким репозиториям и собирать данные из них, выполнять проверки и валидацию
  - **для сохранения данных в домен** создается объект класса доменной модели
```cs
namespace Tasker.Logic
{
	public class UserService
	{
		private IUserRepository _userRepository;
		public UserService(IUserRepository userRepository)
		{
			_userRepository = userRepository;
		}
		public UserDTO GetUser(int id)
		{
			// получаем данные из репозитория
			var user = _userRepository.Get(id);
			// при необходимости преобразуем и возвращаем наверх, как и ранее, DTO
			return new UserDTO() {
				Id = user.Id,
				Name = user.Name,
				Email = "li-service@li.li",
				Surname = "Li"
			};
		}
	}
}
```
- в финале добавляем репозиторий и сервисы как scoped
```cs
builder.Services.AddScoped<SomeService>(); // сервисы
builder.Services.AddScoped<ISomeRepository, SomeRepository>(); // репозитории
PostgresMigrator.Migrate(connectionString); // миграция
builder.Services.AddDbContext<PostgreeContext>(options => options.UseNpgsql(connectionString)); // контекст БД
```
#### ViewModels and Models

*NB*
 - методы получения жанра по id, добавления, удаления

### 4. Lazy, связи в БЗ и маппинг (на примере G1)
- связи указываются в Infrastructure/...EF/Mapping
- связи сопоставляют модели и имена полей в таблицах БД
- связи позволяют вернуть вместе с сущностью зависимые от нее сущности и других таблиц, напр.:
	- пусть есть таблица колонок и таблица карточек
	- карточка хранит Id колонки
	- многие карточки ссылаются на одну колонку
	- ТОГДА при настройке связей достаточно запросить из БД колонку, а маппинг докинет к ней связанные карточки

## Summary

### Архитектура
- Domain  - **Project.DAL**    - чистые модели, методов нет, единственный конструктор - конструктор по-умолчанию, поля классов совпадают с полями в БД
- Service - **Project.Logic**  - постфикс DTO, по запросу от контроллера может собирать данные из нескольких репозиториев

### Инфраструктура и инициализация классов
- добавление проектов в build


