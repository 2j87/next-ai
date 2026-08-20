export function stripUrls(text: string): string {
    return text.replace(/https?:\/\/\S+/g, ' ');
}

export function stripHashtagsAndMentions(text: string): string {
    return text.replace(/[#@]\S+/g, ' ');
}

const TURKISH_TO_ASCII: Record<string, string> = {
    ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
    Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u',
};

// Transliterates Turkish-specific letters to their plain Latin/ASCII
// equivalents and lowercases the rest, e.g. "Teknofest'te İyi Bir Gündü"
// -> "teknofest'te iyi bir gundu". Not a translation — the words stay
// Turkish, only the character set is normalized for the LLM input file.
export function toAsciiLower(text: string): string {
    return text
        .replace(/[çğıöşüÇĞİIÖŞÜ]/g, (char) => TURKISH_TO_ASCII[char])
        .toLowerCase();
}
