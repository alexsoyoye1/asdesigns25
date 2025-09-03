"use client";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Contact from "../components/Contact";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Contact />
    </>
  );
}
