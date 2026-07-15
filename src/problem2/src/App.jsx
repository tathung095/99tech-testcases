import { useEffect, useState } from "react";
import MainPage from "./pages/MainPage";
import OverviewPage from "./pages/OverviewPage";
import "./App.scss";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "main", label: "Main" },
];

const TAB_IDS = new Set(TABS.map((t) => t.id));

function getTabFromUrl() {
  const tab = new URLSearchParams(window.location.search).get("tab");
  return TAB_IDS.has(tab) ? tab : "overview";
}

function setTabInUrl(tab) {
  const url = new URL(window.location.href);
  if (tab === "overview") {
    url.searchParams.delete("tab");
  } else {
    url.searchParams.set("tab", tab);
  }
  window.history.replaceState(null, "", url);
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getTabFromUrl);

  useEffect(() => {
    function onPopState() {
      setActiveTab(getTabFromUrl());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function navigate(tab) {
    if (!TAB_IDS.has(tab)) return;
    setActiveTab(tab);
    setTabInUrl(tab);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="brand-icon">N</span>
          <h1>99Tech Testcase</h1>
        </div>
        <nav className="app-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => navigate(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main
        className={`app-main ${activeTab === "main" ? "app-main-wide" : ""}`}
      >
        {activeTab === "overview" && <OverviewPage onNavigate={navigate} />}
        {activeTab === "main" && <MainPage />}
      </main>
    </div>
  );
}
