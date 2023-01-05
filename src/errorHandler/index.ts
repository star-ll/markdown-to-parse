import {
	ErrorHandler,
	ErrorType,
	ErrorTypes,
	ThrowError,
} from "../types/errors";

export function errorHandler() {
	const _errorHandler: ErrorHandler = {
		_errors: [],
		push(err: ErrorType | Error) {
			this._errors.push(err);
			return _errorHandler;
		},
		isEmpty() {
			return this._errors.length === 0;
		},
		emitError(message: string) {
			const throwObj: ThrowError = {
				message,
				errors: this._errors,
				__isMdError: true,
			};
			throw throwObj;
		},
	};

	return _errorHandler;
}
