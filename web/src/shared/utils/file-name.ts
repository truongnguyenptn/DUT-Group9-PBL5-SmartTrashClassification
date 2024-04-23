export function truncateFileName(str: string, length: number) {
  if (str.length > length) {
    const lastCharacters = str.slice(
      str.lastIndexOf('.') - 3,
      str.lastIndexOf('.'),
    );

    const extension = str.substring(str.lastIndexOf('.'));

    return `${str.substring(
      0,
      Math.round(length / 2),
    )}...${lastCharacters}${extension}`;
  }

  return str;
}
