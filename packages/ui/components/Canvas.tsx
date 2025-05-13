import {
  RumiousComponent,
  Fragment,
  RumiousContext,
  createElementRef
} from 'rumious';
import { AppContext } from '../context/app.js';
import { EmptyPlaceholder } from './EmptyPlaceholder.jsx'
import type { MessageInfo, ChatData, CanvasModes } from '../types/index.js';
import { SelectCanvasModeModal } from './SelectCanvasModeModal.jsx'
import { CanvasTextEditor } from './canvas/TextEditor.jsx';

interface CanvasProps {
  context: RumiousContext < ChatData >
}

export class Canvas extends RumiousComponent < CanvasProps > {
  static tagName = "aurora-canvas";
  private canvasRef = createElementRef();
  private emptyPlaceholder = createElementRef();
  private canvasContentRef = createElementRef();
  
  constructor() {
    super();
  }
  
  addObject(data: CanvasModes) {
    this.emptyPlaceholder.addClasses("d-none");
    this.canvasContentRef.text = "";
    switch (data) {
      case "text":
        this.canvasContentRef.addChild(this.render(
          <CanvasTextEditor
            context={this.props.context}
          />
        ));
        break;
    }
  }
  
  onRender() {
    let context = this.props.context;
    context.on("canvas:mode:change", (data: CanvasModes) => this.addObject(data));
    context.on("canvas:open", () => this.element.classList.add("open"));
    context.on("canvas:close", () => this.element.classList.remove("open"));
  }
  
  onChangeBtnClick() {
    this.warp(
      <SelectCanvasModeModal context={this.props.context}/>,
      document.body
    );
  }
  
  template() {
    return (
      <Fragment>
        <div ref={this.canvasRef} class="canvas-header p-3 d-flex align-center ">
          <h4>Canvas</h4>
          <div class="ml-auto d-flex align-center">
            <button on:click={()=> this.onChangeBtnClick()} class="ml-auto btn btn-icon material-icons" >change_circle</button>
            <button on:click={()=> this.element.classList.remove("open")} class="ml-auto btn btn-icon material-icons" >close</button>
          </div>
        </div>
        <div class="p-3 canvas-contents">
          <span ref={this.emptyPlaceholder}>
            <EmptyPlaceholder 
              content="No item here" 
            />
          </span>
          <span ref={this.canvasContentRef} />
        </div>
      </Fragment>
    );
  }
  
}