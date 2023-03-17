import UserEvents from "../components/UserEvents"

function Home() {
    return (
        <div className="flex flex-col items-center justify-center m-6 mt-24">
            <h1 className="font-extrabold text-6xl">Welcome Home { window.usr.name }!</h1>
            <UserEvents id={window.usr.id} />
        </div>
    )
}

export default Home;
