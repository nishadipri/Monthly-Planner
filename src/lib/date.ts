export interface CalendarDay {
  dateISO: string;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

function makeLocalDate(year: number, monthIndex: number, day: number): Date {
  return new Date(year, monthIndex, day, 12, 0, 0, 0);
}

function normalizeDate(date: Date): Date {
  return makeLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toDateISO(date: Date): string {
  const normalized = normalizeDate(date);
  const year = normalized.getFullYear();
  const month = String(normalized.getMonth() + 1).padStart(2, '0');
  const day = String(normalized.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromDateISO(dateISO: string): Date {
  const [year, month, day] = dateISO.split('-').map(Number);

  if (!year || !month || !day) {
    return normalizeDate(new Date());
  }

  return makeLocalDate(year, month - 1, day);
}

export function getMonthLabel(year: number, monthIndex: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(makeLocalDate(year, monthIndex, 1));
}

export function getMonthMatrix(year: number, monthIndex: number): CalendarDay[][] {
  const firstDayOfMonth = makeLocalDate(year, monthIndex, 1);
  const mondayBasedOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - mondayBasedOffset);

  const matrix: CalendarDay[][] = [];
  const cursor = normalizeDate(gridStart);
  const todayISO = toDateISO(new Date());

  for (let week = 0; week < 6; week += 1) {
    const weekRow: CalendarDay[] = [];

    for (let day = 0; day < 7; day += 1) {
      const cellDate = normalizeDate(cursor);
      const cellISO = toDateISO(cellDate);

      weekRow.push({
        dateISO: cellISO,
        dayNumber: cellDate.getDate(),
        inCurrentMonth: cellDate.getMonth() === monthIndex,
        isToday: cellISO === todayISO,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    matrix.push(weekRow);

    const endedMonth = cursor.getMonth() !== monthIndex;
    const finishedLastWeek = cursor.getDay() === 1;

    if (endedMonth && finishedLastWeek && week >= 3) {
      break;
    }
  }

  return matrix;
}
