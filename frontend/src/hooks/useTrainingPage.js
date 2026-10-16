import { useMemo } from "react";
import { mergeTrainingPage } from "../lib/trainingPage";
import { useSitePage } from "./useSiteContent";

// Text of the Training page: what was saved in the admin panel, over the website's defaults.
export default function useTrainingPage() {
  const saved = useSitePage("training-page");
  return useMemo(() => mergeTrainingPage(saved), [saved]);
}
