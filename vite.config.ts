import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
	plugins: [preact()],
	build: {
		rollupOptions: {
			input: {
				main: "./src/action.html",
				options: "./src/options/options.html",
				// background: "./src/background"
			},
		},
	},
});
