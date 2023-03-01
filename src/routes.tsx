import { createBrowserRouter } from "react-router-dom";
import App from './App'

import Register from './views/Register'

import NewEvent from './views/NewEvent'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/event",
        children: [
            {
                path: "new",
                element: <NewEvent />
            }
        ]
    }
]);

export default router;
