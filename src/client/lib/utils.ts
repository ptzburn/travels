import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SelectLocation, SelectLocationLog } from "../../shared/types.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function formatDate(value: number | string) {
  return new Date(value);
}

export const hasSlugAndId = (
  slug: string | undefined,
  id: string | undefined,
) => {
  if (!slug || !id) return false;
  return true;
};

export const hasSlugAndNotId = (
  slug: string | undefined,
  id: string | undefined,
) => {
  if (id || !slug) return false;
  return true;
};

export const getLocationHref = (
  loc: SelectLocation | SelectLocationLog,
  slug: string | undefined,
) => {
  if (slug) return `/dashboard/location/${slug}/${loc._id}`;
  if ("slug" in loc) return `/dashboard/location/${loc.slug}`;
  return "/dashboard";
};
