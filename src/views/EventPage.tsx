import { useParams } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web'
import { LoadEventCard } from "../components/Events/EventCard"
import { decodeEventPath } from "../helpers/paths";
import Header from "../components/Header";
import GiftForm from "../components/Gifts/GiftForm";

function EventPage() {
    // assemble event key from route params
    const { userId, eventId } = useParams();
    const eventPath = `${userId}/events/${eventId}`;
    const eventKey = decodeEventPath(eventPath)

    const eventAnim = useSpring({
        from: { y: '300%' },
        to: { y: '0%' },
    });
    const giftAnim = useSpring({
        from: { y: '300%' },
        to: { y: '0%' },
    });

    // return a message if unable to decode
    if (eventKey === false) {

        return <div className="w-screen m-6 container mt-5 mx-auto grid">
            <p>Unable to load Event</p>
        </div>
    }

    return (
        <div className="w-screen mx-auto container grid grid-cols-1 lg:grid-cols-3 gap-x-8">
            <animated.div style={{...eventAnim}} className="col-span-1 mt-7 grid">
                <LoadEventCard eventId={eventKey} />
            </animated.div>

            <animated.div style={{...giftAnim}} className="col-span-2 mt-7 grid gap-y-4">
                <Header title="Gifts" />
                <GiftForm eventId={eventKey}/>
            </animated.div>
        </div>
    )
}

export default EventPage;
