import { useLocalStorageValue } from "@mantine/hooks";
import { BooleanString, Preferences } from "@utils/user";

export default function useSyncCalendarForm() {
  const [syncCalendarForm, setSyncCalendarForm] =
    useLocalStorageValue<BooleanString>({
      key: Preferences.SyncCalendarForm,
      defaultValue: "false",
    });

  return {
    syncCalendarForm: syncCalendarForm === "true",
    setSyncCalendarForm,
  };
}
