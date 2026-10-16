import { createBookingHandler } from "../lib/bookings.mjs";

// Vercel invokes this handler directly; no listening server or local .env is needed.
export default createBookingHandler();
