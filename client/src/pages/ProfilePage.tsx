import { useEffect, useState } from "react";

import {
  Mail,
  Shield,
  Calendar,
  BookOpen,
  FileCode,
  CheckCircle,
  Target,
} from "lucide-react";

import { getProfile } from "../services/user.api";

import type { UserProfile } from "../types/user";

import StatCard from "../components/ui/StatCard";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getProfile();

        setProfile(response.data);
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        Loading Profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error || "Profile not found"}
      </div>
    );
  }

  return (
    <div className="text-white">

      <h1 className="mb-8 text-4xl font-bold">
        My Profile
      </h1>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <div className="flex items-center gap-6">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold">
            {profile.name.charAt(0)}
          </div>

          <div>

            <h2 className="text-3xl font-bold">
              {profile.name}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-slate-400">
              <Mail size={18} />
              {profile.email}
            </p>

            <p className="mt-2 flex items-center gap-2 text-slate-400">
              <Shield size={18} />
              {profile.role}
            </p>

            <p className="mt-2 flex items-center gap-2 text-slate-400">
              <Calendar size={18} />
              Joined{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>

          </div>

        </div>

      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Problems Solved"
          value={profile.stats.problemsSolved}
          icon={<BookOpen size={28} />}
        />

        <StatCard
          title="Submissions"
          value={profile.stats.totalSubmissions}
          icon={<FileCode size={28} />}
        />

        <StatCard
          title="Accepted"
          value={profile.stats.acceptedSubmissions}
          icon={<CheckCircle size={28} />}
        />

        <StatCard
          title="Acceptance Rate"
          value={`${profile.stats.acceptanceRate}%`}
          icon={<Target size={28} />}
        />

      </div>
    </div>
  );
}