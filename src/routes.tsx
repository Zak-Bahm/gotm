import { createBrowserRouter } from "react-router-dom";
import Home from './views/Home'
import NewEvent from './views/NewEvent'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
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
