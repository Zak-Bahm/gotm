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

async function putEvent(values: EventForm): Promise<PutCommandOutput> {
    // setup put command
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: convertFormToEvent(values)
    });
    const response = await window.ddb.send(command);

    return response;
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
            await putEvent(values);
            navigate('/')
          }}
        >
        {({ setFieldValue }) => (
          <Form className="flex flex-col font-extrabold">
            <label htmlFor="title" className="font-extrabold text-3xl mb-3">What&apos;s the Event called?</label>
            <Field id="title" type="text" name="title" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800 mb-3"/>

            <label htmlFor="description" className="font-extrabold text-3xl mb-3">What&apos;s it about?</label>
            <Field id="description" component="textarea" rows="8" name="description" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800 mb-3"/>

            <label htmlFor="endDate" className="font-extrabold text-3xl mb-3">When is it?</label>
            <Field id="endDate" type="hidden" name="endDate"/>
            <Calendar className="react-calendar-override text-xl mb-5" minDate={tomorrow} defaultValue={tomorrow} onClickDay={d => setFieldValue('endDate', d.valueOf())}/>

            <label htmlFor="public" className="font-extrabold text-3xl mb-3 custom-checkbox items-baseline">
                <Field id="public" type="checkbox" name="public"/>
                This is a public event
            </label>

            <button type="submit" className='mt-12 border-2 border-emerald-100 rounded-lg p-3 text-2xl font-extrabold'>Create Event</button>
          </Form>
        )}
        </Formik>
    )
}

export default EventForm;
