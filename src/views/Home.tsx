import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserEvents from "../components/Events/UserEvents"
import { Link } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web';
import { faCalendarPlus, faCircleMinus, faCirclePlus, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";

import { useState } from 'react';

function Home() {
    const greetings = [
        "Welcome back ",
        "Hey there ",
        "How's it going "
    ];
    const header = greetings[Math.floor(Math.random()*greetings.length)] + window.usr.name;

    const [isOpen, setOpen] = useState(false);

    const reveal = useSpring({
        from: { opacity: 0, height: 0, y: 0 , marginTop: 0},
        to: {
            opacity: isOpen ? 1 : 0,
            height: isOpen ? 'auto' : 0,
            y: isOpen ? 20 : 0
        }
    });



    const togglePastEvents = () => {
        const newOpen = !isOpen;
        setOpen(newOpen);
    }

    return (
        <div className="m-6 container lg:mt-24 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 justify-between items-center m-1">
                <h1 className="font-extrabold text-5xl lg:text-6xl">{ header }</h1>

                <span className="m-3 lg:m-1 grid justify-items-end">
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold' onClick={window.logOut}>Log Out</button>
                </span>
            </div>

            <div className="row my-10 grid grid-cols-1 lg:grid-cols-2 justify-between items-center m-1 z-20">
                <h3 className="font-extrabold text-2xl pb-3 lg:pb-0">Here are your upcoming events:</h3>
                <div className="flex justify-end items-center">
                    <Link to="/event/new" className="me-3">
                        <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-xl font-extrabold'>
                            <FontAwesomeIcon icon={faCalendarPlus} className="me-1"/>
                            Make an Event
                        </button>
                    </Link>
                    <Link to="/event/group">
                        <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-xl font-extrabold'>
                            <FontAwesomeIcon icon={faUsersViewfinder} className="me-1"/>
                            Make a Group Event
                        </button>
                    </Link>
                </div>
            </div>

            <UserEvents id={window.usr.id ?? ''} past={false}/>

            <div className="row my-10 grid grid-cols-1 lg:grid-cols-2 justify-between items-center m-1 mb-0">
                <h3 className="font-extrabold text-2xl pb-3 lg:pb-0">View your previous events:</h3>
                <div className="grid lg:justify-items-end">
                    <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-xl font-extrabold' onClick={() => togglePastEvents()}>
                        <FontAwesomeIcon icon={isOpen ? faCircleMinus : faCirclePlus} className="me-1" />
                        {isOpen ? "Hide" : "Show"} Events
                    </button>
                </div>
            </div>

            <animated.div style={{...reveal}} className="grid mb-1">
                <UserEvents id={window.usr.id ?? ''} past={true}/>
            </animated.div>
        </div>
    )
}

export default Home;
