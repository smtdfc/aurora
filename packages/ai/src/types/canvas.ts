export interface Context {
  state: {
    canvas: {
      mode: string
    }
  },
  onCanvasModeChange ? : (mode: string) => any;
  onRequestWriteCanvas ? : (contentType: string, content: any) => any,
  onRequestReadCanvas ? : () => any;
}