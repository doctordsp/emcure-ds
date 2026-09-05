import { EXAMPLE_DESIGN } from "./exampleDesign";
import { ORTHOTIC_EXAMPLE } from "./exampleOrthotic";
import type { EmcureDesign } from "../domain/types";

export interface StarterExample {
  id: string;
  title: string;
  discipline: string;
  level: string;
  blurb: string;
  design: EmcureDesign;
}

export const STARTER_EXAMPLES: StarterExample[] = [
  {
    id: "stormwater",
    title: EXAMPLE_DESIGN.courseProfile.title,
    discipline: EXAMPLE_DESIGN.courseProfile.discipline,
    level: EXAMPLE_DESIGN.courseProfile.level,
    blurb: "Field sensors and a city go/revise/pause call.",
    design: EXAMPLE_DESIGN,
  },
  {
    id: "orthotic",
    title: ORTHOTIC_EXAMPLE.courseProfile.title,
    discipline: ORTHOTIC_EXAMPLE.courseProfile.discipline,
    level: ORTHOTIC_EXAMPLE.courseProfile.level,
    blurb: "Instron and humidity/soak reliability, no patient contact this term.",
    design: ORTHOTIC_EXAMPLE,
  },
];
