import { useState, useEffect } from 'react';
import SimpleLoad from '../SimpleLoad';

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { addYears } from 'date-fns';
import EventListItem from './EventListItem';
import { GotmEvent } from './Event';

// for the events component, show the loading symbol if still loading,
// otherwise a list of events
function Events({loading, events}: {loading: boolean, events: GotmEvent[] }) {
    if (loading) return <SimpleLoad />;
    if (events.length === 0) return <p>Nothing to see here. Why don't you make a new event?</p>;

    return <ul className='list-none'>
        {events.map((e, i, events) => {
            return <EventListItem key={i} event={e} last={i + 1 === events.length} />
        })}
    </ul>;
}

function UserEvents({id}: {id: string}) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);


    // load user events after first render
    useEffect(() => {
        // get events from dynamo db
        const userId: string = id || window.usr.id || '';

        // get events
        const getEvents = async () => {
            const now = Date.now();
            const future = addYears(now, 1).getTime();
            const command = new QueryCommand({
                TableName: window.app.tableName,
                KeyConditionExpression: 'itemType = :itemType AND itemId BETWEEN :itemId1 AND :itemId2',
                ExpressionAttributeValues: {
                    ":itemType": "event",
                    ":itemId1": `${userId}/events/${now}`,
                    ":itemId2": `${userId}/events/${future}`
                }
            });

            const data = await window.ddb.send(command);
            setEvents(data.Items);
        }

        getEvents().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);

    return (
        <Events loading={loading} events={events} />
    )
}

export default UserEvents;
