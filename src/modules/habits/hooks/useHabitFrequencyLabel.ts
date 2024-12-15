import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { HabitFrequency } from "../types";
import { getDaysByHabitPeriod } from "../utils/getDaysByHabitPeriod";

export const useHabitFrequencyLabel = (frequency: HabitFrequency) => {
  const { t } = useTranslation();

  const tags = useMemo(() => {
    const isDaily = frequency.days === getDaysByHabitPeriod(frequency.period);

    if (isDaily) {
      return t("habits.daily");
    }

    return `${frequency.days} ${t("habits.times")}/${t(`habits.${frequency.period}`).toLowerCase()}`;
  }, [frequency.days, frequency.period, t]);

  return tags;
};
