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

    // persist new user data
    localStorage.setItem("user-name", values.name);
    localStorage.setItem("user-id", privateJWK.x?.slice(0, 8) || '');
    localStorage.setItem("user-key", JSON.stringify(privateJWK));
}

function NewUser() {
    const initialValues: NewUserForm = { name: '' };

    return (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
            await createUser(values);
          }}
        >
          <Form className="flex flex-col">
            <label htmlFor="name" className="font-extrabold text-3xl mb-3">What&apos;s your Name?</label>
            <Field id="name" type="text" name="name" className="border-2 border-emerald-100 rounded-lg p-3 bg-gray-800"/>

            <button type="submit" className='mt-12 border-2 border-emerald-100 rounded-lg p-3 text-2xl font-extrabold'>Register</button>
          </Form>
        </Formik>
    )
}

export default NewUser;
