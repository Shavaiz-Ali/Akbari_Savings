import { ZodError } from 'zod'

/**
 * Converts a ZodError into a flat { field: message } record
 * compatible with our API error response shape.
 */
export function zodFieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (key !== undefined) {
      fields[String(key)] = issue.message
    }
  }
  return fields
}
