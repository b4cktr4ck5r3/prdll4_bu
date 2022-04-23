import { useLocalStorageValue } from "@mantine/hooks";
import { BooleanString, Preferences } from "@utils/user";

export function useHideWeekEnd() {
  const [hideWeekEnd, setHideWeekEnd] = useLocalStorageValue<BooleanString>({
    key: Preferences.HideWeekEnd,
    defaultValue: "true",
  });

  return {
    hideWeekEnd: hideWeekEnd === "true",
    setHideWeekEnd,
  };
}
