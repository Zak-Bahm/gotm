import { formatDistanceToNow } from 'date-fns';
import { GotmEvent } from './Event';
import { Link } from "react-router-dom";
import { encodeEventPath } from '../../helpers/paths';

function EventListItem({event, last}: {event: GotmEvent, last: boolean}) {
    const title = event.title || 'Event';
    const desc = event.description || '';
    const endTs = event.endTs || 0;
    const path = encodeEventPath(event.itemId) || '#';

    // determine formatted date string and time left
    let endDate = '';
    let timeLeft = '';
    if (endTs !== 0) {
        endDate = new Date(endTs).toLocaleDateString();
        timeLeft = formatDistanceToNow(new Date(endTs), { addSuffix: true })
    }

    return <li className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
        <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-5xl">
                { title }
            </h3>
            <Link to={ path }>
                <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-2xl font-extrabold'>Check it Out</button>
            </Link>
        </div>

        <div className="flex justify-between items-center my-3">
            <span className="text-emerald-400 text-xl">{ timeLeft }</span>
            <span className="font-bold text-3xl">{ endDate }</span>
        </div>

        { desc.length > 0 ? <div>
            <h5 className="font-extrabold text-xl mb-3">What&apos;s it about?</h5>
            <p className="font-normal">{ desc }</p>
        </div> : "" }
    </li>
}

export default EventListItem;
