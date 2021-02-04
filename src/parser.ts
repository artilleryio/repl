import { Transform, TransformOptions, TransformCallback } from "stream";

export class Parser extends Transform {
  private codesMatch: RegExp;
  private summaryReport: RegExp;
  private inCodes: boolean;
  private isSummaryReport: boolean;
  private codes: Record<string, number>;

  constructor(opts?: TransformOptions) {
    super(opts);

    this.codesMatch = /Codes:/;
    this.summaryReport = /All virtual users finished/;
    this.inCodes = false;
    this.isSummaryReport = false;
    this.codes = {};
  }

  getResponseCodes(line: string) {
    if (!line.length) {
      this.push(
        JSON.stringify({
          codes: this.codes,
          text: "\n",
          summaryReport: this.isSummaryReport,
        })
      );

      this.inCodes = false;
      this.codes = {};
    } else {
      const [responseCode, count] = line.trim().split(": ");

      this.codes[responseCode] = parseInt(count, 10);
    }
  }

  _transform(chunk: Buffer, _: BufferEncoding, callback: TransformCallback) {
    const line = chunk.toString();

    if (this.inCodes) {
      this.getResponseCodes(line);

      if (!line.length) {
        return callback();
      }
    }

    if (line.match(this.codesMatch)) {
      this.inCodes = true;
    }

    if (line.match(this.summaryReport)) {
      this.isSummaryReport = true;
    }

    this.push(
      JSON.stringify({
        text: line.length ? `${line}\n` : line,
      })
    );

    return callback();
  }
}
