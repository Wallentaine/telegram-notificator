export const RegexExpressions = {
    SearchInterpolation: /(?<={{)\s*(company|contact|deal)\.(cf\(.+?\)|.+?)(.+?)\s*(?=}})/g,
    SearchOutsideBrackets: /(?<={{)(.+?)(?=}})/g,
    SearchCustomField: /(?<=cf\()\s*(.+?)\s*(?=\))/g,
    SearchArgument: /(?<=\()\s*(.+)\s*(?=\))/g,
    SearchEmptySpace: /\s/g,
    SearchLocalRoundBrackets: /\(.*\)/,
    SearchLocalBraces: /\{\{.*?}}/,
    SearchEnter: /{{n}}/g,
};
