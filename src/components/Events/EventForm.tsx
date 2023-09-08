import {
    Formik,
    Form,
    Field,
} from 'formik';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/react-calendar.css';
import { useNavigate } from 'react-router-dom';
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";

import { EventForm, GotmEvent } from './Event';
import { encodeEventPath } from '../../helpers/paths';

function convertFormToEvent(values: EventForm): GotmEvent {
    // generate key values
    const createdTs = Date.now();
    const endTs = values.endDate;
    const itemId = `${window.usr.id}/events/${endTs}`;
    const ge: GotmEvent = {
        itemType: "event",
        itemId: itemId,
        endTs: endTs,
        name: window.usr.name,
        ownerId: window.usr.id,
        createdTs: createdTs,
        title: values.title,
        description: values.description,
        public: values.public
    }

    return ge;
}

async function putEvent(values: EventForm): Promise<GotmEvent> {
    // setup put command
    const event: GotmEvent = convertFormToEvent(values)
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: event
    });
    await window.ddb.send(command);

    return event;
}

function EventForm() {
    const navigate = useNavigate();
    const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const initialValues: EventForm = { title: '', description: '', endDate: tomorrow.valueOf(), public: false };

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            const event = await putEvent(values);
            const encoded = encodeEventPath(event.itemId);
            const path = encoded === false ? '/' : `/${encoded}`;

            navigate(path)
          }}
        >
        {({ setFieldValue }) => (
          <Form className="grid gap-x-8 grid-cols-1 lg:grid-cols-2 font-extrabold m-3 p-5 lg:p-10 rounded-lg shadow-dark-out overflow-x-hidden">
            <div className="grid grid-cols-1">
                <label htmlFor="title" className="font-extrabold text-3xl mb-3">What&apos;s the Event called?</label>
                <Field id="title" type="text" name="title" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

                <label htmlFor="description" className="font-extrabold text-3xl mb-3">What&apos;s it about?</label>
                <Field id="description" component="textarea" rows="8" name="description" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>
            </div>

            <div className="grid grid-cols-1">
                <label htmlFor="endDate" className="font-extrabold text-3xl mb-3">When is it?</label>
                <Field id="endDate" type="hidden" name="endDate"/>
                <Calendar className="react-calendar-override text-xl mb-5" minDate={tomorrow} defaultValue={tomorrow} onClickDay={d => setFieldValue('endDate', d.valueOf())}/>

                <label htmlFor="public" className="font-extrabold text-3xl mb-3 custom-checkbox items-baseline">
                    <Field id="public" type="checkbox" name="public"/>
                    This is a public event
                </label>

                <button type="submit" className='mt-12 shadow-light-in bg-gray-700 rounded-lg p-3 text-2xl font-extrabold'>Create Event</button>
            </div>
          </Form>
        )}
        </Formik>
    )
}

export default EventForm;
