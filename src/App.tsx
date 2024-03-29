import SplashLoad from "./components/SplashLoad"
import Register from "./views/Register"
import { RouterProvider, redirect } from "react-router-dom";
import router from './routes';
import { useState, useEffect } from 'react';

import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GoogleOAuthProvider } from '@react-oauth/google';
import OAuthData from '../client_secret.json';

// initialize global user object
window.usr = {
    name: '',
    id: ''
}

// initialize global constants
window.app = {
    tableName: "gotm"
}

// for the main component, render either the user register page
// or the router if the user exists
function Main({present, usrPresent}: {present: boolean, usrPresent: () => void}) {
    return present ? <RouterProvider router={router} /> : <Register usrPresent={usrPresent}/>;
}

function removeUser() {
    // unset global variables
    delete window.usr.name;
    delete window.usr.id;

    // persist new user data
    localStorage.removeItem("user-name");
    localStorage.removeItem("user-id");

    return redirect("/");
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
        }

        // determine if user is present
        const namePresent = window.usr.name !== undefined && window.usr.name.length > 0;
        const idPresent = window.usr.id !== undefined && window.usr.id.length > 0;
        const isPresent =  namePresent && idPresent;

        // set state values
        setUserPresent(isPresent);
        window.logOut = () => { setUserPresent(false); removeUser(); }

        // setup ddb client
        const ddbConfig: DynamoDBClientConfig = {
            credentials: {
                accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
                secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
            },
            region: "us-east-1",
        };
        const client = new DynamoDBClient(ddbConfig);
        const ddbDocClient = DynamoDBDocumentClient.from(client);
        window.ddb = ddbDocClient;

        setLoading(false);
    }, []);

    return (
        <GoogleOAuthProvider clientId={OAuthData["web"]["client_id"]}>
            <div className="App">
                <SplashLoad loading={loading} />
                <Main present={userPresent} usrPresent={usrPresent} />
            </div>
        </GoogleOAuthProvider>
    )
}

export default App
