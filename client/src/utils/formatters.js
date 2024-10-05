export const formatDate = () => {};

export const formatDateWithTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Helper function to check if two dates are the same day
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Check if the date is "just now" (within the last minute)
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  if (diffInMinutes < 1) {
    return "Just now";
  }

  // Check if the date is today
  if (isSameDay(date, now)) {
    return timeFormatter.format(date); // Only show the time for today
  }

  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, yesterday)) {
    return `Yesterday ${timeFormatter.format(date)}`;
  }

  // Otherwise, format as Tue. Sep 13, 2024, 3:30PM
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
};

// Example usage:
console.log(formatDate("2024-10-04T18:19:12.858Z")); // Output depends on the current time
