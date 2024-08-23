import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
		saveTODO(TODO);
		setTODOS([...TODOS, TODO]);
		setTODOCONTENT("");
	}

	function saveTODO(TODO: TODOinterface) {
		localforage.setItem<TODOinterface>(TODO.id.toString(), TODO).catch((e) => {
			throw new Error(e);
		});
	}

	function deleteTODO(TODOid: TODOinterface["id"]) {
		localforage.removeItem(TODOid.toString()).catch((e) => {
			throw new Error(e);
		});
		setTODOS(TODOS.filter((TODO) => TODO.id !== TODOid));
	}

	function editTODO(event: React.FormEvent<HTMLFormElement>, TODO: TODOinterface) {
		event.preventDefault();

		const TODOCONTENT = event.currentTarget["editTODO"].value;
		localforage
			.setItem(TODO.id.toString(), {
				...TODOS.find((TODO) => TODO.id === TODO.id),
				TODOCONTENT,
			})
			.catch((e) => {
				throw new Error(e);
			});
		setTODOS([...TODOS.map((_TODO) => (_TODO.id === TODO.id ? { ..._TODO, TODOCONTENT } : _TODO))]);
	}

	function changeCompletionState(TODOid: TODOinterface["id"], _isCompleted: TODOinterface["isCompleted"]) {
		// console.log(TODOid, _isCompleted);

		localforage
			.setItem(TODOid.toString(), {
				...TODOS.find((TODO) => TODO.id === TODOid),
				isCompleted: !_isCompleted,
			})
			.catch((e) => {
				throw new Error(e);
			});
		setTODOS([...TODOS.map((TODO) => (TODO.id === TODOid ? { ...TODO, isCompleted: !_isCompleted } : TODO))]);
	}

	useEffect(() => {
		let TODOS_from_DB: TODOinterface[] = [];
		localforage
			.iterate((TODO: TODOinterface) => {
				TODOS_from_DB.push(TODO);
			})
			.then(() => setTODOS(TODOS_from_DB))
			.catch((e) => {
				throw new Error(e);
			});
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
								editTODO={editTODO}
								deleteTODO={deleteTODO}
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
	editTODO: (event: React.FormEvent<HTMLFormElement>, TODO: TODOinterface) => void;
	changeCompletionState: (TODOid: TODOinterface["id"], _isCompleted: TODOinterface["isCompleted"]) => void;
}

function NewTodo({ TODO, deleteTODO, editTODO, changeCompletionState, TODOS_length }: TODOComponentPropsinterface) {
	const [OpenEditModal, setOpenEditModal] = useState<boolean>(false);

	return (
		<article key={TODO.id} tabIndex={0}>
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
			{OpenEditModal
				? createPortal(
						<EditTodoModal editTODO={editTODO} TODO={TODO} setOpenEditModal={setOpenEditModal} />,
						document.body
				  )
				: null}
		</article>
	);
	interface EditTodoModalPropsinterface {
		TODO: TODOinterface;
		editTODO: (event: React.FormEvent<HTMLFormElement>, TODO: TODOinterface) => void;
		setOpenEditModal: Dispatch<SetStateAction<boolean>>;
	}

	function EditTodoModal({ TODO, editTODO, setOpenEditModal }: EditTodoModalPropsinterface) {
		const modalRef = useRef<HTMLDivElement>(null);
		const [TODOCONTENT, setTODOCONTENT] = useState<string>(TODO.TODOCONTENT);

		useEffect(() => {
			modalRef.current?.focus();
		}, []);
		return (
			<div
				tabIndex={1}
				ref={modalRef}
				className="modal-backdrop"
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						console.log("escape");
						setOpenEditModal(false);
					}
				}}
			>
				<div className="overlay" onClick={() => setOpenEditModal(false)}></div>
				<form
					action="#"
					onSubmit={(e) => {
						editTODO(e, TODO);
						setOpenEditModal(false);
					}}
				>
					<span className="actions">
						<button type="button" onClick={() => setOpenEditModal(false)}>
							Cancelar
						</button>
					</span>

					<fieldset>
						<textarea
							name="editTODO"
							id="editTODO"
							value={TODOCONTENT}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTODOCONTENT(e.target.value)}
						></textarea>
						<input type="submit" value="Salvar Edição" />
					</fieldset>
				</form>
			</div>
		);
	}
}

export default App;
