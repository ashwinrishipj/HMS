import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Accordion, ListGroup, Modal, Badge } from 'react-bootstrap';
import { addressList, defaultMailData } from "../Appointments/HospitalList";
import "./Chat.css"
import { fetchMail, sendEmail } from "./MailOperations";

export default function Mail() {
    const [navigateMail, setnavigateMail] = useState();
    const [searchData, setsearchData] = useState("");
    const [address, setaddress] = useState(addressList);
    const [show, setShow] = useState(false);
    const [search, setsearch] = useState(false);
    const [isMailSet, setisMailSet] = useState(false);
    const [toAddress, settoAddress] = useState([]);
    const [mailSent, setmailSent] = useState(false);
    const [showA, setShowA] = useState(true);

    const [mailMessage, setmailMessage] = useState({
        to: '',
        subject: '',
        content: '',
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const toggleShowA = () => setShowA(false);

    const [mailData, setmailData] = useState([defaultMailData]);

    const body = {
        query: ` query{
            getMailData(emailId:"${localStorage.getItem("emailId")}"){
              emailId,
              inbox{
                emailId,
                date,
                subject,
                content
              },
              sent{
                emailId,
                date,
                subject,
                content
              },
              starred{
                emailId,
                date,
                subject,
                content
              },
              deleted{
                emailId,
                date,
                subject,
                content
              },
              social{
                emailId,
                date,
                subject,
                content
              },
            }
              }
              `,
    };

    useEffect(() => {
       fetchMail(body).then(response => {
            if (!response.message) {
                setmailData(response);
                setnavigateMail(0);
                localStorage.setItem("mailData", JSON.stringify(response));
            }
        }).catch(err => console.log(err));
    }, []);

    const updateSearchData = (e) => {
        e.preventDefault();

        if (e.target.value !== "") {
            setsearchData(e.target.value);
            setsearch(true);
        } else {
            setsearchData("");
            setsearch(false);
        }
    }

    const validateInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        if (name === "to") {
            setisMailSet(true);
        }

        setmailMessage({
            ...mailMessage,
            [name]: value
        })
    }

    const onEmailSelect = (data) => {
        setisMailSet(false);
        settoAddress([...toAddress, data]);
    }

    const removeMail = (toBeRemoved) => {
        if (toAddress.length === 1) {
            settoAddress([]);
        } else {
            const newAddress = toAddress.filter(email => email !== toBeRemoved);
            settoAddress([newAddress]);
        }
    }

    const sendMail = (e) => {
        e.preventDefault();
        var date = new Date().getUTCDate();

        console.log("inside sendmail");

        const send = {
            query: ` 
            mutation{
                sendMail(input:{
                  emailId:"${localStorage.getItem("emailId")}",
                  sent:[
                    {
                      emailId:"${toAddress.pop()}",
                      date:"${date}",
                      subject:"${mailMessage.subject}",
                      content:"${mailMessage.content}",
                    }
                  ]
                })
              }
                  `,
        };

        console.log("sendMail Body", send);

        sendEmail(send).then(response => {
            console.log("sent mail response:", response);

            if (response === true) {
                setmailSent(true);
                handleClose();
                fetchMail(body).then(response => {
                    if (!response.message) {
                        setmailData(response);
                        setnavigateMail(0);
                        localStorage.setItem("mailData", JSON.stringify(response));
                    }
                }).catch(err => console.log(err));
            }
        })
    }

    const mailConfirmation = () => {
        return (
            <>
                {
                    mailSent ?
                        <Modal
                            show={showA}
                            onHide={toggleShowA}
                            backdrop="static"
                            keyboard={false}
                        >

                            <Modal.Body>
                                Congratulations!!!. Mail Has been sent..
                             </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={toggleShowA}>
                                    Close
                             </Button>
                            </Modal.Footer>
                        </Modal>
                        : ""
                }
            </>
        )
    }

    const composeMail = () => {
        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Compose Mail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label className="md-2" >Email address:</Form.Label>
                                {
                                    toAddress.length !== 0 ? <>
                                        {toAddress.map((data, index) => {
                                            return <Badge variant="info" className="text-dark" key={index}>{data} <i className="fa fa-close" onClick={() => removeMail(data)}></i> </Badge>
                                        })}
                                    </> : ""
                                }
                                <Form.Control type="text" name="to" autocomplete="off" required placeholder="To: ford@domainName.com" onChange={(e) => validateInput(e)} >
                                </Form.Control>
                                {isMailSet ?
                                    <>
                                        <ListGroup style={{ listStyleType: "none" }}>
                                            {address.map((data, index) => {
                                                if (`${data}`.includes(mailMessage.to)) {
                                                    return <ListGroup.Item action variant="primary" onClick={() => onEmailSelect(`${data}`)} key={index}>
                                                        {data}
                                                    </ListGroup.Item>
                                                }
                                            })}
                                        </ListGroup>
                                    </>
                                    :
                                    ""
                                }
                                <Form.Control.Feedback type="invalid">
                                    Please choose a username.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Subject</Form.Label>
                                <Form.Control size="sm" name="subject" required type="text" placeholder="Subject: " onChange={(e) => validateInput(e)} />
                                <Form.Control.Feedback type="invalid">
                                    subject is mandatory
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Example textarea</Form.Label>
                                <Form.Control required as="textarea" onChange={(e) => validateInput(e)} name="content" rows={3} />
                            </Form.Group>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button className="ml-4" onClick={(e) => sendMail(e)} variant="primary">
                                Send Mail
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        )
    }

    const updateMail = (from, to, data) => {
        var newMailData = mailData;
        const index = newMailData[from].findIndex(x => x.id === data.id);
        if (index !== undefined) {
            newMailData[from].splice(index, 1);
            newMailData[to].push(data);
            console.log("newmailData", newMailData)
            setmailData({ ...mailData, newMailData });
        }
    }

    const displayList = (data, index, type, searchData = "") => {
        return (
            <li style={{ listStyleType: "none" }} className="mt-4 bg-info" key={index}>
                <Accordion className="mt-3">
                    <ul className="mail-data">
                        <li>
                            < >
                                {type === "starred" ? <i className="fa fa-star fa-1x arrow-down" aria-hidden="true" ></i>
                                    : <i onClick={() => updateMail(type, "starred", data)} className="fa fa-star-o fa-1x arrow-down" aria-hidden="true"></i>}
                            </>
                        </li>
                        <li>
                            icon
                        </li>
                        <li className={`${searchData === "" ? '' : 'text-warning'}`}>
                            {data.emailId}: {data.date}
                        </li>
                        <li className={`${searchData === "" ? '' : 'text-warning'}`}>
                            {data.subject}
                        </li>
                        <li className="float-right">
                            <Accordion.Toggle className="arrow-down" eventKey="0">
                                <i className="fa fa-angle-down fa-2x" aria-hidden="true"></i>
                            </Accordion.Toggle>
                        </li>
                    </ul>

                    <Accordion.Collapse eventKey="0">
                        <Card.Body className={`${searchData === "" ? '' : 'text-warning'}`}>
                            {data.content} {type !== "deleted" ? <i className="float-right fa fa-trash fa-2x arrow-down" onClick={() => updateMail(type, "deleted", data)} aria-hidden="true"></i> : ""} </Card.Body>
                    </Accordion.Collapse>
                </Accordion>
            </li>
        )
    }

    const displayData = (type) => {
        const mail = mailData[type];

        return (
            <ListGroup >
                {mail && mail.length !== (0 || null || undefined) ?
                    <>
                        {search ?
                            <>
                                {mail.map((data, index) => {
                                    if (`${data.subject}`.includes(searchData) || `${data.content}`.includes(searchData)) {
                                        return displayList(data, index, type, searchData)
                                    }
                                })}
                            </>
                            :
                            <>
                                {mail.map((data, index) => {
                                    return (displayList(data, index, type))
                                })}

                            </>}

                    </>
                    :
                    <span className="text-danger">No mail Found </span>
                }
            </ListGroup>
        )
    }

    const navigateTypeOfMail = () => {
        switch (navigateMail) {
            case 0:
                return displayData("inbox")
            case 1:
                return displayData("starred")
            case 2:
                return displayData("sent")
            case 3:
                return displayData("deleted")
            default:
                break;
        }
    }

    return (

        <>
            <div className="mt-4">
                {mailConfirmation()}
                <Card body style={{ border: '1px gray', backgroundColor: "#0d1117" }}>
                    <Row>
                        <Col sm={2}>
                            <ul>
                                <Button variant="info" style={{ borderRadius: "5px" }} size="sm" onClick={handleShow}>
                                    <i className="fa fa-plus-circle" aria-hidden="true"></i> Compose
                             </Button>{composeMail()}
                            </ul>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="text">
                                <Form.Control placeholder="search Email" type="text" onChange={(e) => updateSearchData(e)} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={2}>
                            <ul>
                                <li className={`mail-sidebar ${navigateMail === 0 ? 'active' : ''}`} onClick={() => setnavigateMail(0)}><i className="fa fa-inbox ml-1 mr-2" aria-hidden="true"></i> Inbox</li>
                                <li className={`mail-sidebar ${navigateMail === 1 ? 'active' : ''}`} onClick={() => setnavigateMail(1)}><i className="fa fa-flag ml-1 mr-2" aria-hidden="true"></i>Starred</li>
                                <li className={`mail-sidebar ${navigateMail === 2 ? 'active' : ''}`} onClick={() => setnavigateMail(2)}><i className="fa fa-paper-plane-o ml-1 mr-2" aria-hidden="true"></i>Sent</li>
                                <li className={`mail-sidebar ${navigateMail === 3 ? 'active' : ''}`} onClick={() => setnavigateMail(3)}><i className="fa fa-trash-o ml-1 mr-2" aria-hidden="true"></i>deleted</li>
                                <li className={`mail-sidebar ${navigateMail === 4 ? 'active' : ''}`} onClick={() => setnavigateMail(4)}><i className="fa fa-exclamation-circle ml-1 mr-2" aria-hidden="true"></i>Social</li>
                            </ul>
                        </Col>

                        <Col sm={10}>
                            {navigateTypeOfMail()}
                        </Col>
                    </Row>
                </Card>
            </div>
        </>
    )
}