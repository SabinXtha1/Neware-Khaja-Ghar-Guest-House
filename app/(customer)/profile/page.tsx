"use client";

import { useEffect, useState } from "react";
import { User, Image as ImageIcon, Phone, MapPin, Mail, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    photoUrl: "",
    password: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          photoUrl: data.photoUrl || "",
          password: "",
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...form };
      if (!payload.password) delete payload.password; // Don't send empty password
      
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || "Failed to update profile");
        return;
      }
      
      const updated = await res.json();
      setProfile(updated);
      setForm(prev => ({ ...prev, password: "" })); // clear password field after save
      toast.success("Profile updated successfully!");
      
      // Dispatch an event so the navbar can update the avatar
      window.dispatchEvent(new Event("profile-updated"));
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account details and security</p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="h-32 w-32 rounded-full border-4 border-card bg-muted overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-muted-foreground/50" />
              )}
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 font-medium">
              Member since {profile ? new Date(profile.createdAt).toLocaleDateString() : ""}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" /> Email Address (Cannot be changed)</Label>
                <Input id="email" value={profile?.email || ""} disabled className="bg-muted/50 font-medium" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoUrl" className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Profile Photo URL</Label>
                <Input id="photoUrl" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." />
              </div>

              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label htmlFor="password" className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> New Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep current password" />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-end">
              <Button type="submit" disabled={saving} className="gradient-primary text-white border-0 px-8 h-10 shadow-md hover:opacity-90">
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
