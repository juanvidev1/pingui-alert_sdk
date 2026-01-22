import fs from 'fs';
import path from 'path';

const logDirectory = path.join(__dirname, 'logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

export function logMessage(message: string, logType: string = 'info'): void {
  let logFilePath: string;

  if (logType === 'error') {
    logFilePath = path.join(logDirectory, 'error.log');
  } else if (logType === 'debug') {
    logFilePath = path.join(logDirectory, 'debug.log');
  } else if (logType === 'warn') {
    logFilePath = path.join(logDirectory, 'warn.log');
  } else {
    logFilePath = path.join(logDirectory, 'app.log');
  }

  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '', 'utf8');
  }

  if (!message) {
    throw new Error('Log message must be provided.');
  }

  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

export function readLogs(logName: string): string {
  if (!logName) {
    throw new Error('Log name must be provided or this log does not exist.');
  }

  const logFilePath = path.join(logDirectory, logName);
  if (fs.existsSync(logFilePath)) {
    return fs.readFileSync(logFilePath, 'utf8');
  }
  return '';
}
