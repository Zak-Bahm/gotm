import { useState, useEffect } from 'react';
import SimpleLoad from './SimpleLoad';

import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { addYears } from 'date-fns'
import EventListItem from './EventListItem';

// for the events component, show the loading symbol if still loading,
// otherwise a list of events
function Events({loading, events}: {loading: boolean, events: any[] }) {
    if (loading) return <SimpleLoad />;
    if (events.length === 0) return <p>No events found</p>;

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
        const userId: string = id || window.usr.id;

        // get events
        const getEvents = async () => {
            const now = Date.now();
            const future = addYears(now, 1).getTime();
            const params: QueryCommandInput = {
                TableName: window.app.tableName,
                KeyConditionExpression: 'itemType = :itemType and itemId BETWEEN :itemId1 AND :itemId2',
                ExpressionAttributeValues: {
                    ":itemType": { S: "event" },
                    ":itemId1": { S: `${userId}/events/${now}` },
                    ":itemId2": { S: `${userId}/events/${future}` }
                }
            };

            const data = await window.ddb.send(new QueryCommand(params));
            setEvents(data.Items);
        }

        getEvents().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);

    return (
        <Events loading={loading} events={events} />
    )
}

export default UserEvents;
