import { useState } from "react";
import { Link } from "react-router-dom";
import type { WorkspaceRoute } from "../domain/types";
import roadmap from "../assets/Roadmap_CoreDocFinal.jpg";

export type RoadmapStage =
  | "course"
  | "project"
  | "journey"
  | "operations"
  | "assessment"
  | "destination";

export interface RoadmapHotspot {
  id: string;
  label: string;
  opens: string;
  route: WorkspaceRoute;
  stage: RoadmapStage;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function hotspotCaption(hotspot: RoadmapHotspot): string {
  return `${hotspot.label} → ${hotspot.opens}`;
}

/** Percentage boxes measured from the 960×540 JPG. The image is not modified. */
export const ROADMAP_HOTSPOTS: RoadmapHotspot[] = [
  {
    id: "box3",
    label: "3. Student Structure",
    opens: "Student journey",
    route: "journey",
    stage: "journey",
    x: 16.0,
    y: 14.5,
    w: 27.6,
    h: 8.2,
  },
  {
    id: "activities",
    label: "Activities",
    opens: "Student journey",
    route: "journey",
    stage: "journey",
    x: 21.7,
    y: 23.2,
    w: 20.5,
    h: 6.8,
  },
  {
    id: "deliverables",
    label: "Project Deliverables",
    opens: "Student journey",
    route: "journey",
    stage: "journey",
    x: 18.0,
    y: 32.1,
    w: 20.4,
    h: 6.8,
  },
  {
    id: "scaffolding",
    label: "Scaffolding",
    opens: "Student journey",
    route: "journey",
    stage: "journey",
    x: 22.1,
    y: 41.0,
    w: 20.3,
    h: 6.6,
  },
  {
    id: "pin3",
    label: "Stage 3: Student Structure",
    opens: "Student journey",
    route: "journey",
    stage: "journey",
    x: 55.4,
    y: 49.1,
    w: 5.0,
    h: 12.0,
  },

  {
    id: "box2",
    label: "2. Stakeholder and Project",
    opens: "Stakeholders and need",
    route: "stakeholders",
    stage: "project",
    x: 2.0,
    y: 55.0,
    w: 25.8,
    h: 8.6,
  },
  {
    id: "stakeholder",
    label: "Stakeholder",
    opens: "Stakeholders and need",
    route: "stakeholders",
    stage: "project",
    x: 3.5,
    y: 64.1,
    w: 19.3,
    h: 6.6,
  },
  {
    id: "project",
    label: "EM-CURE Project",
    opens: "Opportunity and impact",
    route: "opportunity-impact",
    stage: "project",
    x: 9.5,
    y: 72.8,
    w: 16.9,
    h: 6.6,
  },
  {
    id: "labor",
    label: "Labor Distribution",
    opens: "Student journey",
    route: "journey",
    stage: "project",
    x: 3.5,
    y: 81.5,
    w: 19.3,
    h: 6.6,
  },
  {
    id: "pin2",
    label: "Stage 2: Stakeholder and Project",
    opens: "Stakeholders and need",
    route: "stakeholders",
    stage: "project",
    x: 43.2,
    y: 62.1,
    w: 5.7,
    h: 12.2,
  },

  {
    id: "box1",
    label: "1. Course Details",
    opens: "Course profile",
    route: "course",
    stage: "course",
    x: 58.1,
    y: 70.2,
    w: 39.8,
    h: 8.8,
  },
  {
    id: "course",
    label: "Course",
    opens: "Course profile",
    route: "course",
    stage: "course",
    x: 59.5,
    y: 79.7,
    w: 13.8,
    h: 6.6,
  },
  {
    id: "objectives",
    label: "EM Learning Objective",
    opens: "EM framework",
    route: "framework",
    stage: "course",
    x: 74.3,
    y: 79.7,
    w: 22.3,
    h: 6.6,
  },
  {
    id: "habits",
    label: "EM Habits and Behaviors",
    opens: "EM framework",
    route: "framework",
    stage: "course",
    x: 59.5,
    y: 88.4,
    w: 20.7,
    h: 6.6,
  },
  {
    id: "duration",
    label: "Duration",
    opens: "Course profile",
    route: "course",
    stage: "course",
    x: 81.7,
    y: 88.4,
    w: 14.9,
    h: 6.6,
  },
  {
    id: "pin1",
    label: "Stage 1: Course Details",
    opens: "Course profile",
    route: "course",
    stage: "course",
    x: 29.5,
    y: 78.7,
    w: 5.5,
    h: 13.0,
  },

  {
    id: "box4",
    label: "4. Operational Details",
    opens: "Student journey",
    route: "journey",
    stage: "operations",
    x: 69.0,
    y: 40.0,
    w: 28.6,
    h: 8.0,
  },
  {
    id: "accountability",
    label: "Student Accountability",
    opens: "Student journey",
    route: "journey",
    stage: "operations",
    x: 70.7,
    y: 48.6,
    w: 25.5,
    h: 6.8,
  },
  {
    id: "engagement",
    label: "Stakeholder Engagement",
    opens: "Stakeholders and need",
    route: "stakeholders",
    stage: "operations",
    x: 70.7,
    y: 57.1,
    w: 25.5,
    h: 6.8,
  },
  {
    id: "pin4",
    label: "Stage 4: Operational Details",
    opens: "Student journey",
    route: "journey",
    stage: "operations",
    x: 52.8,
    y: 27.8,
    w: 5.5,
    h: 12.8,
  },

  {
    id: "box5",
    label: "5. Assessment",
    opens: "Alignment review",
    route: "review",
    stage: "assessment",
    x: 71.2,
    y: 1.8,
    w: 26.8,
    h: 7.4,
  },
  {
    id: "grades",
    label: "Students (Grades)",
    opens: "Alignment review",
    route: "review",
    stage: "assessment",
    x: 72.9,
    y: 9.7,
    w: 18.3,
    h: 6.8,
  },
  {
    id: "eml",
    label: "EML",
    opens: "EM framework",
    route: "framework",
    stage: "assessment",
    x: 78.5,
    y: 18.4,
    w: 18.3,
    h: 6.5,
  },
  {
    id: "sotl",
    label: "SoTL",
    opens: "Alignment review",
    route: "review",
    stage: "assessment",
    x: 72.9,
    y: 26.7,
    w: 18.3,
    h: 6.6,
  },
  {
    id: "pin5",
    label: "Stage 5: Assessment",
    opens: "Alignment review",
    route: "review",
    stage: "assessment",
    x: 51.4,
    y: 11.1,
    w: 5.3,
    h: 11.1,
  },

  {
    id: "destination",
    label: "EM-CURE",
    opens: "Export",
    route: "export",
    stage: "destination",
    x: 59.2,
    y: 0.3,
    w: 6.6,
    h: 15.4,
  },
];

export const THREAD_LEGEND: {
  id: string;
  label: string;
  route: WorkspaceRoute;
  tone: "project" | "opportunity" | "success" | "brx";
}[] = [
  { id: "need", label: "Need", route: "stakeholders", tone: "project" },
  {
    id: "opportunity-impact",
    label: "Opportunity and Impact",
    route: "opportunity-impact",
    tone: "opportunity",
  },
  { id: "success", label: "Success Criteria", route: "success", tone: "success" },
  { id: "big-red-x", label: "Big Red X", route: "big-red-x", tone: "brx" },
];

export function RoadmapMap({
  hrefFor,
  onUnavailable,
}: {
  hrefFor: (route: WorkspaceRoute) => string | null;
  onUnavailable: () => void;
}) {
  const [focused, setFocused] = useState<RoadmapHotspot | null>(null);

  return (
    <div className="roadmap-frame">
      <div className="roadmap-plot">
        <img
          src={roadmap}
          alt="EM-CURE Project Roadmap: five stages from course details to assessment."
          width={960}
          height={540}
        />
        {ROADMAP_HOTSPOTS.map((hotspot) => {
          const href = hrefFor(hotspot.route);
          const caption = hotspotCaption(hotspot);
          const style = {
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: `${hotspot.w}%`,
            height: `${hotspot.h}%`,
          };
          const pointer = {
            onMouseEnter: () => setFocused(hotspot),
            onMouseLeave: () => setFocused(null),
            onFocus: () => setFocused(hotspot),
            onBlur: () => setFocused(null),
          };
          if (href) {
            return (
              <Link
                key={hotspot.id}
                className="hotspot"
                to={href}
                style={style}
                {...pointer}
              >
                <span className="sr-only">{caption}</span>
              </Link>
            );
          }
          return (
            <button
              key={hotspot.id}
              type="button"
              className="hotspot"
              style={style}
              onClick={onUnavailable}
              {...pointer}
            >
              <span className="sr-only">{caption}</span>
            </button>
          );
        })}
      </div>
      <p
        className={`roadmap-caption${focused ? ` stage-${focused.stage}` : ""}`}
        role="status"
      >
        {focused
          ? hotspotCaption(focused)
          : "Hover a colored box or pin to see which Design Studio section it opens."}
      </p>
    </div>
  );
}
