import {
  RumiousComponent,
  Fragment,
  RumiousContext,
  createElementRef,
  createState,
  watch
} from 'rumious';

import {
  LightizUIModal
} from 'lightiz-ui';

import type { 
  ChatData ,
  CanvasObject,
  CanvasModes
} from '../types/index.js';

import { ChatService } from '../services/chat.js';


const CANVAS_MODES:Record<CanvasModes, string >= {
  "graphic": "Graphic Canvas",
  "text":"Text Canvas"
};


interface SelectCanvasModeModalProps {
  context: RumiousContext < ChatData >
}

export class SelectCanvasModeModal extends RumiousComponent < SelectCanvasModeModalProps > {
  static tagName = "aurora-add-object-modal";
  private modalRef = createElementRef();
  private currentType = createState < CanvasModes > ("graphic");
  
  getModal(): LightizUIModal {
    return new LightizUIModal(
      this.modalRef.target
    );
  }
  
  closeModal() {
    this.getModal().close();
    setTimeout(() => this.element.remove(), 3000);
  }
  
  onRender() {
    this.getModal().open();
  }
  
  onDoneBtnClick(){
    ChatService.changeCanvas(
      this.props.context,
      this.currentType.value
    );
    
    this.closeModal();
  }
  
  template() {
    return (
      <Fragment>
        <div class="modal" ref={this.modalRef}>
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Select canvas mode</h3>
              <button on:click={()=> this.closeModal()} class="ml-auto btn btn-icon material-icons" >close</button>
            </div>
            <div class="modal-body">
              <div class="form-group m-0">
                <label class="form-label">Mode:</label>
                <select class="form-select" model={this.currentType}>
                  {Object.entries(CANVAS_MODES).map(([key, label]:[string, string]) => (
                    <option value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <br/>
            </div>
            <div class="modal-footer p-5">
              <button on:click={()=> this.onDoneBtnClick()} class="ml-auto btn btn-primary" >Done</button>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}