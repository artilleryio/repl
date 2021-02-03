import stream from "stream";

export class Parser extends stream.Transform {
  private codesMatch: RegExp;
  private inCodes: boolean;
  private raw: string;
  private codes: Record<string, number>;

  constructor(opts?: stream.TransformOptions) {
    super(opts);

    this.codesMatch = /Codes:/;
    this.inCodes = false;
    this.raw = "";
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
            raw: `${this.raw}\n`,
            codes: this.codes,
          })
        );

        this.inCodes = false;
        this.raw = "";
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

    this.push(
      JSON.stringify({
        raw: line.length ? `${line}\n` : line,
        codes: {},
      })
    );

    return callback();
  }
}
