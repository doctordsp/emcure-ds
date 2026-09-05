import { filledNumber, filledText } from "../domain/progress";
import { NumberInput, SelectField, TextArea, TextInput } from "../ui/fields";
import { useDesign } from "../ui/DesignContext";

export function CourseProfilePage() {
  const { design, update } = useDesign();
  const profile = design.courseProfile;

  function patch(partial: Partial<typeof profile>) {
    update((current) => {
      const courseProfile = { ...current.courseProfile, ...partial };
      const title = courseProfile.title.trim() || current.title;
      return { ...current, title, courseProfile };
    });
  }

  return (
    <div className="stack">
      <h1>Course profile</h1>
      <p className="lede">
        Establish feasibility constraints and technical intentions. These fields feed
        later alignment checks; they do not lock the rest of the design. Ready needs
        the profile filled in, not only a title and duration.
      </p>
      <TextInput
        id="course-title"
        label="Course or experience title"
        value={profile.title}
        onChange={(title) => patch({ title })}
        readyOk={filledText(profile.title)}
      />
      <TextInput
        id="course-code"
        label="Course code"
        value={profile.code}
        onChange={(code) => patch({ code })}
        readyOk={filledText(profile.code)}
      />
      <TextInput
        id="discipline"
        label="Discipline"
        value={profile.discipline}
        onChange={(discipline) => patch({ discipline })}
        readyOk={filledText(profile.discipline)}
      />
      <TextInput
        id="level"
        label="Student level"
        hint="For example: first-year, junior, mixed undergraduates"
        value={profile.level}
        onChange={(level) => patch({ level })}
        readyOk={filledText(profile.level)}
      />
      <NumberInput
        id="enrollment"
        label="Enrollment"
        value={profile.enrollment}
        onChange={(enrollment) => patch({ enrollment })}
        readyOk={filledNumber(profile.enrollment)}
      />
      <NumberInput
        id="team-size"
        label="Typical team size"
        value={profile.teamSize}
        onChange={(teamSize) => patch({ teamSize })}
        readyOk={filledNumber(profile.teamSize)}
      />
      <NumberInput
        id="duration"
        label="Duration (weeks)"
        hint="Used to warn if too many EM priorities are selected."
        value={profile.durationWeeks}
        onChange={(durationWeeks) => patch({ durationWeeks })}
        readyOk={filledNumber(profile.durationWeeks)}
      />
      <TextInput
        id="meeting"
        label="Meeting pattern"
        value={profile.meetingPattern}
        onChange={(meetingPattern) => patch({ meetingPattern })}
        readyOk={filledText(profile.meetingPattern)}
      />
      <SelectField
        id="autonomy"
        label="Desired student autonomy"
        hint="Has a default. Change it if the course is not guided."
        value={profile.autonomyLevel}
        onChange={(autonomyLevel) =>
          patch({ autonomyLevel: autonomyLevel as typeof profile.autonomyLevel })
        }
        options={[
          { value: "low", label: "Low, tightly scaffolded" },
          { value: "guided", label: "Guided" },
          { value: "mixed", label: "Mixed" },
          { value: "high", label: "High, student-directed" },
        ]}
      />
      <TextArea
        id="prereq"
        label="Prerequisites"
        value={profile.prerequisites}
        onChange={(prerequisites) => patch({ prerequisites })}
        readyOk={filledText(profile.prerequisites)}
      />
      <TextArea
        id="objectives"
        label="Technical learning objectives"
        value={profile.technicalObjectives}
        onChange={(technicalObjectives) => patch({ technicalObjectives })}
        readyOk={filledText(profile.technicalObjectives)}
      />
    </div>
  );
}
