import { useEffect, useState } from "react";
import "./App.css";
import { Pencil, Trash } from "lucide-react";
import localforage from "localforage";

interface TODOinterface {
	id: number;
	TODOCONTENT: string;
}
function App() {
	const [TODOCONTENT, setTODOCONTENT] = useState<string>("");
	const [TODOS, setTODOS] = useState<TODOinterface[]>([]);

	function createTODO(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const TODO = { id: TODOS.length + 1, TODOCONTENT };
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

	function editTODO() {
		return;
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
						return <NewTodo key={TODO.id} TODO={TODO} deleteTODO={deleteTODO} editTODO={editTODO} />;
					})}
				</section>
			</main>
		</>
	);
}

interface TODOComponentPropsinterface {
	TODO: TODOinterface;
	deleteTODO: (TODOid: TODOinterface["id"]) => void;
	editTODO: (editedTODO: TODOinterface) => void;
}

function NewTodo({ TODO, deleteTODO, editTODO }: TODOComponentPropsinterface) {
	return (
		<article key={TODO.id}>
			<pre>
				<span>{TODO.id}</span>
				{TODO.TODOCONTENT}
			</pre>
			<span>
				<button className="delete" onClick={() => deleteTODO(TODO.id)}>
					<Trash />
				</button>
				<button className="delete">
					<Pencil />
				</button>
			</span>
		</article>
	);
}

export default App;
