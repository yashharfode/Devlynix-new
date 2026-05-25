import { z } from "zod";

export const hostHackathonSchema = z.object({
  // STEP 1: Identity & Brand
  name: z.string().min(3, "Hackathon name must be at least 3 characters").max(50),
  tagline: z.string().min(10, "Tagline should be descriptive (min 10 chars)").max(100),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  bannerUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").optional(),
  twitterUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  discordUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  description: z.string().min(50, "Description must be at least 50 characters"),
  
  // STEP 2: Logistics & Operations
  mode: z.enum(["ONLINE", "IRL", "HYBRID"]),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  submissionDeadline: z.string().min(1, "Submission deadline is required"),
  expectedHackers: z.coerce.number().min(10, "Minimum expected hackers is 10"),
  registrationLimit: z.coerce.number().optional(),
  contactEmail: z.string().email("Must be a valid email"),
  internationalSwagShipping: z.boolean().default(false), // USER SPECIFIED
  
  // STEP 3: Tracks & Prizes
  tracks: z.array(z.object({
    name: z.string().min(2, "Track name is required"),
    description: z.string().optional(),
    sponsor: z.string().optional(),
    prizeAmount: z.coerce.number().min(0)
  })).min(1, "At least one track is required"),
  bounties: z.array(z.object({
    name: z.string().min(2, "Bounty name is required"),
    amount: z.coerce.number().min(0)
  })).optional(),

  // STEP 4: Rules & Judging
  minTeamSize: z.coerce.number().min(1),
  maxTeamSize: z.coerce.number().min(1).max(10),
  allowedRoles: z.array(z.string()).min(1, "Select at least one allowed role"),
  eligibilityRules: z.string().optional(),
  judgingCriteria: z.array(z.object({
    name: z.string().min(2, "Criteria name required"),
    weight: z.coerce.number().min(1).max(100)
  })).min(1, "At least one judging criteria is required"),
  judges: z.array(z.object({
    name: z.string().min(2),
    role: z.string().min(2),
    linkedin: z.string().url().optional().or(z.literal(''))
  })).optional(),
  agreeToCodeOfConduct: z.literal<boolean>(true, {
    errorMap: () => ({ message: "You must agree to the Devlynix Code of Conduct" })
  }), // USER SPECIFIED

  // STEP 5: Sponsors & Mentors
  sponsors: z.array(z.object({
    name: z.string().min(2),
    tier: z.enum(["PLATINUM", "GOLD", "SILVER", "BRONZE", "PARTNER"]),
    logoUrl: z.string().url().optional().or(z.literal(''))
  })).optional(),
  mentors: z.array(z.object({
    name: z.string().min(2),
    expertise: z.string().min(2)
  })).optional(),
  needsSponsorship: z.boolean().default(false),
  announcementWebhook: z.string().url("Must be a valid webhook URL").optional().or(z.literal('')), // USER SPECIFIED

  // STEP 6: Developer Ecosystem
  requiredApis: z.string().optional(),
  recommendedTechStack: z.array(z.string()).optional(),
  requireGithubRepo: z.boolean().default(true),
  requireVideoDemo: z.boolean().default(true),
  allowPrePitching: z.boolean().default(false) // USER SPECIFIED

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
