import NewUser from "../components/NewUser"

function Register({usrPresent}: {usrPresent: () => void}) {
    const componentClasses = "w-[80%] max-w-[500px] min-w-fit m-5";

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-evenly">
            <div className={componentClasses}>
                <h1 className="font-extrabold text-6xl">Welcome to GOTM</h1>
                <h3 className="text-3xl mt-6">To start we'll need to know who you are.</h3>
            </div>
            <div className={componentClasses}>
                <NewUser usrPresent={usrPresent}/>
            </div>
        </div>
    )
}

export default Register;
