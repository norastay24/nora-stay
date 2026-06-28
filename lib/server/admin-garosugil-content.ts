import type { GarosugilContent } from "@/lib/garosugil-content";
import {
  deserializeLocationContent,
  fetchAdminLocationContent,
  serializeLocationContent,
} from "@/lib/server/admin-location-content";

export const deserializeGarosugilContent = deserializeLocationContent;

export function serializeGarosugilContent(content: GarosugilContent) {
  return serializeLocationContent("garosugil", content);
}

export function fetchAdminGarosugilContent() {
  return fetchAdminLocationContent("garosugil");
}
