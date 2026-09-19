import { describe, test, expect } from 'vitest';
import { fixLinks, getLootType, joinAndTruncate, handleAscDesc } from '../utils.jsx';

describe('getLootType', () => {
    test('returns "Preferred" for preferred items', () => {
        const itemObj = { type: 'preferred' };
        expect(getLootType(itemObj)).toBe('Preferred');
    });

    test('returns "Preferred, Magelo" for preferred magelo items', () => {
        const itemObj = { type: 'preferred_magelo' };
        expect(getLootType(itemObj)).toBe('Preferred, Magelo');
    });

    test('returns "Main, Magelo" for main magelo items', () => {
        const itemObj = { type: 'main_magelo' };
        expect(getLootType(itemObj)).toBe('Main, Magelo');
    });

    test('returns "Main" for main items', () => {
        const itemObj = { type: 'main' };
        expect(getLootType(itemObj)).toBe('Main');
    });

    test('returns "Alt, Magelo" for alt magelo items', () => {
        const itemObj = { type: 'alt_magelo' };
        expect(getLootType(itemObj)).toBe('Alt, Magelo');
    });

    test('returns "Alt" for alt items', () => {
        const itemObj = { type: 'alt' };
        expect(getLootType(itemObj)).toBe('Alt');
    });
});

describe('joinAndTruncate', () => {
    test('joins array and truncates to default 50 characters', () => {
        const array = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
        const result = joinAndTruncate(array);
        // Truncates at exactly 50 chars, so "nine" becomes "ni"
        expect(result).toBe('one, two, three, four, five, six, seven, eight, ni...');
    });

    test('joins array and truncates to custom length', () => {
        const array = ['apple', 'banana', 'cherry'];
        const result = joinAndTruncate(array, 10);
        expect(result).toBe('apple, ban...');
    });

    test('handles empty array', () => {
        const array = [];
        const result = joinAndTruncate(array);
        expect(result).toBe('...');
    });
});

describe('handleAscDesc', () => {
    test('returns sortBy with minus prefix when orderBy is desc', () => {
        expect(handleAscDesc('desc', 'name')).toBe('-name');
    });

    test('returns sortBy without prefix when orderBy is asc', () => {
        expect(handleAscDesc('asc', 'name')).toBe('name');
    });

    test('handles different sortBy values', () => {
        expect(handleAscDesc('desc', 'created_at')).toBe('-created_at');
        expect(handleAscDesc('asc', 'updated_at')).toBe('updated_at');
    });
});

describe('fixLinks', () => {
    test('uses the configured image host for PQDI item icons', () => {
        const html = '<img src="/static/icons/item_646.png"><img src="/static/icons/item_644.png?v=1">';

        const result = fixLinks(html, 'https://www.pqdi.cc/', 'https://assets.example.com/icons/');

        expect(result).toContain('src="https://assets.example.com/icons/item_646.png"');
        expect(result).toContain('src="https://assets.example.com/icons/item_644.png?v=1"');
    });

    test('does not rewrite non-item images', () => {
        const result = fixLinks(
            '<img src="/static/images/logo.png">',
            'https://www.pqdi.cc/',
            'https://assets.example.com/icons',
        );

        expect(result).toContain('src="/static/images/logo.png"');
    });

    test('replaces a PQDI item sprite with the configured item icon', () => {
        const result = fixLinks(
            '<span class="item-icon" style="background-image:url(/static/iconss/dragitem01.png)" title="Icon 646"></span>',
            'https://www.pqdi.cc/',
            'https://assets.example.com/icons',
        );

        expect(result).toContain('class="item-icon"');
        expect(result).toContain('src="https://assets.example.com/icons/item_646.png"');
        expect(result).toContain('width="40"');
        expect(result).toContain('height="40"');
        expect(result).not.toContain('dragitem01.png');
    });
});
