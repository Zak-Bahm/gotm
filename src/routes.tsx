import { createBrowserRouter } from "react-router-dom";
import Home from './views/Home'
import EventPage from './views/EventPage'
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
            },
            {
                path: "",
                element: <EventPage />
            }
        ]
    }
]);

export default router;
