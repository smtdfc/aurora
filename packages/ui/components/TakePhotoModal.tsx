import {
  RumiousComponent,
  Fragment,
  RumiousContext,
  createElementRef
} from 'rumious'

import { LightizUIModal } from 'lightiz-ui'
import type { ChatData } from '../types/index.js'

interface TakePhotoModalProps {
  context: RumiousContext < ChatData >
}

export class TakePhotoModal extends RumiousComponent < TakePhotoModalProps > {
  static tagName = "aurora-take-photo-modal";
  private modalRef = createElementRef();
  private videoRef = createElementRef();
  private canvasRef = createElementRef();
  private stream: MediaStream | null = null;
  
  getModal(): LightizUIModal {
    return new LightizUIModal(this.modalRef.target);
  }
  
  closeModal() {
    this.getModal().close();
    this.stopCamera();
    setTimeout(() => this.element.remove(), 5000);
  }
  
  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = this.videoRef.target as HTMLVideoElement;
      video.srcObject = this.stream;
      video.play();
    } catch (error) {
      console.error("Failed to access webcam:", error);
    }
  }
  
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  
  capturePhoto() {
    const context = this.props.context;
    const video = this.videoRef.target as HTMLVideoElement;
    const canvas = this.canvasRef.target as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL("image/png");
    context.emit('chat:input:attach:image', imageData);
    
    this.closeModal();
  }
  
  onRender() {
    this.getModal().open();
    this.startCamera();
  }
  
  template() {
    return (
      <Fragment>
        <div class="modal" ref={this.modalRef}>
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Take photo</h3>
              <button on:click={() => this.closeModal()} class="ml-auto btn btn-icon material-icons">close</button>
            </div>
            <div class="modal-body">
              <video ref={this.videoRef} class="rounded shadow mb-4" autoplay muted style="width:100%;"></video>
              <canvas ref={this.canvasRef} class="hidden" style="display: none;"></canvas>
            </div>
            <div class="modal-footer p-5">
              <button on:click={() => this.capturePhoto()} class="btn btn-primary">Capture</button>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}