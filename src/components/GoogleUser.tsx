import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { decodeJwt } from 'jose';

function storeGoogleUser(credentialResponse: CredentialResponse) {
    // decode JWT response
    const jwt = credentialResponse.credential || '';
    const decodedResp = decodeJwt(jwt)

    // set global variables
    window.usr.name = decodedResp.name;
    window.usr.id = decodedResp.sub;
    window.usr.key = decodedResp;

    // persist new user data
    localStorage.setItem("user-name", window.usr.name);
    localStorage.setItem("user-id", window.usr.id);
    localStorage.setItem("user-key", JSON.stringify(window.usr.key));
}

function GoogleUser({usrPresent}: {usrPresent: () => void}) {

    return (
        <div className='flex flex-col items-center justify-evenly'>
            <h3 className="font-extrabold text-3xl mb-5">I want to make an account...</h3>

            <GoogleLogin
                theme="filled_blue"
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
