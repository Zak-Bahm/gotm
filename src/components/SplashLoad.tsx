import styles from '../styles/SplashLoad.css'

function SplashLoad() {
    return (
        <div id="splash-load" className="h-screen w-screen flex flex-col justify-center items-center bg-gray-800">
            <h1 className="font-extrabold text-5xl text-emerald-400 p-3 grid grid-cols-2 md:grid-cols-4">
                <span>
                    <span className="text-emerald-100 text-8xl">G</span>ift
                </span>
                <span>
                    <span className="text-emerald-100 text-8xl">O</span>f
                </span>
                <span>
                    <span className="text-emerald-100 text-8xl">T</span>he
                </span>
                <span>
                    <span className="text-emerald-100 text-8xl">M</span>agi
                </span>
            </h1>

            <div className="mt-5 text-emerald-400">
                <blockquote className={styles.quote} cite="https://americanenglish.state.gov/files/ae/resource_files/1-the_gift_of_the_magi_0.pdf">
                    <p className="font-bold text-2xl text-emerald-100">
                        <br/>Of all who <span className="text-emerald-400">give and receive gifts</span>, such as they are the most wise.
                        <br/>Everywhere they are the wise ones.
                        <br/>They are the <span className="text-emerald-400">magi</span>
                    </p>

                    <div className={styles['lds-ellipsis']}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </blockquote>
            </div>
        </div>
    )
}

export default SplashLoad;
