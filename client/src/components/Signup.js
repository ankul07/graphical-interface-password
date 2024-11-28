import { useEffect, useState } from "react";
import PasswordIcon from "./Items/PasswordIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import validator from "validator/es";
import axios from "axios";
import { successToast, Toast } from "../util/toast";
import { checkEmail, checkUsername } from "../util/validation";
import { Page } from "../util/config";
import { api } from "../static/config";
import { getNameByNumber } from "../util/util";
import { nanoid } from "nanoid";
import "./Signup.css";
export default function Signup(props) {
  const [next, setNext] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [imageData, setImageData] = useState([]);
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password: "",
    pattern: ["", "", "", ""],
    sets: [[]],
  });

  function handleChange(event) {
    setSignupInfo((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  }

  useEffect(
    function () {
      setSignupInfo((prev) => {
        return {
          ...prev,
          sets: imageData,
          pattern: ["", "", "", ""],
        };
      });
    },
    [imageData]
  );

  function getIcons() {
    return imageData[iteration].map((prev) => (
      <PasswordIcon
        iteration={iteration}
        id={prev.id}
        key={nanoid()}
        src={prev.url}
        selected={prev.id === signupInfo.pattern[iteration]}
        onClick={handleImageClick}
      />
    ));
  }

  function handleImageClick(id, iteration) {
    var newPattern = signupInfo.pattern;
    newPattern[iteration] = id;
    setSignupInfo((prev) => {
      return {
        ...prev,
        pattern: newPattern,
      };
    });
  }

  function createAccount() {
    if (signupInfo.pattern[iteration] === "") {
      Toast("Select an image first!");
      return;
    }

    if (iteration < 3) {
      setIteration(iteration + 1);
      return;
    }

    if (signupInfo.pattern.length < 4) {
      Toast("Chose all 4 images!");
      return;
    }
    props.setLoading(true);
    axios
      .post(`${api.url}/api/user/signup`, signupInfo)
      .then((res) => {
        props.setLoading(false);
        console.log(res.data);
        props.setUserInfo({
          email: res.data.email,
          username: res.data.username,
        });
        props.setLoggedIn(true);
        successToast("Logged In!");
        props.setPage(Page.HOME_PAGE);
      })
      .catch((err) => {
        console.log(err);
        props.setLoading(false);
        Toast(err.response.data.message);
      });
  }

  function validateData() {
    if (signupInfo.username.length < 1) {
      Toast("Invalid username!");
      return false;
    } else if (!validator.isEmail(signupInfo.email)) {
      Toast("Invalid email address!");
      return false;
    } else if (signupInfo.password.length < 8) {
      Toast("Password length should be more than 8");
      return false;
    }
    return true;
  }

  async function validateUsernameAndEmail() {
    const isEmailExist = await checkEmail(signupInfo.email, props.setLoading);
    const isUsernameExists = await checkUsername(
      signupInfo.username,
      props.setLoading
    );

    if (isUsernameExists) Toast("Username already exists!");
    else if (isEmailExist) Toast("Email already exists!");

    return !isEmailExist && !isUsernameExists;
  }

  async function handleNextClick(event) {
    if (validateData() && (await validateUsernameAndEmail())) {
      setNext(true);
    }
  }

  function searchKeyword() {
    if (keyword === "") {
      Toast("Invalid keyword!");
      return;
    }

    props.setLoading(true);
    axios
      .get(`${api.url}/api/image/search?keyword=${keyword}`)
      .then((data) => {
        props.setLoading(false);
        setImageData(data.data);
      })
      .catch((err) => {
        console.log(err);
        props.setLoading(false);
        Toast(err.response.data.message);
      });
  }

  function getButtonTitle() {
    if (iteration < 3) return "Next";
    else return "Create Account";
  }

  function handleBackClick() {
    if (iteration === 0) setNext(false);
    else setIteration(iteration - 1);
  }

  return (
    <div className="signup-container">
      {!next && (
        <div className="form-container">
          <p className="form-title">Create Account</p>
          <div className="input-container">
            <input
              value={signupInfo.username}
              onChange={handleChange}
              name="username"
              className="input-field"
              type="text"
              placeholder="Username"
            />
            <input
              value={signupInfo.email}
              onChange={handleChange}
              name="email"
              className="input-field"
              type="email"
              placeholder="Email"
            />
            <input
              value={signupInfo.password}
              onChange={handleChange}
              name="password"
              className="input-field"
              type="password"
              placeholder="Password"
            />
          </div>
          <button onClick={handleNextClick} className="next-btn">
            Next
          </button>
        </div>
      )}

      {next && (
        <div className="image-selection-container">
          {imageData.length > 0 && (
            <div className="image-grid">{getIcons()}</div>
          )}
          {imageData.length === 0 && (
            <div className="no-images">
              <p>No Images :(</p>
            </div>
          )}

          <div className="form-info">
            <p className="form-info-title">Set Graphical Password</p>
            <p className="form-info-text">Enter keyword to get images.</p>
            <p className="form-info-text select-img">
              Select{" "}
              <span className="selected-text">
                {getNameByNumber(iteration + 1)}
              </span>{" "}
              Image.
            </p>
            {iteration === 0 && (
              <div className="search-container">
                <p className="search-title">Type Keyword:</p>
                <div className="search-input-container">
                  <input
                    onChange={(event) => setKeyword(event.target.value)}
                    value={keyword}
                    placeholder="Try 'Dogs'"
                    className="search-input"
                  />
                  <button onClick={searchKeyword} className="search-btn">
                    <FontAwesomeIcon className="search-icon" icon={faSearch} />
                  </button>
                </div>
              </div>
            )}
            <button onClick={createAccount} className="submit-btn">
              {getButtonTitle()}
            </button>
            <br />
            <button onClick={handleBackClick} className="back-btn">
              <FontAwesomeIcon className="back-icon" icon={faArrowLeft} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
