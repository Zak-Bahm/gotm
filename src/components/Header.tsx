import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Header({title}: {title: string}) {
    return (
    <div className="flex justify-between items-center m-3 p-5 rounded-lg shadow-dark-out ">
        <h3 className="font-extrabold text-5xl">{ title }</h3>

        <Link to='/'>
            <button className='shadow-light-in bg-gray-700 rounded-lg p-3 text-base font-extrabold'>
                <FontAwesomeIcon icon={faHouse} className='me-1' />
                Go Home
            </button>
        </Link>
    </div>
    )
}

export default Header;
