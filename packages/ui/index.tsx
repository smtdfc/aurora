import { createApp, Fragment } from 'rumious';
import {initRouter} from './router/index.js';
import {Navbar} from "./components/Navbar.jsx"

const app = createApp(document.getElementById("root") as HTMLElement);
const router = initRouter(app);

app.render(
  <Fragment>
    <Navbar />
    <div>{router.rootInject}</div>
  </Fragment>
);

router.start();