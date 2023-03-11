import React,{ useState } from 'react';
import { Toast, Card, Row, Col, Button } from 'react-bootstrap';

const TodoTaskDescription = (props) => {
	const [fromTask, setfromTask] = useState(props.category);

	const updateCompleted = (data) => {
		var updateTo = 'completed';
		updateData(data, updateTo);
	};

	const updateDeleted = (data) => {
		var updateTo = 'deleted';
		updateData(data, updateTo);
	};

	const validateUpdatedContent = (apiResponse) => {
		if (apiResponse.data.updateTask.length === 0 && apiResponse.data.updateTask.length !== (null || undefined)) {
			console.log('failed:', JSON.stringify(apiResponse));
		} else {
			localStorage.setItem('todoTasks', JSON.stringify(apiResponse.data.updateTask));
			props.updateTaskContent(""+fromTask);
			console.log('Success:', JSON.stringify(apiResponse));
		}
	};
	const updateData = async (data, updateTo) => {
		let userId = JSON.parse(localStorage.getItem('userToken'));
		userId = userId.validateUser.userId;

		let requestBody = {
			query: ` mutation{
                updateTask(input:{userId:"${userId}", id:"${data._id}",title:"${data.title}",content:"${data.content}",date:"${data.date}",from:"${fromTask}",updateTo:"${updateTo}"}){
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

		fetch('http://localhost:4000/graphql', {
			method: 'POST',
			body: JSON.stringify(requestBody),
			headers: {
				Accept: 'appliction/json',
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((responsedJSON) => {
				validateUpdatedContent(responsedJSON);
			})
			.catch((err) => console.log(err));
	};

	return (
		<React.Fragment>
			<Toast show={props.showA} onClose={props.toggleShowA} className="text-center ml-2">
				<Toast.Header>
					<img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
					<strong className="mr-auto"> {props.data.title}</strong>
					<small>{props.data.date}</small>
				</Toast.Header>
				<Toast.Body>{props.data.content}</Toast.Body>
				{props.category !== 'deleted' ? (
					<Card.Footer>
						<Row>
							{props.category !== 'completed' ? (
								<Col md={4}>
									{' '}
									<Button
										onClick={() => updateCompleted(props.data)}
										className="mr-auto"
										size="sm"
										variant="primary"
									>
										Complete
									</Button>
								</Col>
							) : (
								''
							)}
							<Col md={{ span: 4, offset: 4 }}>
								<Button onClick={() => updateDeleted(props.data)} className="ml-auto" variant="warning">
									delete
								</Button>
							</Col>
						</Row>
					</Card.Footer>
				) : (
					''
				)}
			</Toast>
		</React.Fragment>
	);
};

export default TodoTaskDescription;
