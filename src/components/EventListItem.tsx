import { formatDistanceToNow } from 'date-fns'

function EventListItem({event, last}: {event: any, last: boolean}) {
    const title = event.title?.S || 'Event';
    const desc = event.description?.S || '';
    const endTs = parseInt(event.endTs?.N || '0');

    // determine formatted date string and time left
    let endDate = '';
    let timeLeft = '';
    if (endTs !== 0) {
        endDate = new Date(endTs).toLocaleDateString();
        timeLeft = formatDistanceToNow(new Date(endTs), { addSuffix: true })
    }

    return <li className="border-2 border-emerald-100 rounded-lg p-3 mt-4">
        <h3 className="font-extrabold text-5xl">
            { title }
        </h3>
        <span className="text-emerald-400 text-xl">{ timeLeft }</span>

        <span className="font-bold text-3xl">{ endDate }</span>

        <p className="font-normal">{ desc }</p>
    </li>
}

export default EventListItem;
