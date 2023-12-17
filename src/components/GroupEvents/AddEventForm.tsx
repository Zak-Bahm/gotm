import {
    Formik,
    Form,
    Field
} from 'formik';
import { GetCommand, PutCommand, PutCommandOutput, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { addYears, setYear, getYear } from 'date-fns';

import { useEffect, useState } from 'react';
import { GotmEvent } from '../Events/Event';
import { GroupEvent } from './GroupEvent';

async function putEvent(event: GotmEvent | false, groupId: string): Promise<any[]> {
    // get current group event
    const getGroup = new GetCommand({
        TableName: window.app.tableName,
        Key: {
            itemType: "group-event",
            itemId: groupId
        }
    });
    const groupData = await window.ddb.send(getGroup);

    // check if we need to update
    if (typeof groupData.Item == 'undefined' || (event !== false && groupData.Item.events.includes(event.itemId))) {
        return []
    }

    // remove any events that are owned by the current user
    const removedEvents: string[] = [];
    const group: GroupEvent = groupData.Item;
    const newEvents: string[] = group.events.filter((id) => {
        // check if event id starts with user id
        const userOwned = new RegExp(`^${window.usr.id}`).test(id)
        if (userOwned) {
            removedEvents.push(id);
        }

        return userOwned === false
    });
    if (event !== false) newEvents.push(event.itemId);

    // Create promises for async requests
    const requests: Promise<any>[] = [];

    // add update group promise
    const updateGroup = new UpdateCommand({
        TableName: window.app.tableName,
        Key: {
            itemType: "group-event",
            itemId: groupId,
        },
        UpdateExpression: "set events = :eventList",
        ExpressionAttributeValues: {
            ":eventList": newEvents,
        },
    });
    requests.push(window.ddb.send(updateGroup))

    // add updates for events to remove
    for (let i = 0; i < removedEvents.length; i++) {
        const re = removedEvents[i];

        const unlinkEvent = new UpdateCommand({
            TableName: window.app.tableName,
            Key: {
                itemType: "event",
                itemId: re,
            },
            UpdateExpression: "set groupEventId = :groupId",
            ExpressionAttributeValues: {
                ":groupId": '',
            },
        });
        requests.push(window.ddb.send(unlinkEvent))
    }

    // then add the update for the event itself if we are replacing
    if (event !== false) {
        const updateEvent = new UpdateCommand({
            TableName: window.app.tableName,
            Key: {
                itemType: "event",
                itemId: event.itemId,
            },
            UpdateExpression: "set groupEventId = :groupId",
            ExpressionAttributeValues: {
                ":groupId": group.itemId,
            },
        });
        requests.push(window.ddb.send(updateEvent))
    }

    return Promise.all(requests);
}

function AddEventForm({groupId, setEvent}: {groupId: string, setEvent: (e: GotmEvent) => void}) {
    const initialValues = {
        event: ''
    };
    const [events, setEvents] = useState<GotmEvent[]>([]);

    // load user events after first render
    useEffect(() => {
        // get events from dynamo db
        const userId: string = window.usr.id || '';

        // get events
        const getEvents = async () => {
            let start = Date.now();
            let end = addYears(start, 1).getTime();

            // get standard events
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

            setEvents(data.Items || []);
        }

        getEvents().catch(e => console.error(e));
    }, []);

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            const event: GotmEvent = JSON.parse(values.event);
            const update = await putEvent(event, groupId).catch(e => console.error(e));

            setEvent(event);
          }}
        >
        {({ values, handleBlur, handleChange }) => (
          <Form className="grid font-extrabold p-5 lg:p-10 rounded-lg shadow-dark-out overflow-hidden">
            <label htmlFor="event" className="font-extrabold text-3xl mb-3">Connect an event to this group:</label>
            <Field id="event" component="select" name="event" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3">
                <option value="" label="Select an event" key={0}>
                    Select an event
                </option>
                {events.map((e, i) => {
                    return <option value={JSON.stringify(e)} label={e.title} key={i + 1}>
                        { e.title }
                    </option>
                })}
            </Field>


            <button type="submit" className='mt-12 shadow-light-in bg-gray-700 rounded-lg p-3 text-2xl font-extrabold'>Connect Event</button>
          </Form>
        )}
        </Formik>
    )
}

export { AddEventForm, putEvent };
