import { describe, it, expect } from 'vitest';

function groupFiles(files) {
    const groups = {};

    files.forEach(file => {
        const match = file.match(/^(\d{8}_\d{6})_(.+)$/);
        const base = match ? match[2] : file;

        if (!groups[base]) {
            groups[base] = [];
        }
        groups[base].push(file);
    });

    return groups;
}

describe('groupFiles', () => {
    it('groups files by base name after timestamp', () => {
        const input = [
            '20250728_110633_testPrint',
            '20250728_112200_testPrint',
            '20250728_110633_drawingA',
            'drawingB'
        ];

        const expected = {
            testPrint: [
                '20250728_110633_testPrint',
                '20250728_112200_testPrint'
            ],
            drawingA: ['20250728_110633_drawingA'],
            drawingB: ['drawingB']
        };

        expect(groupFiles(input)).toEqual(expected);
    });

    it('handles empty input array', () => {
        expect(groupFiles([])).toEqual({});
    });

    it('handles files without timestamp prefix', () => {
        const input = ['file1', 'file2'];
        const expected = {
            file1: ['file1'],
            file2: ['file2']
        };
        expect(groupFiles(input)).toEqual(expected);
    });
});