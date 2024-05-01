export async function caught<T>(promise: Promise<T>): Promise<string> {
  try {
    await promise;
  } catch (throwable: unknown) {
    if (Object.getPrototypeOf(throwable).name === 'Error') {
      const error: Error = throwable as Error;
      return error.message;
    }
  }
  throw new Error('Failed to assert that error was thrown.');
}
