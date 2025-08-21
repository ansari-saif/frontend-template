export type TodoCreate = {
	title: string;
	description?: string | null;
	is_completed?: boolean;
};



export type TodoRead = {
	id: number;
	title: string;
	description?: string | null;
	is_completed: boolean;
};



export type TodoUpdateSchema = {
	title?: string | null;
	description?: string | null;
	is_completed?: boolean | null;
};



export type ValidationError = {
	loc: Array<string | number>;
	msg: string;
	type: string;
};



export type PatientCreate = {
	name: string;
	age: number;
	gender: string;
	contact_information: string;
};



export type PatientRead = {
	id: number;
	name: string;
	age: number;
	gender: string;
	contact_information: string;
};



export type PatientUpdate = {
	name?: string;
	age?: number;
	gender?: string;
	contact_information?: string;
};

