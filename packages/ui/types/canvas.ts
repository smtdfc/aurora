export type CanvasModes= "graphic" | "text";
export interface CanvasObject{
  id:string,
  mode:CanvasModes;
};

export interface CanvasChangeCommit{
  type:string,
  content:string
}
