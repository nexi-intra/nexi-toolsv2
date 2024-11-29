import chalk from "chalk";

export interface OutputFormatter {
  log(message: string): void;
  error(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  formatOutput(): string;
}

export class ChalkFormatter implements OutputFormatter {
  private output: string[] = [];

  log(message: string): void {
    console.log(message);
    this.output.push(message);
  }

  error(message: string): void {
    console.error(chalk.red(message));
    this.output.push(`ERROR: ${message}`);
  }

  success(message: string): void {
    console.log(chalk.green(message));
    this.output.push(`SUCCESS: ${message}`);
  }

  warn(message: string): void {
    console.warn(chalk.yellow(message));
    this.output.push(`WARNING: ${message}`);
  }

  info(message: string): void {
    console.info(chalk.blue(message));
    this.output.push(`INFO: ${message}`);
  }

  formatOutput(): string {
    return this.output.join("\n");
  }
}

export class JsonFormatter implements OutputFormatter {
  private output: {
    logs: string[];
    errors: string[];
    successes: string[];
    warnings: string[];
    infos: string[];
  } = {
    logs: [],
    errors: [],
    successes: [],
    warnings: [],
    infos: [],
  };

  log(message: string): void {
    this.output.logs.push(message);
  }

  error(message: string): void {
    this.output.errors.push(message);
  }

  success(message: string): void {
    this.output.successes.push(message);
  }

  warn(message: string): void {
    this.output.warnings.push(message);
  }

  info(message: string): void {
    this.output.infos.push(message);
  }

  formatOutput(): string {
    return JSON.stringify(this.output, null, 2);
  }
}
