import { useState, useEffect } from 'react';
import SimpleLoad from '../SimpleLoad';

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { addYears, setYear, getYear } from 'date-fns';
import { EventListItem } from './EventListItem';
import { GotmEvent } from './Event';
import { GroupEvent } from '../GroupEvents/GroupEvent';
import { GroupEventListItem } from '../GroupEvents/GroupEventListItem';

// for the events component, show the loading symbol if still loading,
// otherwise a list of events
function Events({loading, events}: {loading: boolean, events: (GotmEvent|GroupEvent)[] }) {
    if (loading) return <SimpleLoad />;
    if (events.length === 0) return <p>Nothing to see here. Why don't you make a new event?</p>;

    return <ul className='list-none'>
        {events.map((e, i) => {
            if (e.itemType === 'event') {
                return <EventListItem key={i} event={e} />
            } else {
                return <GroupEventListItem key={i} group={e} />
            }
        })}
    </ul>;
}

function UserEvents({id, past}: {id: string, past: boolean}) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<(GotmEvent|GroupEvent)[]>([]);


    // load user events after first render
    useEffect(() => {
        // get events from dynamo db
        const userId: string = id || window.usr.id || '';

        // get events
        const getEvents = async () => {
            let start = Date.now();
            let end = addYears(start, 1).getTime();

            // get past year if past
            if (past) {
                end = Date.now();
                start = setYear(end, getYear(end) - 1).getTime();
            }

            // get standard events first
            const command = new QueryCommand({
                TableName: window.app.tableName,
                KeyConditionExpression: 'itemType = :itemType AND itemId BETWEEN :itemId1 AND :itemId2',
                ExpressionAttributeValues: {
                    ":itemType": "event",
                    ":itemId1": `${userId}/events/${start}`,
                    ":itemId2": `${userId}/events/${end}`
                }
            });
            const data = await window.ddb.send(command);

            // then get group events
            const groupCommand = new QueryCommand({
                TableName: window.app.tableName,
                KeyConditionExpression: 'itemType = :itemType AND itemId BETWEEN :itemId1 AND :itemId2',
                ExpressionAttributeValues: {
                    ":itemType": "group-event",
                    ":itemId1": `${userId}/group-events/${start}`,
                    ":itemId2": `${userId}/group-events/${end}`
                }
            });
            const groupData = await window.ddb.send(groupCommand);

            // merge the .Items arrays from both sets of data
            const mergedEvents = [...data.Items, ...groupData.Items];
            setEvents(mergedEvents);
        }

        getEvents().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);

    return (
        <Events loading={loading} events={events} />
    )
}

export default UserEvents;
