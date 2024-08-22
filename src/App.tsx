import { useEffect, useState } from "react";
import "./App.css";
import { CheckCheck, CircleDashed, Pencil, Trash } from "lucide-react";
import localforage from "localforage";
import { createPortal } from "react-dom";

interface TODOinterface {
	id: number;
	TODOCONTENT: string;
	isCompleted: boolean;
}
function App() {
	const [TODOCONTENT, setTODOCONTENT] = useState<string>("");
	const [TODOS, setTODOS] = useState<TODOinterface[]>([]);

	function createTODO(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		// console.log(e.target["todo"].value);
		// if (TODOCONTENT == "") return
		const TODO = { id: TODOS.length + 1, TODOCONTENT, isCompleted: false };
		setTODOS([...TODOS, TODO]);
		setTODOCONTENT("");

		saveTODO(TODO);
	}

	function saveTODO(TODO: TODOinterface) {
		localforage.setItem<TODOinterface>(TODO.id.toString(), TODO);
	}

	function deleteTODO(TODOid: TODOinterface["id"]) {
		setTODOS(TODOS.filter((TODO) => TODO.id !== TODOid));

		localforage.removeItem(TODOid.toString()).catch(console.error);
	}

	function editTODO(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log(event.target);
	}

	function changeCompletionState(TODOid: TODOinterface["id"], _isCompleted: TODOinterface["isCompleted"]) {
		// console.log(TODOid, _isCompleted);

		setTODOS([...TODOS.map((TODO) => (TODO.id === TODOid ? { ...TODO, isCompleted: !_isCompleted } : TODO))]);
		localforage.setItem(TODOid.toString(), {
			...TODOS.find((TODO) => TODO.id === TODOid),
			isCompleted: !_isCompleted,
		});
	}

	useEffect(() => {
		let TODOS_from_DB: TODOinterface[] = [];
		localforage
			.iterate((TODO: TODOinterface) => {
				TODOS_from_DB.push(TODO);
			})
			.then(() => setTODOS(TODOS_from_DB))
			.catch(console.error);
	}, []);

	return (
		<>
			<main className="app">
				<header>
					<h1>TODO`s</h1>
				</header>
				<form action="#" onSubmit={createTODO}>
					<textarea
						// type="text"
						name="todo"
						placeholder="Add new TODO"
						value={TODOCONTENT}
						onChange={(e) => setTODOCONTENT(e.target.value)}
					/>
					<input type="submit" value="New TODO" />
				</form>

				<section>
					{TODOS.map((TODO) => {
						return (
							<NewTodo
								key={TODO.id}
								TODO={TODO}
								TODOS_length={TODOS.length}
								deleteTODO={deleteTODO}
								editTODO={editTODO}
								changeCompletionState={changeCompletionState}
							/>
						);
					})}
				</section>
			</main>
		</>
	);
}

interface TODOComponentPropsinterface {
	TODO: TODOinterface;
	TODOS_length: number;
	deleteTODO: (TODOid: TODOinterface["id"]) => void;
	editTODO: (event: React.FormEvent<HTMLFormElement>) => void;
	changeCompletionState: (TODOid: TODOinterface["id"], _isCompleted: TODOinterface["isCompleted"]) => void;
}

function NewTodo({ TODO, deleteTODO, editTODO, changeCompletionState, TODOS_length }: TODOComponentPropsinterface) {
	const [OpenEditModal, setOpenEditModal] = useState<boolean>(false);
	return (
		<article key={TODO.id}>
			<pre>{TODO.TODOCONTENT}</pre>
			<span>
				<span>
					<p>
						{TODO.id} / {TODOS_length}
					</p>
					<span className="status">
						<span className="checkbox">
							<input
								type="button"
								name="status"
								onClick={() => changeCompletionState(TODO.id, TODO.isCompleted)}
							/>

							{TODO.isCompleted ? (
								<CheckCheck className="checkmark" />
							) : (
								<CircleDashed className="checkmark pending" />
							)}
						</span>
						<label htmlFor="status">{TODO.isCompleted ? "Task Completed" : "Task Pending"}</label>
					</span>
				</span>
				<span>
					<button className="delete" onClick={() => deleteTODO(TODO.id)}>
						<Trash />
					</button>
					<button className="edit" onClick={() => setOpenEditModal(true)}>
						<Pencil />
					</button>
				</span>
			</span>
			{OpenEditModal ? createPortal(<EditTodoModal />, document.body) : null}
		</article>
	);

	function EditTodoModal({}) {
		console.log("renderizou");
		return (
			<div className="modal-backdrop">
				<div className="overlay"></div>
				<form
					action="#"
					onSubmit={(e) => {
						editTODO(e);
					}}
				>
					<span className="actions">
						<button type="button">Cancelar</button>
					</span>

					<fieldset>
						<textarea name="editTODO" id="editTODO"></textarea>
						<input type="submit" value="Salvar Edição" />
					</fieldset>
				</form>
			</div>
		);
	}
}

export default App;
