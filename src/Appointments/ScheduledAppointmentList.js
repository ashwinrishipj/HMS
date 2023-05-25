import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Toast, Breadcrumb, Button, CardColumns, Card, Modal } from 'react-bootstrap';
import { FetchData } from '../helpers/Fetch';
import ScheduleDoctorAppointment from "./ScheduleDoctorAppointment";

function AppointmentLists() {
	const [appointmentDetails, setappointmentDetails] = useState([]);
	const [isAppointmentSet, setisAppointmentSet] = useState(false);
	const [isModifyAppointment, setisModifyAppointment] = useState(false);
	const [modifyAppointmentDetails, setmodifyAppointmentDetails] = useState();
	const [displayDoctorAppointments, setdisplayDoctorAppointments] = useState(false);

	useEffect(() => {
		var referenceId = JSON.parse(localStorage.getItem("userToken"));
		referenceId = referenceId.validateUser.userId;

		let requestBody = {
			query: `
            query{
                getAppointmentDetails(userId:"${referenceId}"){
                  userId,
                  appointments{
                    _id,
                    startDate,
                    name,
                    time,
                    title,
                    description,
                    hospital{
                      name,
                      description,
                      location,
                      phoneNumber
                    }
                    dept,
                    status
                  }
				  doctorAppointments{
					name,
					time,
					startDate,
					description
					doctorDetails{
						name
						qualification,
						experience,
						workingOn,
						description,
						contactDetails
					}
			  	 }
               }
            }
              `,
		};

		FetchData(requestBody)
			.then((Response) => {
				console.log("response", Response)
				setappointmentDetails(Response.data.getAppointmentDetails);
				setisAppointmentSet(true);
			})
			.catch((err) => console.log(err));
	}, []);

	const ModifyAppointment = (data, doctorAppointments) => {
		setisModifyAppointment(true);
		setmodifyAppointmentDetails(data);
		doctorAppointments ? setdisplayDoctorAppointments(true) : setdisplayDoctorAppointments(false);
	};

	const provinceAppointmentDetails = () => {
		return (
			<div className="row" >
				<div className="col">
					{' '}
					<h5 className="subtitle text-info">Patient Information</h5>{' '}
					<table className="table table-simple bg-dark">
						{' '}
						<tbody>
							{' '}
							<tr>
								{' '}
								<td className="text-info">Appointment Id:</td>
								<th className="text-white">
									{modifyAppointmentDetails._id}
								</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Patient Name:</td>
								<th className="text-white">
									{modifyAppointmentDetails.name}
								</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Date Of Appointment:</td>
								<th className="text-white">{modifyAppointmentDetails.startDate}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Time:</td>
								<th className="text-white">{modifyAppointmentDetails.time}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Title:</td>
								<th className="text-white">{modifyAppointmentDetails.title}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Patient Symptoms:</td>
								<th className="text-white">{modifyAppointmentDetails.description}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Department of Visit:</td>
								<th className="text-white">{modifyAppointmentDetails.dept}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Status of Appointment:</td>
								<th className="text-warning">{modifyAppointmentDetails.status}</th>{' '}
							</tr>
						</tbody>{' '}
					</table>{' '}
				</div>
				<div className="col">
					{' '}
					<h4 className="subtitle text-info">Hospial Information</h4>{' '}
					<table className="table table-simple bg-dark">
						{' '}
						<tbody>
							{' '}
							<tr>
								{' '}
								<td className="text-info">Hospital Name:</td>
								<th className="text-white">{modifyAppointmentDetails.hospital.name}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Hospital Description:</td>
								<th className="text-white">{modifyAppointmentDetails.hospital.description}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Hospital Location:</td>
								<th className="text-white">{modifyAppointmentDetails.hospital.location}</th>{' '}
							</tr>

							<tr>
								{' '}
								<td className="text-info">Hospital phoneNumber:</td>
								<th className="text-white">{modifyAppointmentDetails.hospital.phoneNumber}</th>{' '}
							</tr>
						</tbody>{' '}
					</table>{' '}
				</div>
			</div>
		)
	}

	const doctorAppointmentDetails = () =>{
		return(
			<div className="row" >
				<div className="col">
					{' '}
					<h5 className="subtitle text-info">Patient Information</h5>{' '}
					<table className="table table-simple bg-dark">
						{' '}
						<tbody>
							{' '}
							<tr>
								{' '}
								<td className="text-info">Patient Name:</td>
								<th className="text-white">
									{modifyAppointmentDetails.name}
								</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Date Of Appointment:</td>
								<th className="text-white">{modifyAppointmentDetails.startDate}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Time:</td>
								<th className="text-white">{modifyAppointmentDetails.time}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Patient Symptoms:</td>
								<th className="text-white">{modifyAppointmentDetails.description}</th>{' '}
							</tr>
							
							<tr>
								{' '}
								<td className="text-info">Status of Appointment:</td>
								<th className="text-warning">pending</th>{' '}
							</tr>
						</tbody>{' '}
					</table>{' '}
				</div>
				<div className="col">
					{' '}
					<h4 className="subtitle text-info">Doctor Information</h4>{' '}
					<table className="table table-simple bg-dark">
						{' '}
						<tbody>
							{' '}
							<tr>
								{' '}
								<td className="text-info">Name:</td>
								<th className="text-white">{modifyAppointmentDetails.doctorDetails.name} </th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Qualification:</td>
								<th className="text-white">{modifyAppointmentDetails.doctorDetails.qualification} </th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info"> Description:</td>
								<th className="text-white">{modifyAppointmentDetails.doctorDetails.description}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Hospital Location:</td>
								<th className="text-white">{modifyAppointmentDetails.doctorDetails.workingOn}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">Experience:</td>
								<th className="text-white">{modifyAppointmentDetails.doctorDetails.experience}</th>{' '}
							</tr>
							<tr>
								{' '}
								<td className="text-info">contact:</td>
								<th className="text-white">{modifyAppointmentDetails.doctorDetails.contactDetails}</th>{' '}
							</tr>
						</tbody>{' '}
					</table>{' '}
				</div>
			</div>
		)
	}

	const displayScheduledAppointments = () => {
		return (
			<Modal size="lg" show={true} onHide={() => setisModifyAppointment(false)}
				aria-labelledby="contained-modal-title-vcenter" >
				<Modal.Header closeButton >
					<Modal.Title>Modal title</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{displayDoctorAppointments ? doctorAppointmentDetails() : provinceAppointmentDetails()}
				</Modal.Body>

				<Modal.Footer >
					<Button variant="warning ml-2" onClick={() => setisModifyAppointment(false)}>close </Button>
				</Modal.Footer>
			</Modal>
		)
	}


	return (
		<>
			<Container fluid>
				<h5 className="text-primary"> Appointment Lists:</h5>
				<Row>
					<div className="col-lg-9">
						<ul className="list-unstyled scroll-auto mt-3">
							{isAppointmentSet ? (
								<CardColumns>
									{appointmentDetails.appointments.map((data, key) => {
										return (
											<Card text={"white"}
												className="mt-4 text-light rounded-border"
												onClick={() => ModifyAppointment(data, false)}
												key={key} >
												<Card.Body>
													<Card.Title>{data.name}</Card.Title>
													<Card.Text>
														{data.hospital.name}
													</Card.Text>
													<Card.Text>
														{data.hospital.phoneNumber}
													</Card.Text>
												</Card.Body>
											</Card>
										)
									})}
								</CardColumns>
							) : (
								<div>
									<Toast style={{ backgroundColor: '#17a2b8' }}>
										<Toast.Body>No appointment Booked!. please Schedule an appointment</Toast.Body>
									</Toast>
								</div>
							)}
						</ul>
						<ul className="list-unstyled scroll-auto mt-3">
							<h5 className="text-primary"> Doctor Appointments:</h5>
							{isAppointmentSet ? (
								<CardColumns>
									{appointmentDetails?.doctorAppointments?.map((data, key) => {
										return (
											<Card text={"white"}
												className="mt-4 text-light rounded-border"
												onClick={() => ModifyAppointment(data, true)}
												key={key} >
												<Card.Body>
													<Card.Title>Dr.{data.doctorDetails.name}</Card.Title>
													<Card.Text>
														Time:{data.time}
														<br />
														Date:{data.startDate}
													</Card.Text>
													<Card.Text>
														{data.doctorDetails.description}
													</Card.Text>
													<Card.Text>
														email:{data.doctorDetails.contactDetails}
													</Card.Text>
												</Card.Body>
											</Card>
										)
									})}
								</CardColumns>
							) : (
								<div>
									<Toast style={{ backgroundColor: '#17a2b8' }}>
										<Toast.Body>No appointment Booked!. please Schedule an appointment</Toast.Body>
									</Toast>
								</div>
							)}
						</ul>
					</div>
					<div className="col-lg-3">
						{isModifyAppointment ?
							<>
								{displayScheduledAppointments()}
							</>
							:

							<div>
								<Toast variant={"light"} classNAme="mt-3">
									<Toast.Body>Click on the Appointment list to view the description</Toast.Body>
								</Toast>
							</div>
						}
					</div>
				</Row>
			</Container>
		</>
	);
}
export default AppointmentLists;
