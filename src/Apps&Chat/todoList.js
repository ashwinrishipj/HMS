import React, { useState, useEffect } from 'react';
import { Nav, Modal, Card, Button, Form, Breadcrumb, ListGroup } from 'react-bootstrap';
import TodoTaskDescription from './displayToDo';

export default function TodoList() {
	const [show, setShow] = useState(false);
	const [isTaskContent, setIsTaskContent] = useState(true);
	const [taskContent, setTaskContent] = useState([]);
	const [toDoDescription, setToDoDescription] = useState({});
	const [taskCategory, setTaskCategory] = useState('tasks');
	const [toDoDescriptionVisible, setToDoDescriptionVisible] = useState(false);
	const [validated, setValidated] = useState(false);
	const [showA, setShowA] = useState(true);

	const [isSearch, setisSearch] = useState(false);
	const [searchValue, setsearchValue] = useState("");

	const toggleShowA = () => setShowA(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const validate = (apiResponse) => {
		if (apiResponse.length < 1 && apiResponse.length === (null || undefined)) {
			console.log('failed:', JSON.stringify(apiResponse));
		} else {
			localStorage.setItem('todoTasks', JSON.stringify(apiResponse));
			updateTaskContent(taskCategory);
			console.log('Success:', JSON.stringify(apiResponse));
		}
	};

	const updateTaskContent = (taskType) => {
		var updateToDo = JSON.parse(localStorage.getItem('todoTasks'));
		if (!updateToDo) {
			setIsTaskContent(false);
		} else {
			setIsTaskContent(true);
			setToDoDescriptionVisible(false);
			switch (taskType) {
				case 'tasks':
					setTaskCategory('tasks');
					setTaskContent(updateToDo.tasks);
					break;
				case 'completed':
					setTaskCategory('completed');
					setTaskContent(updateToDo.completed);
					break;
				case 'deleted':
					setTaskCategory('deleted');
					setTaskContent(updateToDo.deleted);
					break;
				default:
					break;
			}
		}
	}
	const handleTaskOnClick = (data) => {
		setToDoDescription(data);
		setToDoDescriptionVisible(true);
		setShowA(true);
	};

	const fetchToDoList = (requestBody) => {
		fetch('http://localhost:4000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				Accept: 'appliction/json',
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((responseJSON) => {
				responseJSON.data.insertTask
					? validate(responseJSON.data.insertTask)
					: validate(responseJSON.data.getTodoList);
			})
			.catch((error) => console.error('error in fetching todo:', error));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setIsTaskContent(false);

		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.stopPropagation();
			alert('enter valid details');
		} else {
			setValidated(true);
			handleShow();
			handleClose();

			let userId = JSON.parse(localStorage.getItem('userToken'));
			userId = userId.validateUser.userId;

			let requestBody = {
				query: ` 
				mutation{
					insertTask(input:{
					  userId:"${userId}",
					  title:"${toDoList.title}",
					  content:"${toDoList.content}",
					  date:"${toDoList.date}",
					}){
					  userId,
					  tasks{
						_id,
						title,
						content,
						date
					  },
					  completed{
						_id,
						title,
						content,
						date
					  },
					  deleted{
						_id,
						title,
						content,
						date
					  }
					}
				  }
				`,
			};
			fetchToDoList(requestBody);
		}
	};

	useEffect(() => {
		let userId = JSON.parse(localStorage.getItem('userToken'));
		userId = userId.validateUser.userId;

		let requestBody = {
			query: ` query{
				getTodoList(userId: "${userId}"){
				  userId,
				  tasks{
					_id
					title,
					content,
					date,
				  },
				  completed{
					_id,
					title,
					content,
					date
				  },
				  deleted{
					_id,
					 title,
					content,
					date
				  }
				}
			  }
			`,
		};

		const storedData = JSON.parse(localStorage.getItem('todoTasks'));
		if (!storedData) {
			fetchToDoList(requestBody);
			setIsTaskContent(false);
		} else {
			updateTaskContent('tasks');
		}

	}, []);

	const noTask = () => {
		return (
			<li
				className="list-group-item list-group-item-action bg-secondary disabled text-white"
				aria-disabled="true"
			>
				There are no task. Please create/add new task
				<i className="mt-2 float-right fas fa-hand-point-up"></i>
			</li>
		);
	};

	const [toDoList, settoDoList] = useState({
		title: '',
		content: '',
		date: '',
	});

	const onInputChange = (event) => {
		const { name, value } = event.target;

		settoDoList({
			...toDoList,
			[name]: value,
		});
	};

	const displayTodo = () => {
		return (
			<div className="row justify-content-center ml-1 mr-2">
				<Card>
					<Card.Header>
						<Nav fill variant="tabs" defaultActiveKey="#1" text="danger">
							<Nav.Item>
								<Nav.Link eventKey="#1" onClick={() => updateTaskContent('tasks')}>
									Active Tasks
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="#2" onClick={() => updateTaskContent('completed')}>
									Completed Tasks
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="#3" onClick={() => updateTaskContent('deleted')}>
									Deleted Tasks
								</Nav.Link>
							</Nav.Item>
						</Nav>
					</Card.Header>
					{isTaskContent ? (
						taskContent && taskContent.length !== 0 ? (
							<ul className=" list-group to_do_list_box-shadow scroll-auto">
								{taskContent.map((data, index) => {
									return (
										<li
											className="list-group-item list-group-item-action"
											key={index}
											onClick={() => handleTaskOnClick(data)}
											aria-disabled="true"
										>
											{data.content}
											<i className="mt-2 float-right fa fa-chevron-right"></i>
										</li>
									);
								})}
							</ul>
						) : (
								<>{noTask()}</>
							)
					) : (
							<>{noTask()}</>
						)}
				</Card>
			</div>
		);
	};

	const searchTasks = (e) => {
		var searchContent = e.target.value;

		if (searchContent === 0) {
			setisSearch(false);
		} else {
			setisSearch(true);
			setsearchValue(searchContent)
		}
	}

	const displayCompleteToDo = () => {
		var ToDo = JSON.parse(localStorage.getItem('todoTasks'));
		return (
			<>
				<input
					className="form-control input-wrapper"
					placeholder="Search Tasks"
					aria-label="Search"
					onChange={(e) => searchTasks(e)}
				/>
				<ListGroup>
					{isSearch ?
						<>
							Active:
								{ToDo.tasks.map((data, key) => {
							if (`${data.content}`.includes(searchValue)) {
								return (
									<ListGroup.Item variant="primary" key={key}>{data.content}</ListGroup.Item>
								)
							}
						})}
								Completed:
								{ToDo.completed.map((data, key) => {
							if (`${data.content}`.includes(searchValue)) {
								return (
									<ListGroup.Item variant="primary" key={key}>{data.content}</ListGroup.Item>
								)
							}
						})}
			   					Deleted:
								{ToDo.deleted.map((data, key) => {
							if (`${data.content}`.includes(searchValue)) {
								return (
									<ListGroup.Item variant="primary" key={key}>{data.content}</ListGroup.Item>
								)
							}
						})}
						</>
						: <>
							{ToDo !== null ?
								<>
									Active:
									{ToDo.tasks.map((data, key) => {
									return <ListGroup.Item variant="primary" key={key}>{data.content}</ListGroup.Item>
								})}
									Completed:
									{ToDo.completed.map((data, key) => {
									return <ListGroup.Item variant="warning" key={key}>{data.content}</ListGroup.Item>

								})}
			   						Deleted:
									{ToDo.deleted.map((data, key) => {
									return <ListGroup.Item variant="danger" key={key}>{data.content}</ListGroup.Item>

								})}
								</> : ""} </>}
				</ListGroup>
			</>
		)
	}
	return (
		<>
			<div className="container">
				<div className="row">
					<div className="col-md-4">
					</div>
					<div className="col-md-5 ml-4">
						<Button variant="outline-info ml-4" className="button-search" onClick={handleShow}>
							<i className="fa fa-plus-circle fa-1x" aria-hidden="true">
								{' '}
							new task{' '}
							</i>
						</Button>

						<Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered onHide={handleClose}>
							<Modal.Header closeButton>
								<Modal.Title>Add Task</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form noValidate validated={validated} onSubmit={handleSubmit}>
									<Form.Group controlId="validationCustom02">
										<Form.Label>Enter Task Title:</Form.Label>
										<Form.Control
											sm={12}
											type="text"
											placeholder="Enter Task Title"
											name="title"
											required
											onChange={(e) => onInputChange(e)}
										/>
										<Form.Control.Feedback>Please Enter Title Task</Form.Control.Feedback>
									</Form.Group>
									<Form.Group controlId="exampleForm.ControlTextarea1">
										<Form.Label>Task description</Form.Label>
										<Form.Control
											as="textarea"
											name="content"
											onChange={(e) => onInputChange(e)}
											rows={3}
										/>
									</Form.Group>
									<Form.Group controlId="validationCustom03">
										<Form.Label>Due Date:</Form.Label>
										<Form.Control
											sm={12}
											type="date"
											name="date"
											min={new Date().toISOString().split('T')[0]}
											format='dd/mm/yyyy'
											onChange={(e) => onInputChange(e)}
											placeholder="City"
											required
										/>
										<Form.Control.Feedback type="invalid">Please select a date</Form.Control.Feedback>
									</Form.Group>

									<Button variant="outline-warning" onClick={handleClose}>
										Close
								</Button>
									<Button variant="outline-primary" className="ml-2" type="submit">
										Submit
								</Button>
								</Form>
							</Modal.Body>
						</Modal>
					</div>
				</div>

				<div className="row mt-4">
					<div className="col-lg-3 col-border">
						{displayCompleteToDo()}

					</div>
					<div className="col-lg-5 mt-2 col-border" >
						{displayTodo()}
					</div>
					<div className="col-lg-4 mt-2">
						{toDoDescriptionVisible ? (
							<TodoTaskDescription
								updateTaskContent={updateTaskContent}
								category={taskCategory}
								data={toDoDescription}
								showA={showA}
								toggleShowA={toggleShowA}
							/>
						) : (
								''
							)}{' '}
					</div>
				</div>
			</div>
		</>
	);
}
