import EventCard from "../components/Events/EventCard"

function EventPage() {
    return (
        <div className="m-6 container mt-24 mx-auto columns-2">
            <EventCard id={window.usr.id} />
        </div>
    )
}

export default EventPage;
