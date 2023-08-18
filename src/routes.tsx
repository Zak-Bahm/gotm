import { createBrowserRouter, useLocation } from "react-router-dom";
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
            }
        ]
    },
    {
        path: ":userId",
        children: [
            {
                path: "events",
                children: [
                    {
                        path: ":eventId",
                        element: <EventPage/>
                    }
                ]
            }
        ]
    }
]);

export default router;
