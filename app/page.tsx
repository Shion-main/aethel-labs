import { Hero } from "@/components/sections/Hero";
import { Pitch } from "@/components/sections/Pitch";
import { Services } from "@/components/sections/Services";
import { Frame } from "@/components/sections/Frame";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Packages } from "@/components/sections/Packages";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero /><Pitch /><Services /><Frame /><Work />
      <Process /><Packages /><About /><Contact /><Footer />
    </main>
  );
}
