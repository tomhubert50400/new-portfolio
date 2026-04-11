import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Contact } from "@/components/sections/Contact";
import { ScreenshotPreloader } from "@/components/ui/ScreenshotPreloader";

export default function Home() {
  return (
    <>
      <ScreenshotPreloader />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <TechStack />
      <Contact />
    </>
  );
}
