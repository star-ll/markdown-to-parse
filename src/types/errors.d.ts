import { Loc, ParseContext } from "./index.d";
export enum ErrorTypes {
	Parse,
	Transform,
	Generate,
}

export type ErrorType = {
	message?: string;
	loc: Loc;
};

export interface ParseError {
	error: ErrorType | Error;
	errText: string;
	context: ParseContext;
}

export interface ThrowError {
	message: string;
	errors: ParseError[];
	__isMdError: true;
}

export interface ErrorHandler {
	_errors: ParseError[];
	push: (err: ErrorType | Error, context: ParseContext) => ErrorHandler;
	isEmpty: () => boolean;
	emitError: (message: string) => never;
}
