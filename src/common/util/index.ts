export const generateRandomString = (length = 20): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return Array.from({ length })
    .map(() => {
      const randomIndex = Math.floor(Math.random() * chars.length);
      return chars[randomIndex];
    })
    .join('');
};

/**
 * JSON을 Query String으로 변환한다.
 * Key와 Value 모두 URL에서 사용할 수 있도록 인코딩하되, null 또는 undefined인 값은 무시한다.
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  return Object.keys(obj)
    .filter((key) => obj[key] != null)
    .map((key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        return value
          .map(
            (val, index) =>
              `${encodeURIComponent(key)}[${index}]=${encodeURIComponent(val)}`,
          )
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
};
