import Link from "next/link";
import Image from "next/image";
import type { Region } from "@/data/properties";
import { HOSTS_INTRO, regionHosts } from "@/data/hosts";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Small "Your host" card under the booking panel; links to the full
// "Meet your hosts" section on the home page.
export default function HostCard({ region }: { region: Region }) {
  const host = regionHosts[region];
  return (
    <Link
      href="/#hosts"
      className="mt-4 flex items-center gap-4 bg-white rounded-2xl border border-cream-dark p-4 shadow-sm hover:border-secondary/30 hover:shadow-md transition-all group"
    >
      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow">
        <Image src={`${basePath}${host.photo}`} alt={host.name} fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Your host</p>
        <p className="font-semibold text-gray-900">{host.name}</p>
        <p className="text-xs text-gray-600 mt-0.5">★ Superhost · Replies {HOSTS_INTRO.replyTime}</p>
        <p className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors mt-1">
          Meet {HOSTS_INTRO.names} →
        </p>
      </div>
    </Link>
  );
}
