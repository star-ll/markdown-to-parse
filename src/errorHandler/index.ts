import { Loc, ParseContext } from "../types";
import { ErrorHandler, ErrorType, ThrowError } from "../types/errors";

function parseErrorPosition(originalSource: string, loc: Loc) {
	const { startOffset, endOffset } = loc;
	const startRow =
		originalSource.slice(0, startOffset).match(/\n/g)?.length || 0;
	const endRow = originalSource.slice(0, endOffset).match(/\n/g)?.length || 0;

	return {
		startRow,
		endRow,
	};
}

export function errorHandler() {
	const _errorHandler: ErrorHandler = {
		_errors: [],
		push(err: ErrorType | Error, context: ParseContext) {
			const errText = context.originalSource.slice(
				context.loc.startOffset,
				context.loc.endOffset
			);
			const { startRow, endRow } = parseErrorPosition(
				context.originalSource,
				context.loc
			);
			context.loc.startRow = startRow;
			context.loc.endRow = endRow;
			this._errors.push({ error: err, context, errText });
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

		escapeLoop() {
			return {
				warn: 0,
				temp: undefined,
				async compare(source: string) {
					if (this.temp !== source) {
						this.temp = source;
						this.warn = 0;
					} else {
						this.warn++;
					}

					if (this.warn >= 3) {
						return Promise.reject("陷入死循环");
					}
					return ''
				},
			};
		},
	};

	return _errorHandler;
}
