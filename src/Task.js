import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serverJSON } from './config-server';

const Task = () => {
	const [task, setTask] = useState({}); //данные задачи

	const [isLoading, setIsLoading] = useState(false); //лоадер при задержке
	const [refreshTask, setRefreshTask] = useState(false); //обновление задачи

	const [isUpdating, setIsUpdating] = useState(false); //блокирование кнопки изменить
	const [editingId, setEditingId] = useState(null); //id редактироруемого дела
	const [editingTitle, setEditingTitle] = useState(''); //название редактироруемого дела
	const [isDeleting, setIsDeleting] = useState(false); //блокирование кнопки delete

	const { id } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		setIsLoading(true);

		//расскоментить для вызова сервиса https://jsonplaceholder.typicode.com/todos
		// fetch('https://jsonplaceholder.typicode.com/todos')
		fetch(`http://${serverJSON.host}:${serverJSON.port}/todos/${id}`)
			.then((loadedData) => loadedData.json())
			.then((loadedTask) => {
				setTask(loadedTask);
			})
			.catch((error) => {
				console.error('Ошибка при получении дела:', error);
				navigate('/404', { replace: true }); // переход на 404 страницу
			})
			.finally(() => setIsLoading(false));
	}, [refreshTask]); //обновить страницу после fetch

	const updateTask = () => {
		setIsUpdating(true);

		// fetch(`http://${serverJSON.host}:${serverJSON.port}/todos/${editingId}`, {
		fetch(`http://${serverJSON.host}:${serverJSON.port}/todos/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				id: editingId,
				title: editingTitle,
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('дело изменено, ответ сервера:', response);
				// setRefreshTodos(!refreshTodos); //обновить страницу
				setTask({ ...task, ...{ title: editingTitle } });
				setEditingId(null);
				setEditingTitle('');
			})
			.finally(() => setIsUpdating(false)); //создание закончено
	};

	// const deleteTodo = (id) => {
	const deleteTask = () => {
		setIsDeleting(true);
		fetch(`http://${serverJSON.host}:${serverJSON.port}/todos/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => {
				console.log('ответ сервера: ', rawResponse);
				// setRefreshTodos(!refreshTodos); //обновить страницу
				navigate('/'); // Укажите путь, на который нужно перейти
			})
			.finally(() => {
				setIsDeleting(false);
			});
	};

	const handleBack = () => {
		navigate('/'); // Укажите путь, на который нужно перейти
		// navigate(-1); // Укажите путь, на который нужно перейти
	};

	return (
		<div>
			<div>ID: {task.id} </div>
			{editingId ? (
				<div>
					<div>
						<button onClick={handleBack}>Назад</button>
						<button onClick={updateTask}>Сохранить</button>
					</div>
					<input
						type="text"
						value={editingTitle}
						onChange={({ target }) => setEditingTitle(target.value)}
					/>
				</div>
			) : (
				<div>
					<div>
						<button onClick={handleBack}>Назад</button>
						<button
							onClick={() => {
								setEditingId(task.id);
								setEditingTitle(task.title);
							}}
							disabled={isUpdating}
						>
							Изменить
						</button>
						<button onClick={() => deleteTask(task.id)} disabled={isDeleting}>
							Удалить
						</button>
					</div>
					<span>{task.title}</span>
				</div>
			)}
		</div>
	);
};

export default Task;
