# DotNet und Raspberry

## Настройка среды клиент+устройство (ДЛЯ УДАЛЕННОЙ ОТЛАДКИ ЛУЧШЕ БРАТЬ NetCore3.1)

### Ссылки
	- https://www.hanselman.com/blog/remote-debugging-with-vs-code-on-windows-to-a-raspberry-pi-using-net-core-on-arm
	- https://github.com/OmniSharp/omnisharp-vscode/wiki/Remote-Debugging-On-Linux-Arm
	- https://habr.com/ru/post/422141/

### Идея
- на устройстве настраиваются .Net, ssh, дебаггер vsdbg
- на клиетне приложение разрабатывается и собирается
- при запуске кода (Run в VSCode) выполняется сценарий подключения по ssh к удаленному дебаггеру (описан в `launch.json`)
- сценарий из `launch.json` в свою очередь вызывает предварительную задачу по сборке и компированию приложения по ssh на уcтройство (`tasks.json`)

### на устройстве
- Установка **NetCore3.1** (https://dotnet.microsoft.com/download/dotnet-core/3.1)
	- в `Build apps - SDK` выбираем бинарный файл для Arm32
	- загружаем его wget'ом
	- выпоняем, как указано в руководстве, содзание каталога dotnet, распаковку туда архива и настройку переменных окружения
		- mkdir -p $HOME/dotnet && tar zxf dotnet-sdk-3.1.404-linux-arm.tar.gz -C $HOME/dotnet
		- export DOTNET_ROOT=$HOME/dotnet
		- export PATH=$PATH:$HOME/dotnet
- Установка **.Net5** проще всего выполняется по скрипту из (https://www.petecodes.co.uk/install-and-use-microsoft-dot-net-5-with-the-raspberry-pi/)
- Установка удаленного дебаггера для VSCode на Pi:
	`curl -sSL https://aka.ms/getvsdbgsh | /bin/sh /dev/stdin -v latest -l ~/vsdbg`
- Обеспечиваем запуск программы под root'ом
	- назначаем root'у пароль
	- разрешаем логиниться  root'ом по SSH `PermitRootLogin yes` в файле `/etc/ssh/sshd_config`
	- `sudo service ssh restart`

### Пример конфигурации IDE на клиенте

**!NB** в примере используется Framework Dependent сборка, в случае Standalone есть проблема с назначением прав после копирования

`launch.json`
```json
{
	"version": "0.2.0",
	"configurations": [
		{
				"name": ".NET Remote Framework Dependent",
				"type": "coreclr",
				"preLaunchTask": "copy-to-device-framework-depend",
				"request": "launch",
				"program": "~/dotnet/dotnet",
				"args": ["dotnet-rpi.dll"],
				"cwd": "~/dotnet-rpi",
				"requireExactSource": false,
				"stopAtEntry": false,
				"console": "internalConsole",
				"pipeTransport": {
						"pipeCwd": "${workspaceRoot}",
						"pipeProgram": "c:\\Program Files\\PuTTY\\plink.exe",
						"pipeArgs": [
								"-i",
								"c:\\Users\\litest\\.ssh\\pi-putty.ppk",
								"root@pi"
						],
						"debuggerPath": "~/vsdbg/vsdbg"
				}
		},
	]
}
```

`tasks.json`
```json
{
	"version": "2.0.0",
	"tasks": [
		{
				"label": "publish",
				"command": "dotnet",
				"type": "process",
				"args": [
						"publish",
						"${workspaceFolder}/dotnet-rpi.csproj",
						"/property:GenerateFullPaths=true",
						"/consoleloggerparameters:NoSummary"
				],
				"problemMatcher": "$msCompile"
		},
		{
				"label": "copy-to-device-framework-depend",
				"dependsOn": "publish",
				"command": "scp",
				"type": "process",
				"args": [
						"-r",
						"-v",
						"${workspaceFolder}/bin/Debug/netcoreapp3.1/publish/*",
						"root@pi:~/dotnet-rpi/"
				]
		},
	]
}
```

## Начало работы и необходимые библиотеки для GPIO
 - dotnet add package System.Device.Gpio --source https://dotnetfeed.blob.core.windows.net/dotnet-iot/index.json
 - dotnet add package Iot.Device.Bindings --source https://dotnetfeed.blob.core.windows.net/dotnet-iot/index.json

## Заметки по работе с GPIO