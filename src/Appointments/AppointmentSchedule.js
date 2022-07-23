import React, { useState } from 'react';
import { Card, Row, Col, Form, Button, InputGroup, Modal, Toast, CardColumns, Nav, Accordion, ModalFooter } from 'react-bootstrap';
import { hospitalLIst, ProvinceList, doctorsList } from './HospitalList';
import ScheduleDoctorAppointment from './ScheduleDoctorAppointment';
import { SessionAppointments } from './SessionAppointments';

export default function AppointmentSchedule() {
	const [validated, setValidated] = useState(false);
	const [isSearched, setisSearched] = useState(false);
	const [hospitalList, sethospitalList] = useState({});
	const [isFormSelected, setisFormSelected] = useState(false);
	const [isProvince, setisProvince] = useState(true);
	const [isAppointmentScheduled, setisAppointmentScheduled] = useState(false);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [state, setState] = useState({
		name: '',
		startDate: '',
		time: '',
		phoneNumber: '',
		description: '',
		dept: '',
	});

	const [hospitalDetails, sethospitalDetails] = useState({
		name: '',
		phoneNumber: '',
		description: '',
		location: '',
	});

	const onInputChange = (event) => {
		const { name, value } = event.target;

		setState({
			...state,
			[name]: value,
		});
	};

	const handleForm = (e) => {
		setisSearched(true);
		var name = e.target.value;
		switch (name) {
			case 'Alberta':
				sethospitalList(hospitalLIst.Alberta);
				break;
			case 'Manitoba':
				sethospitalList(hospitalLIst.Manitoba);
				break;
			case 'BritishColumbia':
				sethospitalList(hospitalLIst.BritishColumbia);
				break;
			case 'Ontario':
				sethospitalList(hospitalLIst.Ontario);
				break;
			case 'Quebec':
				sethospitalList(hospitalLIst.Quebec);
				break;
			case 'none':
				setisSearched(false);
				setisFormSelected(false);
				break;
			default:
				break;
		}
	};

	const displayAppointmentForm = (data) => {
		setisFormSelected(true);

		sethospitalDetails({
			name: data.name,
			description: data.description,
			phoneNumber: data.phoneNumber,
			location: data.location,
		});
	};

	const sendAppointmentDetails = () => {
		var referenceId = JSON.parse(localStorage.getItem("userToken"));
		referenceId = referenceId.validateUser.userId;

		let requestBody = {
			query: `
			mutation{
				createAppointment(input:{
				  userId:"${referenceId}",
				  name:"${state.name}",
				  startDate:"${state.startDate}",
				  time:"${state.time}",
				  phoneNumber:"${state.phoneNumber}",
				  description:"${state.description}",
				  hospital:{
					name:"${hospitalDetails.name}",
					description:"${hospitalDetails.description}",
					location:"${hospitalDetails.location}",
					phoneNumber:"${hospitalDetails.phoneNumber}"
				  }
				  dept:"${state.dept}"
				})
			  }
			`,
		};

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

				if (responseJSON.data.createAppointment === true) {
					setisAppointmentScheduled(true);
					setisFormSelected(false);
				} else {
					setisAppointmentScheduled(false);
				}
			})
			.catch(err => console.error('error in fetching todo:', err));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.stopPropagation();
		} else {
			setValidated(true);
			handleShow();
		}
	};

	const departmentList = () => {
		return (
			<div>
				{isFormSelected ? (
					<div className="container" style={{ backgroundColor: 'cadetblue' }}>
						<Modal
							onHide={() => setisFormSelected(false)} show={true}
							size="lg"
							aria-labelledby="contained-modal-title-vcenter"
							centered
						>
							<Modal.Header closeButton>
								<Modal.Title id="contained-modal-title-vcenter">
									<h4 className="text-center needs-validation"> Appointment Form: </h4>
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form noValidate validated={validated} onSubmit={handleSubmit}>
									<Form.Group controlId="validationCustom01">
										<Form.Label> name:</Form.Label>
										<Form.Control
											sm={12}
											required
											type="text"
											placeholder=" name"
											name="name"
											onChange={(e) => onInputChange(e)}
										/>
										<Form.Control.Feedback>Enter your name please.</Form.Control.Feedback>
									</Form.Group>
									<Form.Group controlId="validationCustom02">
										<Form.Label>symptoms:</Form.Label>
										<Form.Control
											sm={12}
											required
											type="text"
											placeholder="Type your symtoms"
											name="description"
											onChange={(e) => onInputChange(e)}
										/>
										<Form.Control.Feedback>
											Please Enter your symptoms for priority Appointments.
										</Form.Control.Feedback>
									</Form.Group>
									<Form.Group controlId="validationCustomUsername">
										<Form.Label>Phone Number:</Form.Label>
										<InputGroup>
											<InputGroup.Prepend>
												<InputGroup.Text id="inputGroupPrepend">+1</InputGroup.Text>
											</InputGroup.Prepend>
											<Form.Control
												type="tel"
												name="phoneNumber"
												placeholder="416-967-1111"
												aria-describedby="inputGroupPrepend"
												onChange={(e) => onInputChange(e)}
												required
											/>
											<Form.Control.Feedback type="invalid">
												Please enter your phone number
											</Form.Control.Feedback>
										</InputGroup>
									</Form.Group>

									<Form.Group controlId="validationCustom03">
										<Form.Label>Date:</Form.Label>
										<Form.Control
											sm={12}
											type="date"
											name="startDate"
											min={new Date().toISOString().split('T')[0]}
											onChange={(e) => onInputChange(e)}
											placeholder="City"
											required
										/>
										<Form.Control.Feedback type="invalid">Please select a date</Form.Control.Feedback>
									</Form.Group>
									<Form.Group controlId="validationCustom04">
										{['radio'].map((type) => (
											<div key={`custom-inline-${type}`} className="mb-3">
												<Form.Label>Slot:</Form.Label>
												<br />
												<Form.Check
													custom
													inline
													label="09:00 AM"
													type={type}
													id={`custom-inline-${type}-1`}
													name="time"
													value="09:00 AM"
													onChange={(e) => onInputChange(e)}
												/>
												<Form.Check
													custom
													inline
													label="12:00 PM"
													type={type}
													id={`custom-inline-${type}-2`}
													name="time"
													value="12:00 PM"
													onChange={(e) => onInputChange(e)}
												/>
												<Form.Check
													custom
													inline
													label="3:00 PM"
													type={type}
													name="time"
													value="3:00 PM"
													onChange={(e) => onInputChange(e)}
													id={`custom-inline-${type}-3`}
												/>
											</div>
										))}
									</Form.Group>
									<Form.Group controlId="validationCustom05">
										<Form.Label>Dept of Visit</Form.Label>
										<Form.Control sm={12} as="select" name="dept" onChange={(e) => onInputChange(e)}>
											<option value="radiology">Radiology/X-ray/MRI</option>
											<option value="neurology">Neurology</option>
											<option value="gastroEntrology">GastroEntrology</option>
											<option value="Dermatology">Dermatology</option>
											<option value="Dental">Dental</option>
											<option value="General">General</option>
										</Form.Control>
										<Form.Control.Feedback type="invalid">Please select a dept</Form.Control.Feedback>
									</Form.Group>
									<Button className="mb-2" type="submit">
										Submit form
								</Button>
								</Form>
							</Modal.Body>
							<Modal.Footer>
								{/* <Button onClick={handleClose()}>Close</Button> */}
							</Modal.Footer>
						</Modal>
					</div>

				) : ("")
				}
				<div className="ml-4">
					<Form.Label className="text-primary">List of departments:</Form.Label>
					<ul className="scroll-auto mt-3">
						<Card className="rounded-border">
							<li className="media">
								<img src={require('./images/opd.png')} width="50" height="60" className="mr-3 " alt="..." />
								<div className="media-body">
									<h5 className="mt-0 mb-1">Outpatient Clinic</h5>
										An outpatient department or outpatient clinic is the part of a hospital designed for the treatment of outpatients, people with health problems who visit the hospital for diagnosis or treatment, but do not at this time require a bed or to be admitted for overnight care.
									</div>
							</li>
						</Card>
						<Card className="mt-2 rounded-border" >
							<li className="media">
								<img src={require('./images/Gastroenterology.png')} width="50" height="60" className="mr-3" alt="..." />
								<div className="media-body">
									<h5 className="mt-0 mb-1">GastroEntrology</h5>
										Gastroenterology is the branch of medicine focused on the digestive system and its disorders. Diseases affecting the gastrointestinal tract, which include the organs from mouth into anus, along the alimentary canal, are the focus of this speciality.
									 </div>
							</li>
						</Card>
						<Card className="mt-2 rounded-border" >
							<li className="media">
								<img src={require('./images/neurology.png')} width="50" height="60" className="mr-3" alt="..." />
								<div className="media-body">
									<h5 className="mt-0 mb-1">Neurology</h5>
										Neurology is a branch of medicine dealing with disorders of the nervous system. Neurology deals with the diagnosis and treatment of all categories of conditions and disease involving the central and peripheral nervous systems, including their coverings, blood vessels, and all effector tissue, such as muscle.
										</div>
							</li>
						</Card>
						<Card className="mt-2 rounded-border" >
							<li className="media">
								<img src={require('./images/ENT.png')} width="50" height="60" className="mr-3" alt="..." />
								<div className="media-body">
									<h5 className="mt-0 mb-1">ENT Department</h5>
										Otorhinolaryngology is a surgical subspecialty within medicine that deals with the surgical and medical management of conditions of the head and neck. Doctors who specialize in this area are called otorhinolaryngologists, otolaryngologists, head and neck surgeons, or ENT surgeons or physicians.
									 </div>
							</li>
						</Card>
						<Card className="mt-2 rounded-border" >
							<li className="media">
								<img src={require('./images/Onco.jpg')} width="50" height="60" className="mr-3" alt="..." />
								<div className="media-body">
									<h5 className="mt-0 mb-1">Oncology</h5>
					Oncology is a branch of medicine that deals with the prevention, diagnosis, and treatment of cancer. A medical professional who practices oncology is an oncologist. The name's etymological origin is the Greek word ὄγκος, meaning 1. "burden, volume, mass" and 2. "barb", and the Greek word λόγος, meaning "study".
					</div>
							</li>
						</Card>
					</ul>
				</div>
			</div >
		);
	}
	return (
		<>
			<div className="container-fluid mt-4">
				<div className="row">
					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>

						</Modal.Header>
						<Modal.Body>
							Are you sure to confirm Appointment. <br />
						you can't  modify appointments once submitted.
						<br />
						Only Hospitals can edit/modify/delete appointments.
					</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
						</Button>
							<Button
								variant="primary"
								onClick={() => {
									handleClose();
									sendAppointmentDetails();
								}}
							>
								confirm Appointment
						</Button>
						</Modal.Footer>
					</Modal>

					<div className="col-lg-10">
						<div>
							<Nav variant="tabs" defaultActiveKey="link-1">
								<Nav.Item>
									<Nav.Link onClick={() => setisProvince(true)} eventKey="link-1" >Province Appointments</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link onClick={() => setisProvince(false)} eventKey="link-2">Doctor Appointments</Nav.Link>
								</Nav.Item>
							</Nav>
							{/* <Nav justify variant="tabs text-white" >
								<Nav.Item>
									<Nav.Link onClick={() => setisProvince(true)} >Province Appointments</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link onClick={() => setisProvince(false)} >Doctor Appointments</Nav.Link>
								</Nav.Item>
							</Nav> */}
						</div>

						{isProvince ?
							<>
								<div>
									<Form.Group controlId="exampleForm.ControlSelect1">
										<Form.Label className="text-primary mt-4">Select Your Province</Form.Label>
										<Form.Control sm={12} as="select" onChange={(e) => handleForm(e)}>
											<option value="none">none</option>
											<option value="BritishColumbia">British Columbia</option>
											<option value="Alberta">Alberta</option>
											<option value="Manitoba">Manitoba</option>
											<option value="Ontario">Ontario</option>
											<option value="Quebec">Quebec</option>
										</Form.Control>
									</Form.Group>
									{isSearched ? (
										hospitalList.map((data, index) => {
											return (
												<Card bg={'light'} className="mt-2 text-dark " key={index}>
													<Card.Header>
														<b>
															{index + 1}: {data.name}{' '}
														</b>{' '}
													</Card.Header>
													<Card.Body>
														<Card.Text>{data.description}</Card.Text>
													</Card.Body>
													<Card.Footer>
														<Row>
															<Col>
																<b>Location:</b> {data.location}
															</Col>
															<Col md={{ span: 4, offset: 4 }}>
																<b>Phone Number:</b> {data.phoneNumber}
															</Col>
														</Row>
													</Card.Footer>
													<Button variant="info" onClick={() => displayAppointmentForm(data)}>
														Schedule Appointment
									</Button>
												</Card>
											);
										})
									) : (

										<CardColumns>
											{ProvinceList.map((data, key) => {
												return (
													<>
														<Card
															text={"white"}
															className="mt-2 text-light rounded-border"
															key={key}
														>
															<Card.Img variant="top" src={require(`./images/province/${data.image}`)} />
															<Card.Body>
																<Card.Title text={"dark"}> {data.name}</Card.Title>
																<Card.Text>
																	{data.features}
																</Card.Text>
																<Button variant="outline-warning" className="mt-2" href={data.link} target="_blank">Read More...</Button>

															</Card.Body>
														</Card>
													</>
												);
											})}
										</CardColumns>
									)}
								</div>
								<div className="row">
									{departmentList()}
								</div>
							</>
							:
							<div>
								<ScheduleDoctorAppointment />
							</div>
						}
					</div>

					<div className="col-lg-2 ">
						<Form.Label className="text-primary">Last Scheduled appointments in this session:</Form.Label>
						<SessionAppointments />
					</div>
				</div>
			</div>
		</>
	);
}
