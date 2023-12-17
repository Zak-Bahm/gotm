import { Link, useParams } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web'
import { checkOwnerShip, decodeEventPath } from "../helpers/paths";
import Header from "../components/Header";
import { useState } from "react";
import { GotmEvent } from "../components/Events/Event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import IncludedEvents from "../components/GroupEvents/IncludedEvents";
import { LoadGroupEventListItem } from "../components/GroupEvents/GroupEventListItem";

function GroupEventPage() {
    // assemble event key from route params
    const { userId, groupId } = useParams();
    const groupPath = `${userId}/group-events/${groupId}`;
    const groupKey = decodeEventPath(groupPath);
    const initQueue: GotmEvent[] = [];
    const [eventQueue, setEventQueue] = useState(initQueue);

    const addEvent = (e: GotmEvent) => setEventQueue([...eventQueue, e]);

    const eventsAnim = useSpring({
        from: { y: '300%' },
        to: { y: '0%' },
    });

    // return a message if unable to decode
    if (groupKey === false) {
        return <div className="w-screen m-6 container mt-5 mx-auto grid">
            <Header title="Group Not Found" />
            <p>Unable to load Group Event</p>
        </div>
    }

    return (
        <animated.div style={{...eventsAnim}} className="m-6 container lg:mt-24 mx-auto">
            <div className="row my-10 items-center m-1 z-20">
                <LoadGroupEventListItem groupId={groupKey}/>
            </div>

            <div className="row my-10 items-center m-1 mb-0">
                <Header title="Included Events"></Header>
            </div>

            <div className="row my-10 items-center m-1 mb-0">
                <IncludedEvents groupId={groupKey} eventQueue={eventQueue} setQueue={setEventQueue}/>
            </div>
        </animated.div>
    )
}

export default GroupEventPage;
