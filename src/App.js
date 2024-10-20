import React from 'react';
import './App.css';
import TodoList from './TodoList';
import Task from './Task';
import NotFound from './NotFound';

import { Routes, Route } from 'react-router-dom';

export function App() {
	return (
		<div>
			<Routes>
				<Route path="/" element={<TodoList />} />
				<Route path="task/:id" element={<Task />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}
