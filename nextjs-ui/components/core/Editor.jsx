const defaultContents = `# Write your scenario here and press Run to run it!
config:
  # Replace this with your API's base URL:
  target: "https://superrepl.com"
scenarios:
  - flow:
      - get:
          url: "/"
          expect:
            statusCode: 200
      - get:
          url: "/dinosaurs"
          expect:
            # no dinosaurs expected
            statusCode: 404
`;

const Editor = () => {
  const options = {
    tabSize: 4,
    mode: 'text/yaml',
    theme: 'base16-dark',
    lineNumbers: true,
    line: true,
  };

  return <div></div>;
};

export default Editor;
