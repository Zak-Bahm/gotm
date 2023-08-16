import {
  Formik,
  Form,
  Field,
} from 'formik';

interface NewUserForm {
  name: string;
}

function createUser(values: NewUserForm) {
    // set global variables
    window.usr.name = values.name;
    window.usr.id = (Math.random() * 10000000000000000000).toString();

    // persist new user data
    localStorage.setItem("user-name", window.usr.name);
    localStorage.setItem("user-id", window.usr.id);
}

function NewUser({usrPresent}: {usrPresent: () => void}) {
    const initialValues: NewUserForm = { name: '' };

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            actions.setSubmitting(false);
            createUser(values);
            usrPresent();
          }}
        >
          <Form className="flex flex-col w-100">
            <label htmlFor="name" className="font-extrabold text-3xl mb-3">I'll just use my name...</label>
            <Field id="name" type="text" name="name" className="shadow-light-in bg-gray-700 rounded-lg p-3 mb-3"/>

            <button type="submit" className='mt-5 shadow-light-in bg-gray-700 rounded-lg p-3 text-md font-extrabold'>Get Started</button>
          </Form>
        </Formik>
    )
}

export default NewUser;
