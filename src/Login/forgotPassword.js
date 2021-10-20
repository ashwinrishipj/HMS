import React, { useState } from "react";
import { Spinner, Modal, Form, Col, Button } from "react-bootstrap";
import NegativeAlert from "../Alerts/NegativeAlert";
import { useDispatch } from "react-redux";
import { FormRoute } from "../redux/actions";

function ForgetPassword() {

    const [error, seterror] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [alert, setalert] = useState(false)
    const [buttonDisabled, setbuttonDisabled] = useState(true);
    const [emailId, setemailId] = useState("");
    const [OTPSent, setOTPSent] = useState(false);
    const [verficationCode, setverficationCode] = useState();
    const [OTPVerified, setOTPVerified] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();

    const unsetAlert = () => {
        seterror("");
        setalert(false);
        setbuttonDisabled(false);
    }

    const forgotPasswordForm = () => {
        return (
            <>
                <Modal show={show} onHide={handleClose} style={{ backgroundColor: "#27293d" }}>
                    <Form>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                    </Form>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                  </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                  </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    const validateEmail = () => {
        setbuttonDisabled(true);
        setSpinner(true);

        if (OTPSent) {
            let requestBody = {
                query: `query{s
                        resetPassword(input:{
                        emailId:'${emailId}',
                        verfication:'${verficationCode}'
                      })
                    } `,
            }

            fetch('https://hms-server.herokuapp.com/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    Accept: 'appliction/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((responseJSON) => {
                    setSpinner(false);
                    if (responseJSON.data.resetPassword) {
                        setOTPVerified(true)
                        handleShow();
                    }
                    else {
                        setOTPVerified(false)
                    }
                })
                .catch((error) => console.error('error in fetching todo:', error));


        } else {
            let requestBody = {
                query: `
                query{
                    resetPassword(input:{
                    emailId:"${emailId}"
                  })
                }
                `,
            }

            fetch('https://hms-server.herokuapp.com/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    Accept: 'appliction/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((responseJSON) => {
                    setSpinner(false);
                    responseJSON.data.resetPassword
                        ? setOTPSent(true)
                        : setOTPSent(false)
                })
                .catch((error) => console.error('error in fetching todo:', error));
        }
    }

    const validateField = (event) => {
        var field = event.target.name;
        if (field === "emailId") {
            if (event.target.value.match(new RegExp(/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i))) {
                unsetAlert("");
                setemailId(event.target.value);
            }
            else {
                seterror("please enter valid EmailId");
                setalert(true);
            }
        } else {
            if (event.target.value.length > 5) {
                unsetAlert("");
                setverficationCode(event.target.value);
            }
        }
    }

    return (
        <div>
            {show ? forgotPasswordForm() : ""}
            <div className="card">
                <article className="card-body">
                    <h5 className="card-title text-dark text-center">forgotPassword</h5>
                    <hr />
                    <section className="col negativeAlert px-0">
                        {alert ? (
                            <NegativeAlert
                                content={error}
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
                                    className="form-control shadow-none"
                                    placeholder="EmailId"
                                    type="email"
                                    name="emailId"
                                    onChange={(e) => validateField(e)}
                                />
                            </div>
                        </div>
                        {OTPSent ?
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                            {" "}
                                            <i className="fa fa-key fa-xs"></i>{" "}
                                        </span>
                                    </div>
                                    <input
                                        className="form-control shadow-none"
                                        placeholder="Enter OTP Here"
                                        type="number"
                                        name="otp"
                                        onChange={(e) => validateField(e)}
                                    />
                                </div>
                            </div>
                            : " "}
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-success btn-block"
                                onClick={() => validateEmail()}
                                disabled={buttonDisabled}
                            >
                                {spinner ? (
                                    <>
                                        Validating...
                                    <Spinner
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            variant="dark"
                                        />
                                    </>
                                ) : (
                                        <>Submit</>
                                    )}
                            </button>
                        </div>
                        <button className="btn btn-info btn-sm float-left" onClick={() => dispatch(FormRoute("login"))} >
                            Sign In
                     </button>

                        <button
                            className="btn btn-info btn-sm float-right" onClick={() => dispatch(FormRoute("signUp"))}>
                            Sign Up
                    </button>
                    </form>
                </article>
            </div>
        </div>
    );
}

export default ForgetPassword;