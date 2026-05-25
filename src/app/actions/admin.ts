"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Verify admin role helper
async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  
  // TODO: Fetch user from DB and check role
  return true; // Mocked as true for now
}

export async function approveOrganizer(applicationId: string, applicantUserId: string, clerkUserId: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  try {
    // 1. Update Application Status
    // TODO: Update application status in DB
    
    // 2. Update User Role in DB
    // TODO: Update user role in DB

    // 3. Update Clerk publicMetadata to sync sessionClaims
    await clerkClient().users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: "ORGANIZER"
      }
    });

    revalidatePath("/applications");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to approve organizer:", error);
    return { error: "Failed to approve organizer." };
  }
}

export async function rejectOrganizer(applicationId: string) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { error: "Unauthorized. Admin access required." };
  }

  try {
    // TODO: Update application status to REJECTED in DB

    revalidatePath("/applications");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reject organizer:", error);
    return { error: "Failed to reject organizer." };
  }
}
