import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { decodeJwt } from 'jose';

function storeGoogleUser(credentialResponse: CredentialResponse) {
    // decode JWT response
    const jwt = credentialResponse.credential || '';
    const decodedResp = decodeJwt(jwt)

    // set global variables
    window.usr.name = decodedResp.name;
    window.usr.id = decodedResp.sub;

    // persist new user data
    localStorage.setItem("user-name", window.usr.name);
    localStorage.setItem("user-id", window.usr.id);
}

function GoogleUser({usrPresent}: {usrPresent: () => void}) {

    return (
        <div className='flex flex-col items-center justify-evenly mb-12'>
            <h3 className="font-extrabold text-3xl mb-8">I want to use an account...</h3>

            <GoogleLogin
                theme='outline'
                size='large'
                onSuccess={credentialResponse => {
                    storeGoogleUser(credentialResponse);
                    usrPresent();
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    )
}

export default GoogleUser;
