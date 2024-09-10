import { CheckCheck, CircleDashed, Trash, Pencil } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { TODOComponentPropsinterface } from "../../types/types";
import { EditTodoModal } from "../EDITMODAL";

function NewTodo({
	TODO,
	deleteTODO,
	editTODO,
	changeCompletionState,
	TODOS_length,
	idx,
}: TODOComponentPropsinterface) {
	const [OpenEditModal, setOpenEditModal] = useState<boolean>(false);

	return (
		<article key={TODO.id} tabIndex={0}>
			<pre>{TODO.TODOCONTENT}</pre>
			<span>
				<span>
					<p>
						{idx + 1} / {TODOS_length}
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
}

export { NewTodo };
