import i18n from "localization/i18n";

export const getLocalizedWeekDay = (date: number) => {
  switch (new Date(date).getDay()) {
    case 0:
      return i18n.t("calendar.dayNames.sun");
    case 1:
      return i18n.t("calendar.dayNames.mon");
    case 2:
      return i18n.t("calendar.dayNames.tue");
    case 3:
      return i18n.t("calendar.dayNames.wed");
    case 4:
      return i18n.t("calendar.dayNames.thu");
    case 5:
      return i18n.t("calendar.dayNames.fri");
    case 6:
      return i18n.t("calendar.dayNames.sat");

    default:
      return i18n.t("calendar.dayNames.sun");
  }
};
