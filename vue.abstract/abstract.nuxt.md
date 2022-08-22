# NUXTJS

## Обобщенный опыт по использованию Nuxt

### Подключение компонентов, использующих объект window, в качестве плагинов (aka "window is not defined" error via slick, vue-avatar-cropper, etc...)
*Проблема: при использовании компонентов, рассчитывающих в своей работе на наличие объектов window/document во время серверного рендеринга падает ошибка "window is not defined"*

Решение заключается в подключении компонента в качестве плагина и исключения его из серверного рендеринга:
- создаем плагин, например, `vue-avatar-cropper.js`:
	```js
	import Vue from 'vue';
	import AvatarCropper from "vue-avatar-cropper";
	Vue.use(AvatarCropper);
	```

- подключаем его в `nuxt.config.js` и исключаем на этапе собрки модулей вебпаком с помощью `webpack-node-externals` по условию `isServer`
	```js
	const nodeExternals = require('webpack-node-externals');
	plugins: [ {src: '~/plugins/vue-avatar-cropper.js', ssr: false} ],
	build: {
		extend (config, { isDev, isClient, isServer }) {
			if (isServer) {
					config.externals = [
							nodeExternals({
							whitelist: [/^vue-avatar-cropper/]
							})
					]
			}
		}
	}
	```

- во vue-модуле создаем динамический компонент:
	- Регистрируем плагин как результат работы функции `components: { AvatarCropper: () => import('vue-avatar-cropper')}`
	- в `data` создаем поле, в которое далее запишем имя импортированного компонента
		```js
		data() {
				return {AvatarCropperComponent: undefined}
		},
		```
	- На этапе ЖЦ mounted присвоим имя импортированного компонента полю AvatarCropperComponent
	```js
	mounted(){
		this.$nextTick(function () {
				this.AvatarCropperComponent = 'AvatarCropper'
		})
	},
	```
	- подключаем в шаблон компонент с помощью встроенного объекта `component`, который будет ссылаться на значение `AvatarCropperComponent` в `data`
	`<component  :is="AvatarCropperComponent" @uploaded="handleUploaded" trigger="#pick-avatar" upload-url="/files/upload"></component>`