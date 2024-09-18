import { defineConfig, build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packages = [{ name: 'Uploader', path: 'packages/uploader' }];

async function buildPackages() {
  for (const pkg of packages) {
    const config = defineConfig({
      build: {
        lib: {
          entry: resolve(__dirname, `../${pkg.path}/src/index.ts`),
          name: pkg.name,
          formats: ['es', 'umd', 'cjs'],
        },
        rollupOptions: {
          external: ['react', 'axios', 'cookie_js'],
          output: {
            globals: {
              react: 'React',
              axios: 'axios',
              cookie_js: 'Cookies',
            },
          },
        },
        outDir: resolve(__dirname, `../${pkg.path}/lib`),
      },
    });
    await build(config);
  }
}

buildPackages();
