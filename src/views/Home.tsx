import UserEvents from "../components/UserEvents"

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
            <h3 className="font-extrabold text-2xl mt-10">Here are your upcoming events:</h3>
            <UserEvents id={window.usr.id} />
        </div>
    )
}

export default Home;
