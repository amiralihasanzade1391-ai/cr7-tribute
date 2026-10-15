import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isGsapRegistered = false;

export function getGsap() {
  if (typeof window !== "undefined" && !isGsapRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isGsapRegistered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };
