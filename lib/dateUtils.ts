import { FilterOption } from "@/components/ui/FilterBar"

/**
 * Generates an array of month options for filters, starting from the current month
 * and going back to a specified start date.
 * 
 * @param startYear The year the platform started (e.g., 2026)
 * @param startMonth The month (0-11) the platform started
 * @returns Array of FilterOption objects
 */
export function generateMonthOptions(startYear: number = 2026, startMonth: number = 0): FilterOption[] {
  const options: FilterOption[] = [{ label: "All Months", value: "all" }]
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const startDate = new Date(startYear, startMonth, 1)
  const currentDate = new Date(currentYear, currentMonth, 1)

  // Start from current date and go backwards until start date
  let tempDate = new Date(currentDate)
  
  while (tempDate >= startDate) {
    const value = tempDate.toISOString().slice(0, 7) // "YYYY-MM"
    const label = tempDate.toLocaleDateString("en-PK", { 
      month: "long", 
      year: "numeric" 
    })
    
    options.push({ label, value })
    
    // Move to previous month
    tempDate.setMonth(tempDate.getMonth() - 1)
    
    // Safety break to prevent infinite loops if something goes wrong with dates
    if (options.length > 100) break 
  }

  return options
}

/**
 * Formats an ISO date string into a Pakistani locale date string
 */
export const formatDatePK = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PK", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  })

/**
 * Formats an ISO date string into a Pakistani locale month string
 */
export const formatMonthPK = (iso: string) =>
  new Date(iso).toLocaleDateString("en-PK", { 
    month: "short", 
    year: "numeric" 
  })
