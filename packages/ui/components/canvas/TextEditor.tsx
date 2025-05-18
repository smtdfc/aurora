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

export class CanvasTextEditor extends RumiousComponent<CanvasTextEditorProps> {
  static tagName = "aurora-canvas-text-editor";

  private currentState = createState<string>("User edited");
  private textAreaRef = createElementRef<HTMLTextAreaElement>();
  private easyMDEInstance: any = null;

  constructor() {
    super();
  }

  private injectCDNAssets(): Promise<void> {
    return new Promise((resolve) => {
      if (!document.querySelector('#easymde-css')) {
        const link = document.createElement('link');
        link.id = 'easymde-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/easymde/dist/easymde.min.css';
        document.head.appendChild(link);
      }

      if (!document.querySelector('#easymde-js')) {
        const script = document.createElement('script');
        script.id = 'easymde-js';
        script.src = 'https://unpkg.com/easymde/dist/easymde.min.js';
        script.onload = () => resolve();
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  private async initEditor() {
    await this.injectCDNAssets();
    this.easyMDEInstance = new (window as any).EasyMDE({
      element: this.textAreaRef.value,
      spellChecker: false,
      toolbar: ["bold", "italic", "heading", "|", "quote", "code", "link", "preview"],
      minHeight: "300px",
      autoDownloadFontAwesome: false
    });
  }

  onRender() {
    const context = this.props.context;

    context.on('canvas:read', async () => {
      await this.initEditor();

      const time = new Date().toISOString();
      this.currentState.set(`Model readed - Last time: ${time}`);
      const content = this.easyMDEInstance?.value?.() || this.textAreaRef.value?.value || '';
      context.emit('canvas:content', content);
    });

    context.on('canvas:write', async (commit: CanvasChangeCommit) => {
      await this.initEditor();

      const time = new Date().toISOString();
      this.currentState.set(`Model edited - Last time: ${time}`);
      if (this.easyMDEInstance) {
        this.easyMDEInstance.value(commit.content);
      } else {
        this.textAreaRef.text = commit.content;
      }
    });
  }

  onTextInputChange() {
    const time = new Date().toISOString();
    this.currentState.set(`User edited - Last time: ${time}`);
  }

  template() {
    return (
      <Fragment>
        <span class="p-3">
          <h5>Text editor</h5>
          <span class="sub-text" bind:text={this.currentState}></span>
        </span>
        <br /><br />
        <textarea ref={this.textAreaRef} on:change={() => this.onTextInputChange()} style="width:100%; height:50vh;" />
      </Fragment>
    );
  }
}