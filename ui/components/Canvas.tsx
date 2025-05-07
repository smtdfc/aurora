import { RumiousComponent, Fragment, RumiousEmptyProps, RumiousContext } from 'rumious';
import { AppContext } from '../context/app.js';
import { EmptyPlaceholder } from './EmptyPlaceholder.jsx'
import type { MessageInfo, ChatData } from '../types/index.js';

interface CanvasProps {
  context: RumiousContext < ChatData >
}

export class Canvas extends RumiousComponent < CanvasProps > {
  static tagName = "smtdfc-canvas";
  
  constructor() {
    super()
  }
  
  template() {
    return (
      <Fragment>
        <div class="canvas-header p-3 d-flex align-center ">
          <h4>Canvas</h4>
          <button class="ml-auto btn btn-icon material-icons" >add</button>
        </div>
        <div class="p-3 canvas-contents">
          <EmptyPlaceholder content="No object, click + to add object "/>
        </div>
      </Fragment>
    );
  }
  
}