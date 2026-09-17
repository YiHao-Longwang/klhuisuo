export const metadata = {
  title: "吉隆坡会所 Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main className="admin-portal" data-admin-page>
      <section className="admin-login" data-admin-login>
        <div className="admin-login-card">
          <div>
            <span className="admin-kicker">吉隆坡会所 admin</span>
            <h1>Reservation Portal</h1>
            <p>Sign in with your admin token to view bookings, update status, and manually message customers.</p>
          </div>
          <label>
            <span>Admin token</span>
            <input data-admin-token type="password" autoComplete="current-password" placeholder="Enter admin token" />
          </label>
          <button className="btn wide" type="button" data-admin-save>
            Login
          </button>
          <div className="admin-status" data-admin-login-status />
        </div>
      </section>

      <section className="admin-dashboard" data-admin-dashboard hidden>
        <header className="admin-top">
          <div>
            <span className="admin-kicker">Live dashboard</span>
            <h1>Reservations</h1>
            <p>New bookings appear here through websocket. Contact buttons only show methods provided by the customer.</p>
          </div>
          <div className="admin-top-actions">
            <label>
              <span>Status</span>
              <select data-admin-filter defaultValue="all">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No show</option>
              </select>
            </label>
            <button className="btn line" type="button" data-admin-refresh>
              Refresh
            </button>
            <button className="btn line" type="button" data-admin-logout>
              Logout
            </button>
          </div>
        </header>
        <div className="admin-status" data-admin-status />
        <section className="admin-click-stats" aria-label="Contact click analytics">
          <div className="admin-click-head">
            <div>
              <span className="admin-kicker">Contact unique IPs</span>
              <h2>Unique IPs by site and area</h2>
            </div>
            <button className="btn line" type="button" data-admin-refresh-clicks>
              Refresh unique IPs
            </button>
            <a className="btn line" href="/admin/clicks">
              View all history
            </a>
          </div>
          <div className="admin-click-grid" data-admin-click-stats>
            <div className="admin-empty">Click analytics will load after login.</div>
          </div>
          <div className="admin-click-recent" data-admin-click-recent />
        </section>
        <div className="admin-list" data-admin-list>
          <div className="admin-empty">Login to load reservations.</div>
        </div>
      </section>
      <script src="/admin-reservations.js?v=20260908-wechat" defer />
    </main>
  );
}
