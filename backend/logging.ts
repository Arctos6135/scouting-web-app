import * as winston from 'winston';

const { createLogger, format, transports } = winston;

export function getLogger(name: string, color?: (s: string) => string) {
	name = (color ?? (x=>x))(name.padStart(8, ' '));
	return createLogger({
		level: process.env.LOG_LEVEL ?? 'debug',
		format: format.combine(
			format.timestamp(),
			format.simple()
		),
		transports: [new transports.Console()]
	});
}
