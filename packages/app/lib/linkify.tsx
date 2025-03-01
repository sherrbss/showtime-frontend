import reactStringReplace from "react-string-replace";

import { TW } from "@showtime-xyz/universal.tailwind";

import { TextLink } from "app/navigation/link";

// This function replaces mention tags (@showtime) and URL (http://) with Link components
export const linkifyDescription = (text?: string, tw?: TW) => {
  if (!text) {
    return "";
  }
  // Match @-mentions
  let replacedText = reactStringReplace(text, /@(\w+)/g, (match, i) => {
    return (
      <TextLink
        href={`/@${match}`}
        key={match + i}
        target="_blank"
        tw={tw ?? "text-13 font-bold text-gray-900 dark:text-gray-100"}
      >
        @{match}
      </TextLink>
    );
  });
  // Match URLs
  replacedText = reactStringReplace(
    replacedText,
    /(https?:\/\/\S+|www\.\S+)\b/g,
    (match, i) => {
      if (match.startsWith("www.")) {
        match = "https://" + match;
      }

      const urlText = match.replace("https://", "").replace("http://", "");

      return (
        <TextLink
          href={match}
          key={match + i}
          target="_blank"
          tw={tw ?? "text-13 font-bold text-gray-900 dark:text-gray-100"}
        >
          {urlText}
        </TextLink>
      );
    }
  );

  return replacedText;
};
