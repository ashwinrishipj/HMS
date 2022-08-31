import React, { useState } from "react";
import RegisterUser from "./registerForm";
import { LoginFetchData } from "../helpers/Fetch";
import NegativeAlert from "../Alerts/NegativeAlert";
import { OverlayTrigger, Spinner } from "react-bootstrap";
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { route, FormRoute } from "../redux/actions";
import ForgetPassword from "./forgotPassword";
import { emailToolTip, passwordToolTip } from "../Alerts/emailToolTip";

function LoginForm() {
  const [emailError, setemailError] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [buttonDisabled, setbuttonDisabled] = useState(true);
  const [emailId, setemailId] = useState("");
  const [password, setpassword] = useState("");
  const [spinner, setspinner] = useState(false);
  const [alert, setalert] = useState("")
  const [emailStyle, setemailStyle] = useState({});
  const [passwordStyle, setpasswordStyle] = useState({});

  const dispatch = useDispatch();
  const formRoute = useSelector(state => state.FormRoute);

  const validateField = (e) => {
    e.preventDefault();
    let validation = e.target.value;
    let fieldName = e.target.type;

    switch (fieldName) {
      case "email":
        if (
          validation.match(
            new RegExp(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i)
          )
        ) {
          {
            (!passwordError && password !== "")
              ? setbuttonDisabled(false)
              : setbuttonDisabled(true)
          }
          setemailError(false);
          setemailId(validation);
          setemailStyle({ border: "1px solid green" });
        } else {
          setemailError(true);
          setbuttonDisabled(true);
          setemailStyle({ border: "1px solid red" });
        }
        break;

      case "password":
        if (
          validation.match(
            new RegExp(
              "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
            )
          )
        ) {
          {
            (!emailError && emailId !== "")
              ? setbuttonDisabled(false)
              : setbuttonDisabled(true)
          }

          setpasswordError(false);
          setpassword(validation);
          setpasswordStyle({ border: "1px solid green" });

        } else {
          setpasswordError(true);
          setbuttonDisabled(true);
          setpasswordStyle({ border: "1px solid red" });
        }
        break;
      default:
        break;
    }
  };


  const onSubmitSignIn = (e) => {
    e.preventDefault();
    localStorage.setItem("emailId",emailId);

    // dispatch(route("dashBoard"));

    let requestBody = {
      query: ` query{
        validateUser(input:{
          emailId:"${emailId}",password :"${password}"
        }){
          token,
          tokenExpiration,
          userId
        }
      }
      `,
    };
    
    setspinner(true);
    LoginFetchData(requestBody).then((response) => {
      {
        response == true
          ? dispatch(route("dashBoard"))
          :
          setspinner(false)
        setbuttonDisabled(false)
        response == false ? setalert("server is down!. we are working on it. Please try after a minute.") : setalert(response);
      }
    });
  }


  return (
    <div>
      <aside className="col mt-4 card-transparent">
        {formRoute === "signUp" ? <RegisterUser /> :
          <div>
            {formRoute === "resetpassword" ? <ForgetPassword /> :
              <div className="card">
                <article className="card-body">
                  <h5 className="card-title text-dark text-center">Sign in</h5>
                  <hr />
                  <section className="col negativeAlert px-0">
                    {alert.length > 0 ? (
                      <NegativeAlert
                        content={alert}
                      />
                    ) : (
                      ""
                    )}
                  </section>
                  <form>
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            {" "}
                            <i className="fa fa-envelope fa-xs"></i>{" "}
                          </span>
                        </div>
                        <input
                          style={emailStyle}
                          className="form-control shadow-none"
                          placeholder="EmailId"
                          type="email"
                          onChange={(event) => validateField(event)}
                        />
                        {emailError ?
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={emailToolTip}
                          >
                            <i style={{ color: "red" }} className="fa fa-info-circle fa-1x" variant="success" />
                          </OverlayTrigger>
                          : " "}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            {" "}
                            <i className="fa fa-key fa-xs"></i>{" "}
                          </span>
                        </div>
                        <input
                          style={passwordStyle}
                          className="form-control shadow-none"
                          placeholder="******"
                          type="password"
                          onChange={(event) => validateField(event)}
                        />
                        {passwordError ?
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={passwordToolTip}
                          >
                            <i style={{ color: "red" }} className="fa fa-info-circle " variant="success" />
                          </OverlayTrigger>
                          : " "}
                      </div>

                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                        onClick={(event) => onSubmitSignIn(event)}
                        disabled={buttonDisabled}
                      >
                        {spinner ? (
                          <>
                            Loging In...
                          <Spinner
                              animation="border"
                              size="sm"
                              role="status"
                              variant="dark"
                            />
                          </>
                        ) : (
                          <>Login</>
                        )}
                      </button>
                    </div>
                    <button className="btn btn-info btn-sm float-left" onClick={() => dispatch(FormRoute("resetpassword"))}>
                      Forgot password?
                           </button>

                    <button
                      className="btn btn-info btn-sm float-right"
                      onClick={() => dispatch(FormRoute("signUp"))}
                    >
                      Sign Up
                          </button>
                  </form>
                </article>
              </div>
            }
          </div>}
      </aside>
    </div>
  );
}
export default withRouter(LoginForm);