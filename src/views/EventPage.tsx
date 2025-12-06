import { useParams } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web'
import { LoadEventCard } from "../components/Events/EventCard"
import { checkOwnerShip, decodeEventPath } from "../helpers/paths";
import Header from "../components/Header";
import GiftForm from "../components/Gifts/GiftForm";
import EventGifts from "../components/Gifts/EventGifts";
import { useState } from "react";
import { Gift } from "../components/Gifts/Gift";
import { GotmEvent } from "../components/Events/Event";

function EventPage() {
    // assemble event key from route params
    const { userId, eventId } = useParams();
    const eventPath = `${userId}/events/${eventId}`;
    const eventKey = decodeEventPath(eventPath);
    const initQueue: Gift[] = [];
    const [giftQueue, setGiftQueue] = useState(initQueue);
    const [eventDetails, setEventDetails] = useState<GotmEvent | null>(null);

    const addGift = (g: Gift) => setGiftQueue([...giftQueue, g]);

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
            <Header title="Event Not Found" />
            <p>Unable to load Event</p>
        </div>
    }

    const isReadOnly = Boolean(eventDetails?.endTs && eventDetails.endTs < Date.now());

    return (
        <div className="w-screen mx-auto container grid grid-cols-1 lg:grid-cols-3 gap-x-8">
            <animated.div style={{...eventAnim}} className="lg:col-span-1 mt-7">
                <LoadEventCard eventId={eventKey} onEventChange={setEventDetails} />
            </animated.div>

            <animated.div style={{...giftAnim}} className="lg:col-span-2 mt-7 flex flex-col gap-y-4">
                <Header title="Gifts" />
                <GiftForm eventId={eventKey} newGift={addGift} readOnly={isReadOnly}/>
                <EventGifts eventId={eventKey} giftQueue={giftQueue} setQueue={setGiftQueue} readOnly={isReadOnly}/>
            </animated.div>
        </div>
    )
}

export default EventPage;
