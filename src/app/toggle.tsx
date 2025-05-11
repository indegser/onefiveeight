import { useRouter } from "next/navigation";
import { Switch } from "@headlessui/react";
import { useDisplayType } from "./use-display-type";

export const Toggle = () => {
  const router = useRouter();
  const { isNote } = useDisplayType();

  const handleToggle = () => {
    router.replace(`/?display-type=${isNote ? "interval" : "note"}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="toggle"
        checked={!isNote}
        onClick={handleToggle}
        className="group inline-flex h-3.5 w-7 cursor-pointer items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
      >
        <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-4" />
      </Switch>
      <label
        htmlFor="toggle"
        className="cursor-pointer text-sm font-semibold text-gray-900"
      >
        {isNote ? "Note" : "Interval"}
      </label>
      <div></div>
    </div>
  );
};
