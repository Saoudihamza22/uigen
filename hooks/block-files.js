async function main() {
  const chunks = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  const filePath =
    toolArgs.tool_input?.file_path ||
    toolArgs.tool_input?.path ||
    "";

  // 🔒 Bloquer fichiers sensibles
  if (
    filePath.includes(".env") ||
    filePath.includes("prisma/schema.prisma")
  ) {
    console.error("⛔ Access denied: sensitive file");
    process.exit(2);
  }

  // ✅ Autoriser le reste
  process.exit(0);
}

main();