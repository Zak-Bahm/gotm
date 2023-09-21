import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserEvents from "../components/Events/UserEvents"
import { Link } from "react-router-dom";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";

function Home() {
    const greetings = [
        "Welcome back ",
        "Hey there ",
        "How's it going "
    ];
    const header = greetings[Math.floor(Math.random()*greetings.length)] + window.usr.name;

    return (
        <div className="m-6 container lg:mt-24 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 justify-between items-center m-1">
                <h1 className="font-extrabold text-5xl lg:text-6xl">{ header }</h1>

                <span className="m-3 lg:m-1 grid justify-items-end">
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold' onClick={window.logOut}>Log Out</button>
                </span>
            </div>

            <div className="row my-10 grid grid-cols-1 lg:grid-cols-2 justify-between items-center m-1">
                <h3 className="font-extrabold text-2xl pb-3 lg:pb-0">Here are your upcoming events:</h3>
                <Link to="/event/new" className="grid lg:justify-items-end">
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-xl font-extrabold'>
                        <FontAwesomeIcon icon={faCalendarPlus} className="me-1"/>
                        Make an Event
                    </button>
                </Link>
            </div>

            <UserEvents id={window.usr.id ?? ''} />
        </div>
    )
}

export default Home;
