import { formatDistanceToNow } from 'date-fns';
import { GotmEvent } from './Event';
import { Link } from "react-router-dom";
import { checkOwnerShip, decodeEventPath, encodeEventPath } from '../../helpers/paths';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import SimpleLoad from '../SimpleLoad';
import { useEffect, useState } from 'react';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

// show the loading symbol if still loading,
// otherwise an event list item
function DynEventListItem({loading, event}: {loading: boolean, event: GotmEvent | false }) {
    if (loading) return <SimpleLoad />;
    if (event === false) return <div className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
        <div className="flex justify-between items-center">
            <h5 className="font-extrabold text-3xl">
                Unable to load Event
            </h5>
        </div>
    </div>

    return <EventListItem event={event}/>;
}

function LoadEventListItem({eventId}: {eventId: string}) {
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<GotmEvent | false>(false);

    // load event after first render
    useEffect(() => {
        // get events
        const getEvents = async () => {
            const command = new GetCommand({
                TableName: window.app.tableName,
                Key: {
                    itemType: "event",
                    itemId: eventId
                }
            });

            const data = await window.ddb.send(command);
            if (typeof data.Item != 'undefined') setEvent(data.Item);
        }

        getEvents().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);

    return (
        <DynEventListItem loading={loading} event={event} />
    )
}
function EventListItem({event}: {event: GotmEvent}) {
    const title = event.title || 'Event';
    const name = event.name || '';
    const desc = event.description || '';
    const endTs = event.endTs || 0;
    const path =  '/' + (encodeEventPath(event.itemId) || '#');

    // determine formatted date string and time left
    let endDate = '';
    let timeLeft = '';
    if (endTs !== 0) {
        endDate = new Date(endTs).toLocaleDateString();
        timeLeft = formatDistanceToNow(new Date(endTs), { addSuffix: true })
    }

    return <li className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <h3 className="font-extrabold text-5xl mb-3">
                { title }
            </h3>
            <Link to={ path } className="grid lg:justify-items-end">
                <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-xl font-extrabold'>
                    <FontAwesomeIcon icon={faCalendarDay} className="me-1" />
                    View Event
                </button>
            </Link>
        </div>

        <div className="flex justify-between items-center my-3">
            <span className="text-emerald-400 text-xl">{ timeLeft }</span>
            <span className="font-bold text-3xl">{ endDate }</span>
        </div>

        { checkOwnerShip(path) == false ? <div className="flex justify-between items-center my-3">
            <span className="text-xl">Creator: </span>
            <span className="text-emerald-400 text-xl">{ name }</span>
        </div> : "" }

        { desc.length > 0 ? <div>
            <h5 className="font-extrabold text-xl mb-3">What&apos;s it about?</h5>
            <p className="font-normal">{ desc }</p>
        </div> : "" }
    </li>
}

export { EventListItem, LoadEventListItem };
