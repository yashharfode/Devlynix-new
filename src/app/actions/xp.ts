"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function awardXP(amount: number, reason: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  try {
    // TODO: Fetch user from DB
    const user = { xp: 0, builder_level: "Initiate" }; // Mocked user

    if (!user) return { error: "User not found" };

    const newXP = user.xp + amount;
    
    // Calculate new level (simple logic for now)
    let newLevel = user.builder_level;
    if (newXP >= 5000) newLevel = "Elite Builder";
    else if (newXP >= 2000) newLevel = "Senior Builder";
    else if (newXP >= 500) newLevel = "Pro Builder";
    else newLevel = "Initiate";

    // TODO: Update user XP and level in DB

    revalidatePath("/community");
    revalidatePath("/hub");
    
    return { success: true, newXP, newLevel };
  } catch (error) {
    console.error("Error awarding XP:", error);
    return { error: "Failed to award XP" };
  }
}
