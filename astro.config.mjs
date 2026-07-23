import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import letterpressLight from './src/styles/themes/letterpress-light.json';
import letterpressDark from './src/styles/themes/letterpress-dark.json';

export default defineConfig({
  site: 'https://nescript.github.io',
  base: '/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: letterpressLight,
        dark: letterpressDark,
      },
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
