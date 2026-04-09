export function handleError(err: any) {
  console.error(err);

  if (err?.message) return err.message;

  return "Something went wrong. Please try again.";
}