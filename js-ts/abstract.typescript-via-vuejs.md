# TS + Vue/NUXT

## Подготовка
### установка
https://typescript.nuxtjs.org/guide/setup
### Поддержка классовго синтаксиса в NUXT
`npm i -D vue-class-component vue-property-decorator`


### кастомные настройки tsconfig
```json
{
	"compilerOptions": {
		// разрешаем использование типа any
		"noImplicitAny": false,
		// Показывать ошибку, если где-то найдены неиспользуемые локальные значения.
		"noUnusedLocals": true,
		// Сообщить об ошибке в случае обнаружения кода, который никогда не будет выполнен?
		"allowUnreachableCode": true,
		// Показывать ошибку, если где-то найдены неиспользуемые параметры.
		"noUnusedParameters": true,
		// Значения "null" и "undefined" могут быть присвоены только значениям данного типа и значениям только с типом "any"?
		// конечно лучше включить strict: true, но пока нельзя
		// "strictNullChecks": true,

		"target": "ES2018",
		"module": "ESNext",
		"moduleResolution": "Node",
		"lib": [
			"ESNext",
			"ESNext.AsyncIterable",
			"DOM"
		],
		"esModuleInterop": true,
		"allowJs": true,
		"sourceMap": true,
		"strict": true,
		"noEmit": true,
		"experimentalDecorators": true,
		"baseUrl": ".",
		"paths": {
			"~/*": [
				"./*"
			],
			"@/*": [
				"./*"
			]
		},
		"types": [
			"@nuxt/types",
			"@types/node",
			"@nuxtjs/axios"
		]
	},
	"exclude": [
		"node_modules",
		".nuxt",
		"dist"
	]
}

```

## Объектный и классовый подход

- для сохранения **объектного стиля** объявления компонентов необходимо всего лишь унаследовать компонент от базового конструктора Vue и экспортировать его

```ts
<script lang="ts">
		import Vue from 'vue';
		const Component = Vue.extend({
				components: {
						Master,
				},
				created() {
				},
				data() {
				},
				computed: {
				},
				methods: {
				},
		})
		export default Component;
</script>
```

- для использования **классового подхода** необходимо воспользоваться библиотекой vue-class-component, которая позволяет описать компонент в синаксисе класса. **Данную библиотеку можно использовать и без TS, на чистом JS**. Такие свойства экземпляра Vue, как props или watch, можно:
	- или передать опцией в декоратор @Component
	```ts
	@Component({
		props: {
			externalProp: {
				type: String,
				default: 'true'
			}
		}
	})
	```
	- или использовать библиотеку Vue Property Decorator
	```ts
	<script lang="ts">
		import Vue from 'vue';
		import Component from 'vue-class-component';
		import { Prop, Watch } from 'vue-property-decorator';


		export default class NewsItem extends Vue {

			@Prop({default: false })
			readonly externalProp!:boolean

			@Watch('externalProp')
			externalPropWatcher(next, prev) {
				if (next !== prev) return;
			}
		}
	</script>
	```

## Примеры описания типов при работе с VueJS, библиотеками NUXT и DOM-деревом

### Ссылки на DOM-элементы ($refs)

Для корректного определения типов при использовании $refs:
```ts
	$refs!: {
		NODE_REF_NAME: NODE_TYPE
	}
```
