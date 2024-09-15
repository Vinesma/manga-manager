export default class Parser {
    private feedTitleKey = 'title';

    constructor(options?: { feedTitleKey?: string }) {
        this.feedTitleKey = options?.feedTitleKey ?? this.feedTitleKey;
    }

    private getSeriesTitle(feedItem: any): string {
        const title = feedItem?.[this.feedTitleKey] ?? '';

        if (typeof title === 'string') {
            return title.toLowerCase();
        }

        return String(title).toLowerCase();
    }

    extractVolumeInformation(releaseTitle: string) {
        let match: RegExpExecArray;
        const regexp = new RegExp('v(\\d{1,})(?:-(\\d{1,}))?');

        if ((match = regexp.exec(releaseTitle)) !== null) {
            return {
                matchedSection: match?.[0].trim(),
                volumeFrom: match?.[1],
                volumeTo: match?.[2],
            };
        }
    }

    extractChapterInformation(releaseTitle: string) {
        let match: RegExpExecArray;
        // {1,3} to avoid confusing chapter with release year e.g "(2023-2024)"
        const regexp = new RegExp('[^\\d-(](\\d{1,3})(?:-(\\d{1,3}) )?');

        if ((match = regexp.exec(releaseTitle)) !== null) {
            return {
                matchedSection: match?.[0].trim(),
                chapterFrom: match?.[1],
                chapterTo: match?.[2],
            };
        }
    }

    findMatchesToSeries(feedItems: { [key: string]: any }[], titles: string[]) {
        const matchedFeedItems = feedItems.filter((feedItem) => {
            const feedSeriesTitle = this.getSeriesTitle(feedItem);
            const matches = titles.map((title) => feedSeriesTitle.includes(title.toLowerCase()));

            return matches.some(Boolean);
        });

        return matchedFeedItems;
    }
}
