import Link from "next/link";
import { Text } from "@/features/ctv/components/ui/Text";
import { Icon } from "@/features/ctv/components/ui/Icon";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F7F8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E8EB] px-6 py-6">
        <Text variant="appName" color="primary">Connected TV Alpha Experience</Text>
      </header>

      {/* Centered CTA */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Link href="/ctv/Alpha" className="block group max-w-md w-full">
          <div className="bg-white rounded-xl border border-[#E4E8EB] p-8 text-center hover:shadow-lg hover:border-[#CBD2D9] transition-all">
            <div className="w-16 h-16 rounded-xl bg-[#E8F4FC] flex items-center justify-center mx-auto mb-5 group-hover:bg-[#0A78BE] transition-colors">
              <Icon 
                name="Play" 
                variant="filled" 
                size={32} 
                className="text-[#0A78BE] group-hover:text-white transition-colors" 
              />
            </div>
            <Text variant="header3" color="primary" className="group-hover:text-[#0A78BE] transition-colors">
              Go to Connected TV Alpha Experience
            </Text>
          </div>
        </Link>
      </div>
    </main>
  );
}
