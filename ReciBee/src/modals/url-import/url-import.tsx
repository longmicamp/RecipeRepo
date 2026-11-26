import { useEffect, useState } from "react";
import "./url-import.css";

interface UrlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (url: string) => Promise<void>;
}

function UrlImportModal({ isOpen, onClose, onImport }: UrlImportModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setUrl("");
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid link starting with http:// or https://");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onImport(trimmed);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't import that recipe.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="url-import-overlay" onClick={loading ? undefined : onClose}>
      <div className="url-import-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="url-import-close"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>

        <div className="url-import-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <h2 className="url-import-title">Import from a URL</h2>
        <p className="url-import-subtitle">
          Paste a link to any recipe page and we'll pull out the ingredients
          and steps for you to review.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="url-import-label" htmlFor="url-import-input">
            Recipe link
          </label>
          <div className="url-import-row">
            <input
              id="url-import-input"
              className="url-import-input"
              type="url"
              placeholder="https://food-blog.com/roast-chicken"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              className="url-import-button"
              type="submit"
              disabled={loading || url.trim() === ""}
            >
              Import
            </button>
          </div>
        </form>

        {error && !loading && <p className="url-import-error">{error}</p>}

        {loading && (
          <div className="url-import-status" role="status">
            <span className="url-import-spinner" aria-hidden="true" />
            <div>
              <p className="url-import-status-title">Fetching recipe…</p>
              <p className="url-import-status-text">
                Reading the page and structuring ingredients &amp; steps
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UrlImportModal;
