import { useEffect, useState } from "react";
import localforage from "localforage";
import { TODOinterface } from "./types/types";

import { NewTodo } from "./components/TODO";
import { idGenerator } from "./util/genID";

import "./App.css";
import { Github } from "lucide-react";

function App() {
	const [TODOCONTENT, setTODOCONTENT] = useState<string>("");
	const [TODOS, setTODOS] = useState<TODOinterface[]>([]);
	const [TODOsLenght, setTODOsLenght] = useState<number>(0);

	function createTODO() {
		const TODO = { id: idGenerator(), TODOCONTENT, isCompleted: false };
		saveTODO(TODO);
		setTODOCONTENT("");
		console.log(TODOsLenght, TODO);
	}

	function saveTODO(TODO: TODOinterface) {
		localforage.setItem<TODOinterface>(TODO.id.toString(), TODO).catch((e) => {
			console.error(e);
		});
	}

	function deleteTODO(TODOid: TODOinterface["id"]) {
		localforage.removeItem(TODOid.toString()).catch((e) => {
			console.error(e);
		});
	}

	function editTODO(event: React.FormEvent<HTMLFormElement>, TODO: TODOinterface) {
		event.preventDefault();

		const TODOCONTENT: string = event.currentTarget["editTODO"].value;
		TODO.TODOCONTENT = TODOCONTENT;
		localforage.setItem(TODO.id.toString(), TODO).catch((e) => {
			console.error(e);
		});
	}
	function changeCompletionState(TODOid: TODOinterface["id"], _isCompleted: TODOinterface["isCompleted"]) {
		localforage
			.setItem(TODOid.toString(), {
				...TODOS.find((TODO) => TODO.id === TODOid),
				isCompleted: !_isCompleted,
			})
			.catch((e) => {
				console.error(e);
			});
	}

	useEffect(() => {
		let TODOS_from_DB: TODOinterface[] = [];
		localforage.length().then((length) => setTODOsLenght(length));
		localforage
			.iterate((TODO: TODOinterface) => {
				TODOS_from_DB.push(TODO);
			})
			.then(() => setTODOS(TODOS_from_DB))
			.catch((e) => {
				console.error(e);
			});
	}, [createTODO, deleteTODO, editTODO, changeCompletionState]);

	return (
		<>
			<main className="app">
				<header>
					<h1>Lista De Tarefas</h1>
					<a href="https://github.com/LuisDevLipe">my github <Github/> </a>
				</header>
				<form action="#" onSubmit={createTODO}>
					<textarea
						// type="text"
						name="todo"
						placeholder="... Levar meu cachorro para passear ..."
						value={TODOCONTENT}
						onChange={(e) => setTODOCONTENT(e.target.value)}
					/>
					<input type="submit" value="Nova Tarefa" />
				</form>

				<section>
					{TODOsLenght > 0 ? (
						TODOS.map((TODO, idx) => {
							return (
								<NewTodo
									key={TODO.id}
									TODO={TODO}
									TODOS_length={TODOsLenght}
									editTODO={editTODO}
									deleteTODO={deleteTODO}
									changeCompletionState={changeCompletionState}
									idx={idx}
								/>
							);
						})
					) : (
						<div>
							<p>Nenhuma tarefa encontrada</p>
							<p>
								Comece escrevendo algo no campo acima e clique em 'Nova Tarefa' para adicioná-lo na
								lista.
							</p>
							<p>(◕ᴥ◕ʋ)</p>
						</div>
					)}
				</section>
			</main>
		</>
	);
}

export default App;
