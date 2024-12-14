export async function register() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Instrumentation disabled if not in production");
    return null;
  }
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node");
  }
}
