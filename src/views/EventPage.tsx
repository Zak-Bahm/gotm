import { useParams } from "react-router-dom";
import { LoadEventCard } from "../components/Events/EventCard"
import { decodeEventPath } from "../helpers/paths";

function EventPage() {
    // assemble event key from route params
    const { userId, eventId } = useParams();
    const eventPath = `${userId}/events/${eventId}`;
    const eventKey = decodeEventPath(eventPath)

    // return a message if unable to decode
    if (eventKey === false) {

        return <div className="w-screen m-6 container mt-24 mx-auto">
            <p>Unable to load Event</p>
        </div>
    }

    return (
        <div className="w-screen m-6 container mt-24 mx-auto">
            <div className="row">
                <LoadEventCard eventId={eventKey} />
            </div>
        </div>
    )
}

export default EventPage;
