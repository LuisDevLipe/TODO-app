import { Dispatch, SetStateAction } from "react";
interface TODOinterface {
	id: number;
	TODOCONTENT: string;
	isCompleted: boolean;
}
interface TODOComponentPropsinterface {
	TODO: TODOinterface;
	TODOS_length: number;
	idx: number;
	deleteTODO: (TODOid: TODOinterface["id"]) => void;
	editTODO: (event: React.FormEvent<HTMLFormElement>, TODO: TODOinterface) => void;
	changeCompletionState: (TODOid: TODOinterface["id"], _isCompleted: TODOinterface["isCompleted"]) => void;
}
interface EditTodoModalPropsinterface {
    TODO: TODOinterface;
    editTODO: (event: React.FormEvent<HTMLFormElement>, TODO: TODOinterface) => void;
    setOpenEditModal: Dispatch<SetStateAction<boolean>>;
}


export type {
    TODOinterface,
    TODOComponentPropsinterface,
    EditTodoModalPropsinterface
}