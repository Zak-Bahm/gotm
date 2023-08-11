import {
    Formik,
    Form,
    Field,
} from 'formik';
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";

import { GiftForm, Gift } from './Gift';
import { GotmEvent } from '../Events/Event';

function convertFormToGift(values: GiftForm, eventId: string): Gift {
    // generate key values
    const createdTs = Date.now();
    const itemId = `${eventId}/gifts/${createdTs}`;
    const gift: Gift = {
        itemType: "gift",
        itemId: itemId,
        createdTs: createdTs,
        title: values.title,
        description: values.description,
        store: values.store,
        url: values.url,
        cost: values.cost,
        giverName: "",
        giverId: ""
    }

    return gift;
}

async function putGift(values: GiftForm, eventId: string): Promise<PutCommandOutput> {
    // setup put command
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: convertFormToGift(values, eventId)
    });
    const response = await window.ddb.send(command);

    return response;
}

function GiftForm({event}: {event: GotmEvent}) {
    const initialValues: GiftForm = {
        title: '',
        description: '',
        store: '',
        url: '',
        cost: 0
    };

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            await putGift(values, event.itemId);
          }}
        >
        {({ setFieldValue }) => (
          <Form className="flex flex-col font-extrabold m-5 p-10 rounded-lg shadow-dark-out">
            <label htmlFor="title" className="font-extrabold text-3xl mb-3">What&apos;s the Gift called?</label>
            <Field id="title" type="text" name="title" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800 mb-3"/>

            <label htmlFor="description" className="font-extrabold text-3xl mb-3">What is it?</label>
            <Field id="description" component="textarea" rows="8" name="description" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800 mb-3"/>

            <label htmlFor="store" className="font-extrabold text-3xl mb-3">Where can they get it?</label>
            <Field id="store" type="text" name="store" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800 mb-3"/>

            <label htmlFor="url" className="font-extrabold text-3xl mb-3">What&apos;s the link for it?</label>
            <Field id="url" type="text" name="url" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800 mb-3"/>

            <label htmlFor="cost" className="font-extrabold text-3xl mb-3">How much does it cost?</label>
            <Field id="cost" type="number" name="cost"  min="0" step="any" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800 mb-3"/>

            <button type="submit" className='mt-12 border-2 border-emerald-100 rounded-lg p-3 text-2xl font-extrabold'>Create Event</button>
          </Form>
        )}
        </Formik>
    )
}

export default GiftForm;
