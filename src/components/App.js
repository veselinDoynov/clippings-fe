import React from "react";
import {Route, Switch} from "react-router-dom";
import HomePage from "./home/HomePage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";


import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <div className="container-fluid">
            <Header/>
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route component={PageNotFound}/>
            </Switch>
            <ToastContainer autoClose={3000} hideProgressBar/>
        </div>
    );
}

export default App;
