import "./App.css";

import { Switch, Route } from "react-router-dom";
import Intro from "./Page/Intro";
import Info from "./Page/Info";
import Agreements from "./Page/Agreements";
import Select from "./Page/Select";
import Camera from "./Page/Camera";
import Errorpage from "./Page/Errorpage"
import { PREFIX } from "./config";
import ConfirmPass from "./Page/ConfirmPass";
import AdminSignup from "./Page/AdminSignup"

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={`${PREFIX}/`} component={Intro} exact />
        <Route path={`${PREFIX}/info`} component={Info} exact />
        <Route path={`${PREFIX}/agreements`} component={Agreements} exact />
        <Route path={`${PREFIX}/select`} component={Select} exact />
        <Route path={`${PREFIX}/camera`} component={Camera} exact />
        <Route path={`${PREFIX}/errorpage`} component={Errorpage} exact />
        <Route path={`${PREFIX}/confirmpass`} component={ConfirmPass} exact />
        <Route path={`${PREFIX}/adminsignup`} component={AdminSignup} exact />
      </Switch>
    </div>
  );
}

export default App;