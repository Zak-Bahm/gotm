import { useState, useEffect } from 'react';
import SimpleLoad from './SimpleLoad';

import { QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";

// for the events component, show the loading symbol if still loading,
// otherwise a list of events
function Events({loading, events}: {loading: boolean, events: any[] }) {
    if (loading) return <SimpleLoad />;
    if (events.length === 0) return <p>No events found</p>;

    return <p>Found {events.length} events</p>;
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
            const params: QueryCommandInput = {
                TableName: window.app.tableName,
                KeyConditionExpression: 'itemType = :itemType and begins_with ( itemId, :itemId )',
                ExpressionAttributeValues: {
                    ":itemType": { S: "event" },
                    ":itemId": { S: `${userId}/events/` }
                }
            };


            const data = await window.ddb.send(new QueryCommand(params));
            setEvents(data.Items);
        }

        getEvents().then(() => setLoading(false));
    }, []);

    return (
        <Events loading={loading} events={events} />
    )
}

export default UserEvents;
