const todos = document.querySelector(".todos_list");
const form = document.querySelector("form");
const ip = "https://mage-todo-backend.herokuapp.com/todos"

const get_todos = () => {
	return fetch(ip)
		.then(res => res.json());
}
const get_todo = (id) => {
	return fetch(`${ip}/${id}`)
		.then(res => res.json());
}
const post_todo = function (todo) {

	return fetch(ip, {
		method: "POST",
		body: JSON.stringify(todo),
		headers: {
			"Content-Type": "application/json",
			"Content-Length": `${JSON.stringify(todo).length}`
		}
	})
		.then(res => {

			return res.json();
		})
}
const patch_todo = function (todo, id) {
	return fetch(`${ip}/${id}`, {
		method: "PATCH",
		body: JSON.stringify(todo),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		}
	})
		.then(res => res.json());
}
const delete_todo = function (id) {
	return fetch(`${ip}/${id}`, {
		method: "DELETE"
	});
}

const create_todo = function (todo_doc) {
	const { content, checked, _id } = todo_doc;

	const todo = document.createElement("div");
	todo.classList.add("todos_todo");

	const todo_delete = document.createElement("div");
	todo_delete.classList.add("todo_delete");
	todo_delete.innerText = "×";

	const todo_checkbox = document.createElement("input");
	todo_checkbox.setAttribute("type", "checkbox");

	const todo_text = document.createElement("div");
	todo_text.classList.add("todo_text");
	todo_text.innerText = content;

	if (checked) {
		todo_checkbox.checked = true;
		todo.classList.toggle("text_overline");
	}

	todo_checkbox.addEventListener("change", (e) => {
		get_todo(_id)
			.then(res => patch_todo({ checked: !res.data.checked }, _id))
			.then(() => todo.classList.toggle("text_overline"))
			.catch(console.error);
	});
	todo_delete.addEventListener("click", (e) => {
		delete_todo(_id)
			.then(() => todo.remove())
			.catch(console.error);
	});

	todo.appendChild(todo_delete);
	todo.appendChild(todo_checkbox);
	todo.appendChild(todo_text);

	return todo;
}
const render_todo = (todo) => todos.prepend(todo);

const build_todo = function (todo_doc) {
	const todo = create_todo(todo_doc);
	render_todo(todo);
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const { todotext } = e.target.elements;

	const todo_doc = {
		content: todotext.value,
		checked: false,
	}

	post_todo(todo_doc)
		.then((res) => {

			const { data } = res;
			todotext.value = "";
			build_todo(data)
		})
		.catch(console.error);
});

window.addEventListener('load', (event) => {
	get_todos()
		.then((todos) => {
			const todos_wrapper = document.createDocumentFragment();

			const { data } = todos;

			for (const key in data) {
				const todo = create_todo(data[key]);
				todos_wrapper.prepend(todo);
			}

			render_todo(todos_wrapper);
		})
		.catch(console.error);
});