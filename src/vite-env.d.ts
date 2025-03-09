/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<
		Record<string | number | symbol, never>,
		Record<string | number | symbol, never>,
		undefined
	>;
	export default component;
}
