import SplashLoad from "./components/SplashLoad"
import Register from "./views/Register"
import { RouterProvider } from "react-router-dom";
import router from './routes';
import { useState, useEffect } from 'react';

// initialize global user object
window.usr = {
    name: '',
    id: '',
    key: {}
}

// for the main component, render either the user register page
// or the router if the user exists
function Main({present, usrPresent}: {present: boolean, usrPresent: () => {}}) {
    return present ? <RouterProvider router={router} /> : <Register usrPresent={usrPresent}/>;
}

function App() {
    const [loading, setLoading] = useState(true);
    const [userPresent, setUserPresent] = useState(false);

    const usrPresent = () => setUserPresent(true);

    // load user info after first render
    useEffect(() => {
        // get data from local storage if present
        const userId = localStorage.getItem("user-id");
        if (userId != null) {
            window.usr.name = localStorage.getItem("user-name") || '';
            window.usr.id = localStorage.getItem("user-id") || '';
            window.usr.key = JSON.parse(localStorage.getItem("user-key") || '{}');
        }

        // determine if user is present
        const isPresent = window.usr.name.length > 0 && window.usr.id.length > 0;

        // set state values
        setUserPresent(isPresent);
        setLoading(false);
    }, []);

    return (
        <div className="App">
            <SplashLoad loading={loading} />
            <Main present={userPresent} usrPresent={usrPresent} />
        </div>
    )
}

export default App
