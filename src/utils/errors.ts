import axios from "axios";

// One place that turns any API failure into a message a rider can understand.
// Every screen should use this and never invent its own fallback text.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // The server answered, so Laravel's own message is the right one to show
    if (error.response) {
      const data = error.response.data;

      // 422 validation errors: show the first specific problem ("The password field must be at least 8 characters.")
      const firstValidationError = data?.errors
        ? (Object.values(data.errors) as string[][])[0]?.[0]
        : null;

      return (
        firstValidationError ??
        data?.message ??
        "Something went wrong. Please try again."
      );
    }

    // The server did not answer at all
    if (error.code === "ECONNABORTED") {
      return "The server took too long to answer. Please try again.";
    }
    return "Can't reach the server. Check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
}
