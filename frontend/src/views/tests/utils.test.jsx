import { describe, test, expect } from 'vitest';
import { getLootType, joinAndTruncate, handleAscDesc } from '../utils.jsx';

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
