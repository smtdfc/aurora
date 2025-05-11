import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const shouldMinify = process.env.MINIFY === 'true' || process.env.NODE_ENV === 'production';

export default {
  input: './src/index.ts',
  output: {
    dir: './dist',
    format: 'esm',
    sourcemap: !shouldMinify,
    entryFileNames: 'index.js',
    paths:{
      "aurora-ai-helper":path.resolve(__dirname, '../ai/dist/index.js')
    }
  },
  external: [
    'dotenv',
    "aurora-ai-helper",
    'fastify',
    'socket.io'
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        ['@babel/preset-typescript', { isTSX: false, allExtensions: true }],
      ],
      plugins: ['@babel/plugin-syntax-jsx'],
    }),
  ].filter(Boolean),
};