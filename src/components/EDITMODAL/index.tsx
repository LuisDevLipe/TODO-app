import { useRef, useState, useEffect } from "react";
import { EditTodoModalPropsinterface } from "../../types/types";

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

				<fieldset>
					<textarea
						name="editTODO"
						id="editTODO"
						value={TODOCONTENT}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTODOCONTENT(e.target.value)}
					></textarea>
				</fieldset>
				<span className="actions">
					<button type="button" onClick={() => setOpenEditModal(false)}>
						Cancelar
					</button>
					<input type="submit" value="Salvar Edição" />
				</span>
			</form>
		</div>
	);
}

export { EditTodoModal };
