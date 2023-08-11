import { formatDistanceToNow } from 'date-fns';
import { GotmEvent } from './Event';

function EventCard({event}: {event: GotmEvent}) {
    const title = event.title || 'Event';
    const desc = event.description || '';
    const endTs = event.endTs || 0;

    // determine formatted date string and time left
    let endDate = '';
    let timeLeft = '';
    if (endTs !== 0) {
        endDate = new Date(endTs).toLocaleDateString();
        timeLeft = formatDistanceToNow(new Date(endTs), { addSuffix: true })
    }

    return <div className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
        <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-5xl">
                { title }
            </h3>
        </div>

        <div className="flex justify-between items-center my-3">
            <span className="text-emerald-400 text-xl">{ timeLeft }</span>
            <span className="font-bold text-3xl">{ endDate }</span>
        </div>

        { desc.length > 0 ? <div>
            <h5 className="font-extrabold text-xl mb-3">What&apos;s it about?</h5>
            <p className="font-normal">{ desc }</p>
        </div> : "" }
    </div>
}

export default EventCard;
