import {
    Formik,
    Form,
    Field,
} from 'formik';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/react-calendar.css';

interface EventForm {
  title: string;
  description: string;
  endDate: number;
}

function EventForm() {
    const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const initialValues: EventForm = { title: '', description: '', endDate: tomorrow.valueOf() };

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            console.log(values)
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
            <Calendar className="react-calendar-override text-xl" minDate={tomorrow} defaultValue={tomorrow} onClickDay={d => setFieldValue('endDate', d.valueOf())}/>

            <button type="submit" className='mt-12 border-2 border-emerald-100 rounded-lg p-3 text-2xl font-extrabold'>Create Event</button>
          </Form>
        )}
        </Formik>
    )
}

export default EventForm;
