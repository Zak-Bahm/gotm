import UserEvents from "../components/Events/UserEvents"
import { Link } from "react-router-dom";

function Home() {
    const greetings = [
        "Welcome back ",
        "Hey there ",
        "How's it going "
    ];
    const header = greetings[Math.floor(Math.random()*greetings.length)] + window.usr.name;

    return (
        <div className="m-6 container mt-24 mx-auto">
            <h1 className="font-extrabold text-6xl">{ header }</h1>

            <div className="row my-10 flex justify-between items-center">
                <h3 className="font-extrabold text-2xl">Here are your upcoming events:</h3>
                <Link to="/event/new">
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-2xl font-extrabold'>Make an Event</button>
                </Link>
            </div>

            <UserEvents id={window.usr.id} />
        </div>
    )
}

export default Home;
