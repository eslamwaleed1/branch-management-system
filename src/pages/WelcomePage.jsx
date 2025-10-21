import { Link } from 'react-router-dom'

export default function WelcomePage() {
    return (
        <main className="flex flex-col items-center mt-[9rem]">
            <h1 className="font-bold text-[3rem]">Dunder Mifflin</h1>
            <ul className="flex flex-col items-center gap-[10px] mt-[3rem]">
                <Link to="/home"><li className="btn-base welcome-page-li">View as VP</li></Link>
                <Link to="/salesman"><li className="btn-base welcome-page-li">View as Salesman</li></Link>
                <Link to="/login"><li className="btn-base welcome-page-li">Log In</li></Link>
                <Link to="/signup"><li className="btn-base welcome-page-li">Sign Up</li></Link>
            </ul>
        </main>
    )
}
