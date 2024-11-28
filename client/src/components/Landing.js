import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttackBlock from "./Items/AttackBlock";
import './Home.css';

export default function Home() {

    function handleKnowMore() {
        const element = document.getElementById('home--2');
        if (element) element.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className="home-container">
            <div className="info-section">
                <div className="image-container">
                    <img alt="" className="image" src="https://plus.unsplash.com/premium_photo-1701981233795-2d1ecfe10419?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29tcHV0ZXIlMjBsb2NrfGVufDB8fDB8fHww" />
                </div>

                <div className="info-text">
                    <p className="main-title">Discover </p>
                    <p className="main-title">Graphical Password</p>
                    <p className="main-title">Authentication</p>
                    <p className="sub-title">A Revolutionary Approach to Enhancing </p>
                    <p className="sub-title"> <b>Security</b> and <b>User Experience</b> </p>
                    <p className="sub-title">with Graphical Passwords.</p>
                    <button onClick={handleKnowMore} className="know-more-btn">
                        <FontAwesomeIcon className="icon" icon={faChevronCircleDown} />
                        Why choose us
                    </button>
                </div>

                <div className="image-container hidden-sm">
                    <img alt="" className="hover-img" src="https://plus.unsplash.com/premium_photo-1701981233795-2d1ecfe10419?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y29tcHV0ZXIlMjBsb2NrfGVufDB8fDB8fHww" />
                </div>
            </div>

            <div id="home--2" className="attack-section">
                <div className="attack-header">
                    <p className="attack-title">Resistance To Attacks</p>
                    <p className="attack-subtitle">Our system ensures robust protection against common and advanced attack techniques.</p>
                    <div class="attack-blocks">
                        <div class="data-blocks">
                            <h3>Bruteforce</h3>
                            <p>After reaching the maximum number of attempts, the user will receive a notification via email. Further authentication through the standard URL or website will be disabled for the account. Instead, the user must use the secure link provided in the notification email. This process not only safeguards the account but also alerts legitimate users about potential unauthorized access attempts.</p>
                        </div>
                        <div class="data-blocks">
                            <h3>Shoulder Surfing</h3>
                            <p>Shoulder surfing is a social engineering tactic used to steal sensitive information like PINs, passwords, or other confidential data by observing a victim's screen or keypad. To counter this, our system incorporates a design inspired by the Phone Pattern Lock mechanism, enhancing security while maintaining ease of use and minimizing exposure to such threats.</p>
                        </div>
                        <div class="data-blocks">
                            <h3>Spyware</h3>
                            <p>Graphical password systems offer superior resistance to spyware compared to traditional text-based passwords. While key-loggers can capture keystrokes, tracking mouse movements for graphical passwords is more complex. Even if spyware records mouse activity, adversaries cannot discern which interactions correspond to the actual graphical password, adding an extra layer of security.</p>
                        </div>
                        <div class="data-blocks">
                            <h3>Phishing</h3>
                            <p>Since the adversary is led to believe that the password consists of a set of images, creating a fake page becomes nearly impossible. The adversary is unaware of the specific images used in the password, making it extremely difficult to replicate or deceive the legitimate user into entering their credentials on a fraudulent page.</p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="footer-text"><hr />
                <p>UPES Dehradun</p></div>

        </div>
    );
}
