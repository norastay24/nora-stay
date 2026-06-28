export type AdminHomeSettings = {
  bookingUrl: string;
};

export function createDefaultAdminHomeSettings(): AdminHomeSettings {
  return {
    bookingUrl: "#",
  };
}
