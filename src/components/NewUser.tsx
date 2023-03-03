import {
  Formik,
  Form,
  Field,
} from 'formik';
import { generateKeyPair, exportJWK, JWK } from 'jose';

interface NewUserForm {
  name: string;
}

const KEY_ALG = 'ES384';

async function createUser(values: NewUserForm) {
    let privateJWK: JWK;

    try {
        // generate keypair
        const { privateKey } = await generateKeyPair(KEY_ALG, {
            extractable: true,
        });

        // get JWK representation of keys
        privateJWK = await exportJWK(privateKey);
    } catch (error) {
        console.error(error);
        return;
    }

    // add alg since it is required
    privateJWK.alg = KEY_ALG;

    // add user name
    privateJWK.name = values.name;

    // set global variables
    window.usr.name = values.name;
    window.usr.id = privateJWK.x?.slice(0, 8) || '';
    window.usr.key = privateJWK;

    // persist new user data
    localStorage.setItem("user-name", window.usr.name);
    localStorage.setItem("user-id", window.usr.id);
    localStorage.setItem("user-key", JSON.stringify(window.usr.key));
}

function NewUser({usrPresent}: {usrPresent: () => {}}) {
    const initialValues: NewUserForm = { name: '' };

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            await createUser(values);
            usrPresent();
          }}
        >
          <Form className="flex flex-col w-100">
            <label htmlFor="name" className="font-extrabold text-3xl mb-3">My name is...</label>
            <Field id="name" type="text" name="name" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800"/>

            <button type="submit" className='mt-12 border-2 border-emerald-100 rounded-lg p-3 text-2xl font-extrabold'>Get Started</button>
          </Form>
        </Formik>
    )
}

export default NewUser;
