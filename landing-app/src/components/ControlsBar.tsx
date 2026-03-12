"use client";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  flagship: "Flagship",
  "site-recreation": "Site Recreation",
  "studio-portfolio": "Studio & Portfolio",
  "3d-webgl": "3D / WebGL",
  typography: "Typography",
  "scroll-layout": "Scroll & Layout",
  "visual-effects": "Visual Effects",
};

export default function ControlsBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  resultCount,
  totalCount,
}: {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  resultCount: number;
  totalCount: number;
}) {
  return (
    <div className="controls-bar">
      <div className="controls-inner">
        <div className="search-box">
          <span className="search-icon">&#9906;</span>
          <input
            type="text"
            placeholder="Search experiments..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="filter-pills">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`filter-pill ${category === key ? "active" : ""}`}
              onClick={() => onCategoryChange(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="result-count">
          {resultCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}
