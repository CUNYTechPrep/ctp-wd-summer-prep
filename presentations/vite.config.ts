import mdx from '@mdx-js/rollup'
import {defineConfig} from 'vite'
import { resolve } from 'path'
import type { Plugin } from 'vite'

// Generate entry points for all sections
const jsSections = [
  'html-basics', 'css-fundamentals', 'introduction', 'variables-and-types',
  'functions', 'control-flow', 'objects-and-arrays', 'dom-manipulation',
  'async-javascript', 'error-handling', 'advanced-functions', 'prototypes',
  'modules', 'modern-features', 'common-pitfalls', 'best-practices'
];

const tsSections = [
  'introduction', 'type-problems', 'type-basics', 'interfaces-and-types', 'unions-and-literals',
  'generics', 'type-guards', 'utility-types', 'classes-and-oop',
  'modules-and-namespaces', 'async-types', 'common-patterns',
  'react-typescript', 'testing-typescript', 'migration-strategies',
  'ecosystem-and-tools'
];

// Create entry points object
const input = {
  main: resolve(__dirname, 'index.html')
};

// Custom plugin to handle client-side routing
const clientRouterPlugin = (): Plugin => {
  return {
    name: 'client-router',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Check if this is a navigation request for our app routes
        if (req.url && req.headers.accept?.includes('text/html')) {
          const url = req.url.split('?')[0].split('#')[0];
          // Match our presentation routes: /js/*, /ts/*, /react/*
          if (url.match(/^\/(js|ts|react)\/[\w-]+\/?$/)) {
            req.url = '/';
          }
        }
        next();
      });
    }
  };
};

const viteConfig = defineConfig({
  base: process.env.PUBLIC_URL || '/', // Set base path for GitHub Pages subdirectory
  plugins: [
    mdx(/* jsxImportSource: …, otherOptions… */),
    clientRouterPlugin()
  ],
  build: {
    rollupOptions: {
      input
    },
  },
  optimizeDeps: {
    exclude: ['monaco-themes']
  }
})

export default viteConfig