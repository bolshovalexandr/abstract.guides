# Основные моменты из лекций по ASP.NET

## View - Controller - Model
### Создание нового отбражения
1. создаем подкаталог в каталоге View (напр., `/Tasks/NewTask.cshtml`)
2. создаем пустой контроллер (напр., `/Controllers/TaskController.cs`)
 - пустой контроллер сразу же объявляет namspace в виде `ProjectName.Controllers`
 - внутри класса создается публичный метод типа IActionResult с именем возвращаемой страницы (`public IActionResult NewTask()`)
 - теперь для навигации можно использовать как прямую ссылку, так и Razor'овскую
`<a class="nav-link text-dark" asp-area="" asp-controller="Tasks" asp-action="NewTask">NewTask</a>`
3. Обработка данных в контроллерах HTTP-методов (типа IActionResult)
 - данные можно перечислить как параметры с типами
 - можно создать модель (здесь, для метода NewTask контроллера TasksController - Models/Tasks/NewTaskViewModel)
 - постфикс ViewModel обычно используется для MVC, постфикс Model - для REST API
