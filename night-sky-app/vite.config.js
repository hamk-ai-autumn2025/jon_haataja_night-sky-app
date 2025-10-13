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
                    "react-vendor": ["react", "react-dom"],
                    // Split OpenAI SDK into its own chunk (largest dependency)
                    "openai-vendor": ["openai"],
                    // Split world-countries separately (it's quite large)
                    "countries-vendor": ["world-countries"],
                    // Axios in its own chunk
                    "axios-vendor": ["axios"],
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
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html", "lcov"],
            exclude: [
                "node_modules/",
                "dist/",
                "**/*.config.{js,ts}",
                "**/*.d.ts",
                "**/types/",
                "**/__tests__/",
                "setupTests.ts",
                "src/vite-env.d.ts",
                "src/main.tsx", // Entry point, typically not tested
            ],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 65,
                statements: 70,
            },
            // Auto-enable coverage when running tests with --coverage flag
            all: true,
            include: ["src/**/*.{ts,tsx}"],
        },
    },
});
