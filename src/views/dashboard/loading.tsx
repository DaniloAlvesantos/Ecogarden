export const DashboardSkeleton = () => (
  <section>
    <div>
      <h1>Dashboard</h1>
      <p className="placeholder-glow">
        <span className="placeholder col-4"></span>
      </p>
    </div>

    <div className="container-fluid my-4">
      <div className="placeholder-glow">
        {/* Chart skeleton */}
        <div className="placeholder col-12" style={{ height: 300 }}></div>
      </div>
    </div>

    <div className="row gap-4 container-fluid my-5">
      <div className="card col-12 col-lg-3">
        <div className="card-body placeholder-glow">
          <h5 className="placeholder col-8"></h5>
          <p className="placeholder col-4"></p>
        </div>
      </div>

      <div className="card col-12 col-lg-3">
        <div className="card-body placeholder-glow">
          <h5 className="placeholder col-8"></h5>
          <p className="placeholder col-4"></p>
        </div>
      </div>
    </div>
  </section>
);
