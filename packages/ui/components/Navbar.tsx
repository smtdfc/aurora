import { RumiousComponent } from 'rumious';

interface NavbarProps {}

export class Navbar extends RumiousComponent < NavbarProps > {
  static tagName = "smtdfc-navbar";
  
  onRender() {
    const navbar = this.element.querySelector('.navbar') as HTMLElement;
    
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollTop >= 25) {
        navbar.classList.add("navbar-shadow");
        navbar.style.background = 'white';
      } else {
        navbar.classList.remove("navbar-shadow");
        navbar.style.background = 'transparent';
      }
    };
    
    window.addEventListener('scroll', onScroll);
  }
  
  onDestroy() {
    
  }
  
  template() {
    return (
      <div class="navbar navbar-shadow" style="position: sticky!important; background: transparent;">
        <div class="navbar-header">
          <button class="btn btn-icon material-icons">menu</button>
          <h3 class="navbar-title">Aurora</h3>
        </div>
        <div class="navbar-items">
        </div>
      </div>
    );
  }
}