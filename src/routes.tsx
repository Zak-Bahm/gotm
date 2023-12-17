import { createBrowserRouter, useLocation } from "react-router-dom";
import Home from './views/Home'
import EventPage from './views/EventPage'
import NewEvent from './views/NewEvent'
import NewGroupEvent from "./views/NewGroupEvent";
import GroupEventPage from "./views/GroupEventPage";

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
                path: "group",
                element: <NewGroupEvent />
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
            },
            {
                path: "group-events",
                children: [
                    {
                        path: ":groupId",
                        element: <GroupEventPage/>
                    }
                ]
            }
        ]
    }
]);

export default router;
