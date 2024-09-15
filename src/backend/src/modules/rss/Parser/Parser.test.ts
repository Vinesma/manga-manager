import { expect, test } from 'vitest';
import { Parser } from '.';

const parser = new Parser();

const testFoundVolumeInfo = (
    title: string,
    expectedMatchedSection: string,
    expectedFrom: string,
    expectedTo: string
) => {
    const volumeInfo = parser.extractVolumeInformation(title);

    expect(volumeInfo).not.toBe(undefined);
    expect(volumeInfo.matchedSection).toBe(expectedMatchedSection);
    expect(volumeInfo.volumeFrom).toBe(expectedFrom);
    expect(volumeInfo.volumeTo).toBe(expectedTo);
};

const testUnparseableVolumeInfo = (title: string) => {
    const volumeInfo = parser.extractVolumeInformation(title);

    expect(volumeInfo).toBe(undefined);
};

const testFoundChapterInfo = (
    title: string,
    expectedMatchedSection: string,
    expectedFrom: string,
    expectedTo: string
) => {
    const chapterInfo = parser.extractChapterInformation(title);

    expect(chapterInfo).not.toBe(undefined);
    expect(chapterInfo.matchedSection).toBe(expectedMatchedSection);
    expect(chapterInfo.chapterFrom).toBe(expectedFrom);
    expect(chapterInfo.chapterTo).toBe(expectedTo);
};

const testUnparseableChapterInfo = (title: string) => {
    const chapterInfo = parser.extractChapterInformation(title);

    expect(chapterInfo).toBe(undefined);
};

test('Properly extract volume information', () => {
    // Has volume information in the title
    testFoundVolumeInfo(
        'My Amazing Manga Title In Romaji / My Amazing Manga Title v01-13,114-134 (2022-2024) (Digital) (MyGroup)',
        'v01-13',
        '01',
        '13'
    );
    testFoundVolumeInfo('[MyGroup] CoolManga v72 (ongoing)', 'v72', '72', undefined);

    // Unable to parse / No volume information in title
    testUnparseableVolumeInfo(
        'My Amazing Manga Title In Romaji / My Amazing Manga Title 114-134 (2022-2024) (Digital) (MyGroup)'
    );
    testUnparseableVolumeInfo(
        'Weekly Mag, ShotaJ and M++ Chapter Updates - Week 19 2024 (Digital) (MyGroup)'
    );
    testUnparseableVolumeInfo('Two Slices - Chapter 1114');
});

test('Properly extract Chapter information', () => {
    // Has chapter information in title
    testFoundChapterInfo(
        'My Amazing Manga Title In Romaji / My Amazing Manga Title 114-134 (2022-2024) (Digital) (MyGroup)',
        '114-134',
        '114',
        '134'
    );
    testFoundChapterInfo('CoolManga 007-013 (2024) (Digital) (MyGroup)', '007-013', '007', '013');

    // Pitfalls / Should not parse
    testUnparseableChapterInfo('Nice Manga Title (2016-2020) (Digital) (MyGroup)');
});
