import React from "react"
import { CardColumns, Card, Row, Navbar, Nav } from "react-bootstrap";
import Footer from "./Footer";
import LoginForm from "./loginform";

function Login() {
    return (
        <div className="container-fluid p-0">
            <div className="container-fluid">
                <Navbar collapseOnSelect expand="lg" fixed="top"  bg="dark" variant="dark">
                    <Navbar.Brand href="#home">HMS</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="#home">Login</Nav.Link>
                            <Nav.Link href="#about">About</Nav.Link>
                            {/* <Nav.Link href="#services">Services</Nav.Link> */}
                            <Nav.Link href="#contact">Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>

            <header className="bg-dark text-white" id="home">
                <div className="container-fluid text-center">
                    <div className="row h-100 w-100 mr-0">
                        <div className="col-sm-4 my-auto mx-auto">
                            <LoginForm />
                        </div>
                    </div>
                </div>
            </header>

            <section id="about" >
                <div className="container text-center">
                    <div className="row h-100 w-100 mr-0">
                        <div className="col my-auto">
                            <h2 >About</h2>
                            <div className="text-center">
                                <Row>
                                    <div className="col-lg-4">
                                        <div className="mt-5">
                                            <i className="fa fa-hospital-o fa-2x" style={{ color: "#f4623a" }} aria-hidden="true" focusable="false" data-prefix="fas" ></i>
                                            <h3 className="h4 mb-2">Schedule Appointments</h3>
                                            <p className="text-muted mb-0">Schdeule Apointments has never been easy!.. why are you still waiting!. Login and schedule one.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 ">
                                        <div className="mt-5">
                                            <i className="fa fa fa-list fa-2x" style={{ color: "#f4623a" }} aria-hidden="true" focusable="false" data-prefix="fas" ></i>
                                            <h3 className="h4 mb-2">View Appointments</h3>
                                            <p className="text-muted mb-0">Do you wanna see Appointment list and hospital location with their phone number. We got you see. Go to Appointment list section to acces the same.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mt-5">
                                            <i className="fa fa-tasks fa-2x" style={{ color: "#f4623a" }} aria-hidden="true" focusable="false" data-prefix="fas" ></i>
                                            <h3 className="h4 mb-2">Perform To-do Task</h3>
                                            <p className="text-muted mb-0">Edit,delete,view and search your to-do tasks to avaoid any dues.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 mx-auto ">
                                        <div className="mt-5">
                                            <i className="fa fa-calendar fa-2x" style={{ color: "#f4623a" }} aria-hidden="true" focusable="false" data-prefix="fas" ></i>
                                            <h3 className="h4 mb-2">View Events</h3>
                                            <p className="text-muted mb-0">Hanlde events with the calendar and wait. Dont forgot the check the Notes section too,to check for any notes you made.</p>
                                        </div>
                                    </div>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section id="services" className="bg-light">
                <div className="container text-center">
                    <div className="row mt-4">
                        <div className="col my-auto mt-4">
                            <h2 className="text-center mt-4">Services offered</h2>
                            <div className="mt-4">
                                <CardColumns className="mt-4 mb-4">
                                    <Card className="mt-2 rounded-border" style={{ width: '22rem' }}>
                                        <li className="media">
                                            <img src={require('../Appointments/images/opd.png')} width="50" height="60" className="mr-0 " alt="..." />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1">Outpatient Clinic</h5>
												An outpatient department or outpatient clinic is the part of a hospital designed for the treatment of outpatients, people with health problems who visit the hospital for diagnosis or treatment, but do not at this time require a bed or to be admitted for overnight care.
											</div>
                                        </li>
                                    </Card>
                                    <Card className="mt-2 rounded-border" style={{ width: '22rem' }}>
                                        <li className="media">
                                            <img src={require('../Appointments/images/Gastroenterology.png')} width="50" height="60" className="mr-0" alt="..." />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1">GastroEntrology</h5>
												Gastroenterology is the branch of medicine focused on the digestive system and its disorders. Diseases affecting the gastrointestinal tract, which include the organs from mouth into anus, along the alimentary canal, are the focus of this speciality.
							 				</div>
                                        </li>
                                    </Card>
                                    <Card className="mt-2 rounded-border" style={{ width: '22rem' }}>
                                        <li className="media">
                                            <img src={require('../Appointments/images/neurology.png')} width="50" height="60" className="mr-0" alt="..." />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1">Neurology</h5>
												Neurology is a branch of medicine dealing with disorders of the nervous system. Neurology deals with the diagnosis and treatment of all categories of conditions and disease involving the central and peripheral nervous systems, including their coverings, blood vessels, and all effector tissue, such as muscle.
												</div>
                                        </li>
                                    </Card>
                                    <Card className="mt-2 rounded-border" style={{ width: '22rem' }}>
                                        <li className="media">
                                            <img src={require('../Appointments/images/ENT.png')} width="50" height="60" className="mr-0" alt="..." />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1">ENT Department</h5>
												Otorhinolaryngology is a surgical subspecialty within medicine that deals with the surgical and medical management of conditions of the head and neck. Doctors who specialize in this area are called otorhinolaryngologists, otolaryngologists, head and neck surgeons, or ENT surgeons or physicians.
							 				</div>
                                        </li>
                                    </Card>
                                    <Card className="mt-2 rounded-border" style={{ width: '22rem' }}>
                                        <li className="media">
                                            <img src={require('../Appointments/images/Onco.jpg')} width="50" height="60" className="mr-0" alt="..." />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1">Oncology</h5>
							Oncology is a branch of medicine that deals with the prevention, diagnosis, and treatment of cancer. A medical professional who practices oncology is an oncologist.
							</div>
                                        </li>
                                    </Card>
                                    <Card className="mt-2 rounded-border" style={{ width: '22rem' }}>
                                        <li className="media">
                                            <img src={require('../Appointments/images/infection.jpg')} width="50" height="60" className="mr-0" alt="..." />
                                            <div className="media-body">
                                                <h5 className="mt-0 mb-1">Infection Control</h5>
                                                Primarily responsible for conducting surveillance of hospital-acquired infections and investigating and controlling outbreaks or infection clusters among patients and health care personnel.
                            </div>
                                        </li>
                                    </Card>
                                </CardColumns>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            <section id="contact " className="bg-dark">
                <div className="container-fluid row h-100">
                    <div className="col my-auto">
                        <h3 className="text-center text-primary">Contact</h3>
                        <div className="container">
                            <div className="mx-auto mt-4">
                                <Footer />
                            </div>
                        </div>
                        <div className="py-5  mb-0">
                            <div className="container">
                                <p className="m-0 text-center text-white">Copyright © Ashwin Rishi 2022</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Login;