import GroupEventForm from "../components/GroupEvents/GroupEventForm";
import Header from "../components/Header"
import { useSpring, animated } from '@react-spring/web'

export default function NewGroupEvent() {
    const springs = useSpring({
        from: { y: '200%' },
        to: { y: '0%' },
    });

    return (
        <header className="w-screen grid items-center justify-center">
            <animated.div style={{...springs}} className="overflow-x-hidden min-w-[70%] lg:min-w-max max-w-6xl grid gap-y-2 mt-5">
                <Header title="Your New Group Event" />

                <GroupEventForm />
            </animated.div>
        </header>
    )
}
