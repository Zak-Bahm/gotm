import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import SimpleLoad from '../SimpleLoad';

import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GotmEvent } from '../Events/Event';
import { EventListItem } from '../Events/EventListItem';

// for the events component, show the loading symbol if still loading,
// otherwise a list of events
function Events({loading, events}: {loading: boolean, events: GotmEvent[]}) {
    if (loading) return <SimpleLoad />;
    if (events.length === 0) return <p className="m-3">No events found</p>;

    return <ul className='list-none'>
        {events.map((e, i) => {
            return <EventListItem key={i} event={e} />
        })}
    </ul>;
}

function IncludedEvents({groupId, eventQueue, setQueue}: {groupId: string, eventQueue: GotmEvent[], setQueue: Dispatch<SetStateAction<GotmEvent[]>>}) {
    const [loading, setLoading] = useState(true);
    const initEvents: GotmEvent[] = [];
    const [events, setEvents] = useState(initEvents);

    // load events after first render
    useEffect(() => {
        // get group event and then included events from dynamodb
        const getEvents = async () => {
            const groupCommand =  new GetCommand({
                TableName: window.app.tableName,
                Key: {
                    itemType: "group-event",
                    itemId: groupId
                }
            });

            // get event ids from group event obj
            const loadedEvents: GotmEvent[] = [];
            const groupData = await window.ddb.send(groupCommand);
            const eventIds = groupData.Item?.events;

            // create array of event get promises
            const eventPromises: Promise<any>[] = [];
            for (let i = 0; i < eventIds.length; i++) {
                const eventId = eventIds[i];
                const eventCommand =  new GetCommand({
                    TableName: window.app.tableName,
                    Key: {
                        itemType: "event",
                        itemId: eventId
                    }
                });

                eventPromises.push(window.ddb.send(eventCommand));
            }

            // get all events returned
            Promise.all(eventPromises).then(v => console.log(v));
        }

        getEvents().then(() => setLoading(false)).catch(e => console.error(e));
    }, []);
    useEffect(() => {
        if (eventQueue.length > 0) {
            const newEvents = [...events];
            for (let i = 0; i < eventQueue.length; i++) {
                const newEvent = eventQueue[i];
                newEvents.push(newEvent);
            }
            setQueue([]);
            setEvents(newEvents)
        }
    }, [eventQueue])

    return (
        <Events loading={loading} events={events} />
    )
}

export default IncludedEvents;
