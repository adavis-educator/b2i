'use client';

import { isLastFridayOfMonth } from '@/lib/utils';
import { WeeklyCheckin } from './WeeklyCheckin';
import { MonthlyReview } from './MonthlyReview';

export function GoalsCheckin() {
  const showMonthly = isLastFridayOfMonth();

  return (
    <div className="space-y-6">
      {showMonthly ? <MonthlyReview /> : <WeeklyCheckin />}
    </div>
  );
}
