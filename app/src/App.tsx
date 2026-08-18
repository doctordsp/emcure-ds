import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { BigRedXPage } from "./pages/BigRedXPage";
import { CourseProfilePage } from "./pages/CourseProfilePage";
import { ExportPage } from "./pages/ExportPage";
import { FrameworkPage } from "./pages/FrameworkPage";
import { JourneyPage } from "./pages/JourneyPage";
import { OpportunityImpactPage } from "./pages/OpportunityImpactPage";
import { ReviewPage } from "./pages/ReviewPage";
import { StakeholdersPage } from "./pages/StakeholdersPage";
import { SuccessPage } from "./pages/SuccessPage";
import { WorkspaceLayout } from "./ui/WorkspaceLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/designs/:designId" element={<WorkspaceLayout />}>
        <Route index element={<Navigate to="course" replace />} />
        <Route path="course" element={<CourseProfilePage />} />
        <Route path="framework" element={<FrameworkPage />} />
        <Route path="stakeholders" element={<StakeholdersPage />} />
        <Route path="opportunity-impact" element={<OpportunityImpactPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="big-red-x" element={<BigRedXPage />} />
        <Route path="journey" element={<JourneyPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="export" element={<ExportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
