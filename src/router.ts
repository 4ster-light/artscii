import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Video from "./views/Video.vue";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/video",
		name: "Video",
		component: Video,
	},
];

export default createRouter({
	history: createWebHistory(),
	routes,
});
