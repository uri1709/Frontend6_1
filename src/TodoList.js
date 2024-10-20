import React, { useEffect, useState, useRef } from 'react';
import './TodoList.css'; // Добавим стили отдельно
import { serverJSON } from './config-server';
import { NavLink, useNavigate } from 'react-router-dom';

const updateViewTodos = (isSortedTodos, search, todos, setViewTodos) => {
	const filteredTodos =
		search === ''
			? todos
			: todos.filter((todo) =>
					todo.title.toLowerCase().includes(search.toLowerCase()),
				);

	const sortedTodos = isSortedTodos
		? [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title))
		: filteredTodos;
	setViewTodos(sortedTodos);
};

// const maxId = (todos) => {
// 	const maxNumber = Math.max(...todos.map((todo) => Number(todo.id)), 0) + 1;
// 	const str = '00000' + maxNumber;
// 	return str.slice(-5);
// };

const TodoList = () => {
	const [todos, setTodos] = useState([]); //список дел получаемый при загрузке
	const [viewTodos, setViewTodos] = useState([]); //список представленных дел с учетом фильтра и сортировки

	const [isLoading, setIsLoading] = useState(false); //лоадер при задержке
	const [refreshTodos, setRefreshTodos] = useState(false); //обновление списка дел

	const [isCreating, setIsCreating] = useState(false); //блокирование кнопки add
	const [newTodo, setNewTodo] = useState(''); //инпут для добавление дела

	const [search, setSearch] = useState(''); //строка поиска

	const [isSortedTodos, setIsSortedTodos] = useState(false); //сортировка

	useEffect(() => {
		setIsLoading(true);

		//mock loading
		// new Promise((resolve) => {
		// 	setTimeout(() => {
		// 		resolve({ json: () => PRODUCTS_MOCK });
		// 	}, 2500);
		// })

		// fetch('https://jsonplaceholder.typicode.com/todos') //--вызова сервиса https://jsonplaceholder.typicode.com/todos
		fetch(`http://${serverJSON.host}:${serverJSON.port}/todos`) //++json-server
			.then((loadedData) => loadedData.json())
			.then((loadedTodos) => {
				setTodos(loadedTodos);
				updateViewTodos(isSortedTodos, search, loadedTodos, setViewTodos);
			})
			.finally(() => setIsLoading(false));
	}, [refreshTodos]); //обновить страницу после fetch

	const addTodo = () => {
		setIsCreating(true); //создание нового

		fetch(`http://${serverJSON.host}:${serverJSON.port}/todos`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				//если не указывать id, то json-server сгенерирует сам id
				// id: maxId(todos),
				title: newTodo,
				completed: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log('дело добавлено, ответ сервера:', response);
				setRefreshTodos(!refreshTodos); //обновить страницу
				setNewTodo('');
			})
			.finally(() => setIsCreating(false)); //создание закончено
	};

	const toggleSort = () => {
		setIsSortedTodos(!isSortedTodos);
		updateViewTodos(!isSortedTodos, search, todos, setViewTodos);
	};

	return (
		<div className="todo-list">
			<h1>Список Дел</h1>
			<div>
				<input
					type="text"
					value={search}
					onChange={({ target }) => {
						setSearch(target.value);
						updateViewTodos(isSortedTodos, target.value, todos, setViewTodos);
					}}
					placeholder="Поиск дела"
				/>
				<button onClick={toggleSort}>
					{isSortedTodos ? 'Снять сортировку' : 'Сортировать по алфавиту'}
				</button>
			</div>
			<div>
				<input
					type="text"
					placeholder="Добавить дело"
					value={newTodo}
					onChange={({ target }) => setNewTodo(target.value)}
				/>
				<button onClick={addTodo} disabled={isCreating || newTodo === ''}>
					Добавить
				</button>
			</div>

			{isLoading ? (
				<div className="loader"></div> // Лоадер
			) : (
				<ul>
					{viewTodos.map((todo) => (
						<li key={todo.id} className={todo.completed ? 'completed' : ''}>
							{
								<div>
									<NavLink to={`task/${todo.id}`}>
										{todo.title.length > 20
											? `${todo.title.substring(0, 50)}...`
											: todo.title}
									</NavLink>
								</div>
							}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TodoList;
