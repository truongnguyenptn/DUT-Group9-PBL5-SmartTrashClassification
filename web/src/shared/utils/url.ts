import { normalizeText } from './tool';
import { regexPattern } from './validation';

export function getUrlsFromText(text: string) {
  const urlReg = regexPattern.urlRegex;
  const ipAddressReg = regexPattern.ipAddressRegex;

  const matchedUrls = text.match(urlReg);
  const matchedIPAddresses = text.match(ipAddressReg);

  const urls = [...(matchedUrls ?? []), ...(matchedIPAddresses ?? [])];

  return {
    hasUrl: !!urls[0],
    urls,
  };
}

export function detectUrl(text: string) {
  const splittedText = text.split(' ').map(text => {
    const { hasUrl, urls } = getUrlsFromText(normalizeText(text) ?? '');
    let returnedText = text;

    if (hasUrl) {
      urls.forEach(url => {
        const href =
          url.includes('https') || url.includes('http') ? url : `//${url}`;

        returnedText = text.replaceAll(
          url,
          `<a href="${href}" class="underline text-primary" target="_blank">${url}</a>`,
        );
      });

      return returnedText;
    }
    return returnedText;
  });

  return splittedText.join(' ');
}
