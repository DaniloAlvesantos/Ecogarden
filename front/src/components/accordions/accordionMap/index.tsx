interface AccordionMapProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionMap = ({
  id,
  title,
  children,
  defaultOpen,
}: AccordionMapProps) => (
  <div
    className="accordion-item"
    style={{
      // @ts-expect-error Bootstrap variable
      "--bs-accordion-btn-focus-box-shadow":
        "0 0 0 0.25rem rgba(24,135,84,0.25)",
      "--bs-accordion-active-bg": "#d1e7dd",
      "--bs-accordion-active-color": "#121212",
    }}
  >
    <h2 className="accordion-header" id={`heading-${id}`}>
      <button
        className={`accordion-button ${defaultOpen ? "" : "collapsed"}`}
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={`#collapse-${id}`}
        aria-expanded={defaultOpen ? "true" : "false"}
        aria-controls={`collapse-${id}`}
      >
        {title}
      </button>
    </h2>
    <div
      id={`collapse-${id}`}
      className={`accordion-collapse collapse ${defaultOpen ? "show" : ""}`}
      aria-labelledby={`heading-${id}`}
      data-bs-parent="#aside-map-accordion"
    >
      <div className="accordion-body">{children}</div>
    </div>
  </div>
);
