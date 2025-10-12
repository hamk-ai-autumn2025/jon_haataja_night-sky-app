import "vitest/config";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split React and React-DOM into their own chunk
                    'react-vendor': ['react', 'react-dom'],
                    // Split OpenAI SDK into its own chunk (largest dependency)
                    'openai-vendor': ['openai'],
                    // Split world-countries separately (it's quite large)
                    'countries-vendor': ['world-countries'],
                    // Axios in its own chunk
                    'axios-vendor': ['axios'],
                },
            },
        },
        // Increase the warning limit to 700KB since world-countries is large
        chunkSizeWarningLimit: 700,
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./setupTests.ts"],
        globals: true,
    },
});
