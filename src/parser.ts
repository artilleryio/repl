import stream from "stream";

export class Parser extends stream.Transform {
  private codesMatch: RegExp;
  private summaryReport: RegExp;
  private inCodes: boolean;
  private isSummaryReport: boolean;
  private codes: Record<string, number>;

  constructor(opts?: stream.TransformOptions) {
    super(opts);

    this.codesMatch = /Codes:/;
    this.summaryReport = /All virtual users finished/;
    this.inCodes = false;
    this.isSummaryReport = false;
    this.codes = {};
  }

  _transform(
    chunk: Buffer,
    _: BufferEncoding,
    callback: stream.TransformCallback
  ) {
    const line = chunk.toString();

    if (this.inCodes) {
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

        return callback();
      } else {
        const [responseCode, count] = line.trim().split(": ");

        this.codes[responseCode] = parseInt(count, 10);
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
