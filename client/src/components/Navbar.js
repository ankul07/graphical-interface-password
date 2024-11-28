import { Page } from "../util/config";
import './Nav.css';

export default function Navbar(props) {

    const additionalClasses = "text-purple" // Change this to your CSS class for text color.

    function setPage(property) {
        props.setPage(property)
    }

    function logout() {
        props.setUserInfo({ username: "", email: "" })
        props.setLoggedIn(false)
        setPage(Page.HOME_PAGE)
    }

    return (
        <div className="main-cont">

            {/*logo and text*/}
            <div className="logo-container" onClick={() => window.location.reload()}>
                <p className="logo">GPA</p>
            </div>

            {/*nav element list*/}
            <div className="nav-links">
                <p className={`home-btn text-xl cursor-pointer ${props.currentPage === Page.HOME_PAGE ? additionalClasses : ""}`} onClick={() => setPage(Page.HOME_PAGE)}>Home</p>

                <p className={`about-us ${props.currentPage === Page.ABOUT ? additionalClasses : ""}`}>About Us</p>

                {!props.loggedIn && <div className="auth-buttons">
                    <button onClick={() => setPage(Page.LOGIN_PAGE)} className="auth-button">Login</button>
                    <button onClick={() => setPage(Page.SIGNUP_PAGE)} className="auth-button">Sign Up</button>
                </div>}

                {props.loggedIn && <div className="logged-in">
                    <p className={`user-name`}>{props.userInfo.username}</p>
                    <button onClick={() => logout()} className="auth-button">Logout</button>
                </div>}
            </div>

        </div>
    )
}
