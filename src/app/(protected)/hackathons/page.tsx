import HackathonsClient from "./HackathonsClient";

export default async function HackathonsPage() {
  // Fetch only APPROVED hackathons
  // TODO: Fetch from DB
  const approvedHackathons: any[] = [];

  return <HackathonsClient initialHackathons={approvedHackathons} />;
}
