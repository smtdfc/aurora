import {
  ArtiusToolDecaration
} from 'artius';

import{
  Context
}from '../types/index.js'

import {initCanvasTool} from './canvas.js';

export function initTool(context:Context): Record<any,ArtiusToolDecaration>{
  return {
    ...initCanvasTool(context)
  };
}