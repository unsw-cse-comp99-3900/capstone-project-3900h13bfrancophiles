/**
 * Convert full name to initials
 * @param name full name
 */
export function getInitials(name: string) {
  const words = name.trim().split(" ", 2);
  const firstLetter = words[0]?.[0] ?? "";
  const secondLetter = words[words.length - 1]?.[0] ?? "";
  return (firstLetter + secondLetter).toUpperCase();
}
