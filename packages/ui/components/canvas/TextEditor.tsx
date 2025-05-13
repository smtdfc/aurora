import {
  RumiousComponent,
  Fragment,
  RumiousEmptyProps,
  RumiousContext,
  createElementRef,
  createState
} from 'rumious';

import type {
  ChatData,
  CanvasChangeCommit
} from '../../types/index.js';

interface CanvasTextEditorProps {
  context: RumiousContext < ChatData >
}

export class CanvasTextEditor extends RumiousComponent < CanvasTextEditorProps > {
  static tagName = "aurora-canvas-text-editor"
  private currentState = createState < string > ("User edited");
  private textAreaRef = createElementRef();
  
  constructor() {
    super();
  }
  
  onRender() {
    let context = this.props.context;
    
    context.on('canvas:read', () => {
      let time = new Date().toISOString();
      this.currentState.set(`Model readed - Last time: ${time}`);
      context.emit('canvas:content', this.textAreaRef.text);
    });
    
    context.on('canvas:write', (commit: CanvasChangeCommit) => {
      let time = new Date().toISOString();
      this.currentState.set(`Model edited - Last time: ${time}`);
      this.textAreaRef.text = commit.content;
    });
  }
  
  onTextInputChange() {
    let time = new Date().toISOString();
    this.currentState.set(`User edited - Last time: ${time}`);
  }
  
  template() {
    return (
      <Fragment>
        <span class="p-3" >
          <h5>Text editor </h5>
          <span class="sub-text" bind:text={this.currentState}></span>
        </span>
        <br/><br/>
        <textarea ref={this.textAreaRef} on:change={()=> this.onTextInputChange()} style="width:100%; height:50vh;"/>
      </Fragment>
    );
  }
}