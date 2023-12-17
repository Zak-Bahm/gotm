import {
    Formik,
    Form,
    Field,
} from 'formik';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/react-calendar.css';
import { useNavigate } from 'react-router-dom';
import { PutCommand } from "@aws-sdk/lib-dynamodb";

import { GroupEventFormType, GroupEvent } from './GroupEvent';
import { encodeEventPath } from '../../helpers/paths';

function convertFormToGroupEvent(values: GroupEventFormType): GroupEvent {
    // generate key values
    const createdTs = Date.now();
    const endTs = values.endDate;
    const itemId = `${window.usr.id}/group-events/${endTs}`;
    const ge: GroupEvent = {
        itemType: "group-event",
        itemId: itemId,
        endTs: endTs,
        name: window.usr.name ?? '',
        ownerId: window.usr.id ?? '',
        createdTs: createdTs,
        title: values.title,
        description: values.description,
        public: values.public,
        events: []
    }

    return ge;
}

async function putGroupEvent(values: GroupEventFormType): Promise<GroupEvent> {
    // setup put command
    const event: GroupEvent = convertFormToGroupEvent(values)
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: event
    });
    await window.ddb.send(command);

    return event;
}

function GroupEventForm() {
    const navigate = useNavigate();
    const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const initialValues: GroupEventFormType = { title: '', description: '', endDate: tomorrow.valueOf(), public: true };

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            const event = await putGroupEvent(values);
            const encoded = encodeEventPath(event.itemId);
            const path = encoded === false ? '/' : `/${encoded}`;

            navigate(path)
          }}
        >
        {({ setFieldValue }) => (
          <Form className="grid gap-x-8 grid-cols-1 lg:grid-cols-2 font-extrabold m-3 p-5 lg:p-10 rounded-lg shadow-dark-out overflow-x-hidden">
            <div className="grid grid-cols-1">
                <label htmlFor="title" className="font-extrabold text-3xl mb-3">What&apos;s the Group Event called?</label>
                <Field id="title" type="text" name="title" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

                <label htmlFor="description" className="font-extrabold text-3xl mb-3">What kind of Event should people make for it?</label>
                <Field id="description" component="textarea" rows="8" name="description" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>
            </div>

            <div className="grid grid-cols-1">
                <label htmlFor="endDate" className="font-extrabold text-3xl mb-3">When is it?</label>
                <Field id="endDate" type="hidden" name="endDate"/>
                <Calendar className="react-calendar-override text-xl mb-5" minDate={tomorrow} defaultValue={tomorrow} onClickDay={d => setFieldValue('endDate', d.valueOf())}/>

                <button type="submit" className='mt-12 shadow-light-in bg-gray-700 rounded-lg p-3 text-2xl font-extrabold'>Create Group Event</button>
            </div>
          </Form>
        )}
        </Formik>
    )
}

export default GroupEventForm;
