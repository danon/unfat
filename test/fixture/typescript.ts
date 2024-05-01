export function typescriptInWebpage(sourceCode: string): string {
  const tsCode = JSON.stringify(sourceCode);
  return `
    <html>
    <body>
      <script src="https://unpkg.com/typescript@latest/lib/typescript.js"></script>
      <script>eval(window.ts.transpile(${tsCode}));</script>
    </body>
    </html>
  `;
}
