import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import os from 'os';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config();


const shouldMinify = process.env.MINIFY === 'true' || process.env.NODE_ENV === 'production';

export default {
  input: './index.tsx',
  output: {
    dir: process.env.DIST || "../../public/dist",
    format: 'esm',
    sourcemap: !shouldMinify,
    entryFileNames: 'index.min.js',
    manualChunks(id) {
      if (id.includes('node_modules')) {
        const dirs = id.split('node_modules/')[1].split('/');
        const name = dirs[0].startsWith('@') ? `${dirs[0]}/${dirs[1]}` : dirs[0];
        return `${name}`;
      }
    },
    chunkFileNames: (chunkInfo) => {
      if (chunkInfo.moduleIds.some(id => id.includes('node_modules'))) {
        return shouldMinify ?
          'vendors/[hash]/index.min.js':
          'vendors/[name].js';
      }
      return shouldMinify ?
        'chunks/[name]-[hash].js' :
        'chunks/[name].js';
    },
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.BACKEND_HOST': JSON.stringify(process.env.BACKEND_HOST),
      }
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
      ],
      plugins: ['@babel/plugin-syntax-jsx', 'babel-plugin-rumious'],
    }),
    shouldMinify &&
    terser({
      compress: {
        drop_console: true,
        passes: 3,
        pure_getters: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        sequences: true,
        booleans: true,
        hoist_funs: true,
        hoist_vars: true,
        reduce_funcs: true,
        reduce_vars: true,
        collapse_vars: true,
        join_vars: true,
        typeofs: true,
        inline: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
      output: {
        comments: false,
        beautify: false,
      },
      maxWorkers: os.cpus().length || 1,
    }),
  ].filter(Boolean),
};