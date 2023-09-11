import {
    Formik,
    Form,
    Field
} from 'formik';
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { useSpring, animated } from '@react-spring/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import { GiftForm, Gift } from './Gift';
import { useState } from 'react';

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

async function putGift(values: GiftForm, eventId: string): Promise<Gift> {
    // setup put command
    const gift = convertFormToGift(values, eventId);
    const command = new PutCommand({
        TableName: window.app.tableName,
        Item: gift
    });
    await window.ddb.send(command);

    return gift;
}

function GiftForm({eventId, newGift}: {eventId: string, newGift: (g: Gift) => void}) {
    const initialValues: GiftForm = {
        title: '',
        description: '',
        store: '',
        url: '',
        cost: 0
    };

    const [isOpen, setOpen] = useState(false);

    const reveal = useSpring({
        from: { opacity: 0, height: 0, y: 0 , marginTop: 0},
        to: {
            opacity: isOpen ? 1 : 0,
            height: isOpen ? 'auto' : 0,
            y: isOpen ? 20 : 0
        }
    });

    const toggleForm = (resetForm) => {
        const newOpen = !isOpen;
        setOpen(newOpen);

        // reset form if closed
        if (newOpen === false) resetForm();
    }

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            const gift = await putGift(values, eventId);
            toggleForm(actions.resetForm)
            newGift(gift);
          }}
        >
        {({ resetForm }) => (
          <Form className="grid font-extrabold m-3 p-5 lg:p-10 rounded-lg shadow-dark-out overflow-hidden">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleForm(resetForm)}>
                <h3 className="font-extrabold text-5xl">Want to add a Gift?</h3>
                <FontAwesomeIcon icon={isOpen ? faCircleMinus : faCirclePlus} size="2xl" />
            </div>

            <animated.div style={{...reveal}} className="grid">
                <label htmlFor="title" className="font-extrabold text-3xl mb-3">What&apos;s the Gift called?</label>
                <Field id="title" type="text" name="title" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

                <label htmlFor="description" className="font-extrabold text-3xl mb-3">What is it?</label>
                <Field id="description" component="textarea" rows="8" name="description" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

                <label htmlFor="store" className="font-extrabold text-3xl mb-3">Where can they get it?</label>
                <Field id="store" type="text" name="store" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

                <label htmlFor="url" className="font-extrabold text-3xl mb-3">What&apos;s the link for it?</label>
                <Field id="url" type="text" name="url" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

                <label htmlFor="cost" className="font-extrabold text-3xl mb-3">How much does it cost?</label>
                <Field id="cost" type="number" name="cost"  min="0" step="any" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

                <button type="submit" className='mt-12 shadow-light-in bg-gray-700 rounded-lg p-3 text-2xl font-extrabold'>Add Gift</button>
            </animated.div>
          </Form>
        )}
        </Formik>
    )
}

export default GiftForm;
