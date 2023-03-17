import {
    Formik,
    Form,
    Field,
} from 'formik';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/react-calendar.css';
import { useNavigate } from 'react-router-dom';
import { PutItemCommand, PutItemCommandInput, PutItemCommandOutput, PutItemInput } from "@aws-sdk/client-dynamodb";

interface EventForm {
  title: string;
  description: string;
  endDate: number;
  public: boolean;
}

function convertEventToDDB(values: EventForm): PutItemInput["Item"] {
    // generate key values
    const createdTs = Date.now();
    const itemId = `${window.usr.id}/events/${createdTs}`;
    const endTs = values.endDate.toString();
    const input: PutItemInput["Item"] = {
        itemType: { S: "event" },
        itemId: { S: itemId },
        endTs: { N: endTs },
        name: { S: window.usr.name },
        ownerId: { S: window.usr.id },
        createdTs: { N: createdTs.toString() },
        title: { S: values.title },
        description: { S: values.description },
        public: { BOOL: values.public }
    }

    return input;
}

async function putEvent(values: EventForm): Promise<PutItemCommandOutput> {
    // setup put command
    const input: PutItemCommandInput = {
        TableName: window.app.tableName,
        Item: convertEventToDDB(values)
    }
    const command = new PutItemCommand(input);
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
