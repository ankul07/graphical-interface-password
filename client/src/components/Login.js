import { useState } from "react";
import { checkUsername } from "../util/validation";
import { successToast, Toast } from "../util/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PasswordIcon from "./Items/PasswordIcon";
import axios from "axios";
import { Page } from "../util/config";
import { api } from "../static/config";
import { getNameByNumber } from "../util/util";
import { nanoid } from "nanoid";
import BlockedBox from "./Items/BlockedBox";
import './Login.css';

export default function Login(props) {

    const [next, setNext] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [iteration, setIteration] = useState(0);
    const [imageData, setImageData] = useState([]);
    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: "",
        pattern: ["", "", "", ""]
    });

    function handleChange(event) {
        setLoginInfo(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        });
    }

    function validateData() {
        if (loginInfo.username.length < 1) {
            Toast("Invalid Username!");
            return false;
        }
        else if (loginInfo.password.length < 8) {
            Toast("Password Length Must Be Greater Than 8");
            return false;
        }
        return true;
    }

    async function validateUsernameAndEmail() {
        const isUsernameExists = await checkUsername(loginInfo.username, props.setLoading);
        if (!isUsernameExists) Toast("Username does not exists!");
        return isUsernameExists;
    }

    async function handleNextClick(event) {
        if (validateData() && await validateUsernameAndEmail()) {
            axios.get(`${api.url}/api/image?username=${loginInfo.username}`)
                .then(res => {
                    setImageData(res.data);
                    setNext(true);
                })
                .catch(err => Toast("Internal server error"));
        }
    }

    function getIcons() {
        return imageData[iteration].map(prev => <PasswordIcon iteration={iteration} id={prev.id} key={nanoid()} src={prev.url} selected={prev.id === loginInfo.pattern[iteration]} onClick={handleImageClick} />);
    }

    function handleImageClick(id, iteration) {
        var newPattern = loginInfo.pattern;
        newPattern[iteration] = id;
        setLoginInfo(prev => {
            return {
                ...prev,
                "pattern": newPattern
            }
        });
    }

    function login() {

        if (loginInfo.pattern[iteration] === "") {
            Toast("Select an image first!");
            return;
        }

        if (iteration < 3) {
            setIteration(iteration + 1);
            return;
        }

        if (loginInfo.pattern.length < 4) {
            Toast("Chose minimum 4 images!");
            return;
        }
        props.setLoading(true);
        axios.post(`${api.url}/api/user/login`, loginInfo)
            .then(res => {
                props.setLoading(false);
                console.log(res.data);
                props.setUserInfo({ email: res.data.email, username: res.data.username });
                props.setLoggedIn(true);
                successToast("Logged In!");
                props.setPage(Page.HOME_PAGE);
            })
            .catch(err => {
                props.setLoading(false);
                setIteration(0);
                setLoginInfo(prev => {
                    return {
                        ...prev,
                        "pattern": ["", "", "", ""]
                    }
                });
                setNext(false);
                if (typeof err.response.data.status != 'undefined' && err.response.data.status === 'blocked') {
                    setBlocked(true);
                }
                else Toast(err.response.data.message);
            });
    }

    function getButtonTitle() {
        if (iteration < 3) return "Next";
        else return "Login";
    }

    function handleBackClick() {
        if (iteration === 0) setNext(false);
        else setIteration(iteration - 1);
    }

    return (
        <div className="login-container">
            {blocked && <BlockedBox onClick={setBlocked} />}

            {!next && <div className="login-form">
                <p className="login-title">Login</p>
                <p className="login-subtitle">Welcome Back! Enter Your Details Below</p>
                <div className="login-inputs">
                    <input value={loginInfo.username} onChange={handleChange} name="username" className="input" type="text" placeholder="Username" />
                    <input value={loginInfo.password} onChange={handleChange} name="password" className="input" type="password" placeholder="Password" />
                </div>
                <button onClick={handleNextClick} className="button">Next</button>
            </div>}

            {next && <div className="image-selection-container">
                <div className="image-selection">
                    {getIcons()}
                </div>
                <div className="instruction-text">
                    <p>Set Graphical Password</p>
                    <p>Select Images For Your Graphical Password.</p>
                    <p>Select <span>{getNameByNumber(iteration + 1)}</span> Image.</p>
                    <button onClick={login} className="button">{getButtonTitle()}</button><br />
                    <button onClick={handleBackClick} className="back-button">
                        <FontAwesomeIcon className="back-icon" icon={faArrowLeft} />
                    </button>
                </div>
            </div>}
        </div>
    );
}
