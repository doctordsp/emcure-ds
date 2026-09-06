import { Navigate, Route, Routes, useLocation, useParams, useSearchParams } from "react-router-dom";
import { publishedCardSharePath } from "./domain/publish";
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

function StudioEntry() {
  const [params] = useSearchParams();
  const slug = params.get("c");
  return slug ? <PublishedCardPage slug={slug} /> : <DashboardPage />;
}

function LegacyCardRedirect() {
  const { slug } = useParams();
  return <Navigate to={publishedCardSharePath(slug ?? "")} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StudioEntry />} />
      {/* GCS serves the studio only at index.html, so shared and emailed links land here. */}
      <Route path="/index.html" element={<StudioEntry />} />
      <Route path="/setup-ai" element={<AiSetupPage />} />
      <Route path="/c/:slug" element={<LegacyCardRedirect />} />
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

