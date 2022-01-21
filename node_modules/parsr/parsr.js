function parsr(pattern) {
  return (str) => {
    const parsed = {};
    let match;
    while (match = pattern.match(/\{(.*?)\}/)) {   // eslint-disable-line no-cond-assign
      const prefixStr = str.substr(0, match.index);
      const prefixPattern = pattern.substr(0, match.index);
      if (prefixStr !== prefixPattern) return null;

      const groupName = match[1];

      pattern = pattern.substr(match.index + match[0].length);
      const nextMatch = pattern.match(/\{(.*?)\}/);
      const delimiterLength = (nextMatch && nextMatch.index) || pattern.length;
      const delimiter = pattern.substr(0, delimiterLength);
      const value = delimiterLength > 0 ? str.substr(0, str.indexOf(delimiter)) : str;

      parsed[groupName] = value;

      pattern = pattern.substr(delimiter.length);
      str = str.substr(value.length + delimiter.length);

      if (str.length === 0) break;
    }

    return parsed;
  };
}

module.exports = parsr;

