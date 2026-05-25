import { z } from "zod";

export const hostHackathonSchema = z.object({
  // STEP 1: Identity & Brand
  name: z.string().min(3, "Hackathon name must be at least 3 characters").max(50),
  tagline: z.string().min(10, "Tagline should be descriptive (min 10 chars)").max(100),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  bannerUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  
  // STEP 2: Logistics & Timeline
  mode: z.enum(["ONLINE", "IRL", "HYBRID"]),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  expectedHackers: z.coerce.number().min(10, "Minimum expected hackers is 10"),
  
  // STEP 3: Tracks & Bounties
  tracks: z.array(z.object({
    name: z.string().min(2, "Track name is required"),
    prizeAmount: z.coerce.number().min(0)
  })).min(1, "At least one track is required"),

  // STEP 4: Rules & Judging
  minTeamSize: z.coerce.number().min(1),
  maxTeamSize: z.coerce.number().min(1).max(10),
  allowedRoles: z.array(z.string()).min(1, "Select at least one allowed role"),
  judges: z.array(z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    linkedin: z.string().url().optional().or(z.literal(''))
  })).optional()
}).refine(data => data.minTeamSize <= data.maxTeamSize, {
  message: "Max team size must be >= min team size",
  path: ["maxTeamSize"]
}).refine(data => {
  if (data.mode !== "ONLINE" && !data.location) return false;
  return true;
}, {
  message: "Location is required for IRL or Hybrid events",
  path: ["location"]
});

export type HostHackathonFormValues = z.infer<typeof hostHackathonSchema>;
