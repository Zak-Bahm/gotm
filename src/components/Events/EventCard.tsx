import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import SimpleLoad from '../SimpleLoad';
import { GotmEvent } from './Event';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { encodeEventPath } from '../../helpers/paths';
import { putEvent } from '../GroupEvents/AddEventForm';

// for the events component, show the loading symbol if still loading,
// otherwise an event card
function DynEventCard({loading, event}: {loading: boolean, event: GotmEvent | false }) {
    if (loading) return <SimpleLoad />;
    if (event === false) return <div className="shadow-dark-out rounded-lg p-7 mt-7 grid grid-flow-row auto-rows-max">
        <div className="flex justify-between items-center">
            <h5 className="font-extrabold text-3xl">
                Unable to load Event
            </h5>
        </div>
    </div>

    return <EventCard event={event} />;
}

function LoadEventCard({eventId}: {eventId: string}) {
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
        <DynEventCard loading={loading} event={event} />
    )
}

async function leaveGroup(event: GotmEvent, setInGroup: (u: boolean) => void) {
    // first remove link from group event
    await putEvent(false, event.groupEventId);

    // then update event group participation
    event.groupEventId = '';
    setInGroup(false);
}

function EventCard({event}: {event: GotmEvent}) {
    const title = event.title || 'Event';
    const name = event.name || '';
    const desc = event.description || '';
    const endTs = event.endTs || 0;
    const groupPath = '/' + (encodeEventPath(event.groupEventId || '') || '#');
    const [inGroup, setInGroup] = useState(event.groupEventId.length > 0);

    // determine formatted date string and time left
    let endDate = '';
    let timeLeft = '';
    if (endTs !== 0) {
        endDate = new Date(endTs).toLocaleDateString();
        timeLeft = formatDistanceToNow(new Date(endTs), { addSuffix: true })
    }

    return (
        <div className="shadow-dark-out rounded-lg m-3 p-5 lg:p-10">
            <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-5xl">
                    { title }
                </h3>
            </div>

            <div className="flex justify-between items-center my-3 mt-10">
                <span className="text-emerald-400 text-xl">{ timeLeft }</span>
                <span className="font-bold text-3xl">{ endDate }</span>
            </div>

            <div className="flex justify-between items-center my-3">
                <span className="text-xl">Creator: </span>
                <span className="text-emerald-400 text-xl">{ name }</span>
            </div>

            { inGroup ? <div className="flex justify-between items-center my-3 mt-10">
                <span className="font-bold text-2xl">Related events: </span>
                <Link to={ groupPath }>
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold'>
                        <FontAwesomeIcon icon={faUsersViewfinder} className='me-1' />
                        View Group
                    </button>
                </Link>
            </div> : "" }

            { desc.length > 0 ? <div className="mt-10">
                <h5 className="font-extrabold text-xl mb-3">What&apos;s it about?</h5>
                <p className="font-normal">{ desc }</p>
            </div> : "" }

            <div className="mt-10">
                <h3 className="font-bold text-2xl">
                    Actions
                </h3>
                <div className="flex justify-between items-center mt-3">
                    { inGroup ? <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold' onClick={async () => {leaveGroup(event, setInGroup)}}>
                        <FontAwesomeIcon icon={faUsersViewfinder} className='me-1' />
                        Leave Group
                    </button> : "" }
                </div>
            </div>
        </div>
    )
}

export { EventCard, LoadEventCard };
