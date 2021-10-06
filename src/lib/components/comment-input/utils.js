export const mentionRegEx = /((.)\[([^[]*)]\(([^(^)]*)\))/gi;

export const replaceMentionValues = (
  value,
  replacer,
) => value.replace(mentionRegEx, (fullMatch, original, trigger, name, id) => replacer({
  original,
  trigger,
  name,
  id,
}));