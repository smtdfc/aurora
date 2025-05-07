import { RumiousComponent, Fragment } from 'rumious';
import {AppContext} from '../context/app.js';


interface GeoGebraProps {}

export class GeoGebraLayoutComponent extends RumiousComponent < GeoGebraProps > {
  static tagName = "smtdfc-ggb";
  private geogebraLoaded = false;

  loadGeogebraApp() {
    if (this.geogebraLoaded) return;
    this.geogebraLoaded = true;
    
    requestAnimationFrame(() => {
      const width = this.element.clientWidth;
      const height = window.innerHeight;
      
      const params = {
        appName: "cas",
        width,
        height,
        showToolBar: false,
        showAlgebraInput: true,
        showMenuBar: false
      };
      // @ts-ignore
      const app = new GGBApplet(params, true);
      app.inject("ggb-inject");
      this.element.classList.add("active");
    });
  }
  
  loadGeogebraScriptAndApp() {
    // @ts-ignore
    if (window.GGBApplet) {
      this.loadGeogebraApp();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdn.geogebra.org/apps/deployggb.js";
      script.onload = () => this.loadGeogebraApp();
      document.body.appendChild(script);
    }
  }
  
  onRender() {
    AppContext.on("load_canvas",()=>{
      
    })
  }
  
  template() {
    return (
      <Fragment>
        <div class="header d-flex align-center p-3" >
          <h4>Canvas</h4>
          <button on:click={()=>{document.querySelector("smtdfc-ggb")?.classList.remove("open")}} class="ml-auto btn btn-icon material-icons" >close </button>
        </div>
        <br/><br/>
        <div id="ggb-inject"/>
      </Fragment>
    );
  }
  
}


/*
  ChatData:{
    messages:[],
    canvasObject:[
      {
        name:"abc",
        type:"expression",
        description:"abcdef"
      },
      {
        name:"def"
        type:"text",
        description:"abcder"
      }
    ]
  }


{
  type:"Create",
  label:"Đạo hàm của f(x)"
  target:"abc",
  value:{
    type:"expression",
    value:"2x^3"
  }
}



*/