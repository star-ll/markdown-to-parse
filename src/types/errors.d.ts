export enum ErrorTypes {
	Parse,
	Transform,
	Generate,
}

export type ErrorType = {
	message?: string;
	loc: {
		startOffset: number;
		startRow: number;
		startCol: number;
	};
};

export interface ThrowError {
	message: string;
	errors: (ErrorType | Error)[];
	__isMdError: true;
}

export interface ErrorHandler {
	_errors: (ErrorType | Error)[];
	push: (err: ErrorType | Error) => ErrorHandler;
	isEmpty: () => boolean;
	emitError: (message: string) => never;
}
