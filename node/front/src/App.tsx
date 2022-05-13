import React from "react";
import { BrowserRouter, Switch, Route, } from "react-router-dom";
import CoreDetail from "./features/core/CoreDetail";
import styles from "./App.module.css";
import Core from "./features/core/Core";

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter>
        
          <Switch>
            <Route exact path="/" component={Core} />
            <Route exact path="/post/:id" component={CoreDetail} />
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
