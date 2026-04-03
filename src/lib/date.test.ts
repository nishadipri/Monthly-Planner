import { describe, expect, it } from 'vitest';
import { getMonthMatrix } from '@/lib/date';

describe('getMonthMatrix', () => {
  it('starts weeks on Monday and backfills previous month days', () => {
    const matrix = getMonthMatrix(2023, 8);

    expect(matrix[0][0].dateISO).toBe('2023-08-28');
    expect(matrix[0][0].inCurrentMonth).toBe(false);
    expect(matrix[0][6].dateISO).toBe('2023-09-03');
  });

  it('includes the full first week for a month that starts on Monday', () => {
    const matrix = getMonthMatrix(2024, 0);

    expect(matrix[0][0].dateISO).toBe('2024-01-01');
    expect(matrix[0][0].inCurrentMonth).toBe(true);
    expect(matrix[0]).toHaveLength(7);
  });
});
