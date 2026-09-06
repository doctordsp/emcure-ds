import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { BigRedXPage } from "./pages/BigRedXPage";
import { MvrcPage } from "./pages/MvrcPage";
import { CourseProfilePage } from "./pages/CourseProfilePage";
import { ExportPage } from "./pages/ExportPage";
import { FrameworkPage } from "./pages/FrameworkPage";
import { JourneyPage } from "./pages/JourneyPage";
import { OpportunityImpactPage } from "./pages/OpportunityImpactPage";
import { ReviewPage } from "./pages/ReviewPage";
import { StakeholdersPage } from "./pages/StakeholdersPage";
import { SuccessPage } from "./pages/SuccessPage";
import { AiSetupPage } from "./pages/AiSetupPage";
import { PublishedCardPage } from "./pages/PublishedCardPage";
import { PublicCardsPage } from "./pages/PublicCardsPage";
import { WorkspaceLayout } from "./ui/WorkspaceLayout";

function DashboardRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      {/* GCS serves the studio only at index.html, so invite and recovery links land here. */}
      <Route path="/index.html" element={<DashboardPage />} />
      <Route path="/setup-ai" element={<AiSetupPage />} />
      <Route path="/c/:slug" element={<PublishedCardPage />} />
      <Route path="/cards" element={<PublicCardsPage />} />
      <Route path="/designs/:designId" element={<WorkspaceLayout />}>
        <Route index element={<Navigate to="course" replace />} />
        <Route path="course" element={<CourseProfilePage />} />
        <Route path="framework" element={<FrameworkPage />} />
        <Route path="stakeholders" element={<StakeholdersPage />} />
        <Route path="opportunity-impact" element={<OpportunityImpactPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="big-red-x" element={<BigRedXPage />} />
        <Route path="mvrc" element={<MvrcPage />} />
        <Route path="journey" element={<JourneyPage />} />
        <Route path="review" element={<ReviewPage />} />
        <Route path="export" element={<ExportPage />} />
      </Route>
      <Route path="*" element={<DashboardRedirect />} />
    </Routes>
  );
}

