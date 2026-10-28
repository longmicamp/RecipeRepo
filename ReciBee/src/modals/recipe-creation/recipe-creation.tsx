import "./recipe-creation.css";

export type RecipeCreationOption = "write" | "url" | "photos";

interface RecipeCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: RecipeCreationOption) => void;
}

function RecipeCreationModal({
  isOpen,
  onClose,
  onSelectOption,
}: RecipeCreationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="recipe-creation-overlay" onClick={onClose}>
      <div
        className="recipe-creation-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="recipe-creation-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="recipe-creation-title">Add a new Recipe</h2>
        <p className="recipe-creation-subtitle">Please select an option</p>

        <div className="recipe-creation-options">
          <button
            className="recipe-creation-option"
            onClick={() => onSelectOption("write")}
          >
            <svg
              className="recipe-creation-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <span>Write it out</span>
          </button>

          <button
            className="recipe-creation-option"
            onClick={() => onSelectOption("url")}
          >
            <svg
              className="recipe-creation-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21.44 11.05 12.25 20.24a5 5 0 0 1-7.07-7.07l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a2 2 0 0 1-2.83-2.83l7.78-7.78" />
            </svg>
            <span>Provide URL</span>
          </button>

          <button
            className="recipe-creation-option"
            onClick={() => onSelectOption("photos")}
          >
            <svg
              className="recipe-creation-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="11" r="2" />
              <path d="m21 16-5.5-5.5L9 17" />
            </svg>
            <span>From Photos</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCreationModal;
