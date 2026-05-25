"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function submitOrganizerApplication(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    return { error: "You must be logged in to apply." };
  }

  const companyName = formData.get("companyName") as string;
  const website = formData.get("website") as string;
  const description = formData.get("description") as string;

  if (!companyName || !description) {
    return { error: "Company Name and Description are required." };
  }

  try {
    // Ensure the user exists in our DB first
    // TODO: Fetch user from DB
    const dbUser = { id: userId }; // Mock user
    
    if (!dbUser) {
      return { error: "Profile not found. Please complete onboarding first." };
    }

    // Check if they already have a pending application
    // TODO: Fetch existing application from DB
    const existingApp = null; // Mock

    if (existingApp) {
      return { error: "You already have a pending application." };
    }

    // TODO: Create Organizer Application in DB

    revalidatePath("/apply-to-host");
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return { error: "Failed to submit application. Please try again." };
  }
}
