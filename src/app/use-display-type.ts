import { useSearchParams } from "next/navigation";

export const useDisplayType = () => {
  const searchParams = useSearchParams();
  const displayType = searchParams.get("display-type");
  const isNote = displayType === "note";

  return { isNote };
};
