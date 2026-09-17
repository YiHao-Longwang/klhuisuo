export const metadata = {
  title: "Contact Click History | 吉隆坡会所 Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminClickHistoryPage() {
  return (
    <main className="admin-portal admin-click-history-page" data-click-history-page>
      <section className="admin-login" data-click-login>
        <div className="admin-login-card">
          <div>
            <span className="admin-kicker">吉隆坡会所 admin</span>
            <h1>Click Analytics</h1>
            <p>Sign in with your admin token to review unique IP counts and contact click records.</p>
          </div>
          <label>
            <span>Admin token</span>
            <input data-click-token type="password" autoComplete="current-password" placeholder="Enter admin token" />
          </label>
          <button className="btn wide" type="button" data-click-save>
            Login
          </button>
          <div className="admin-status" data-click-login-status />
        </div>
      </section>

      <section className="admin-dashboard" data-click-dashboard hidden>
        <header className="admin-top">
          <div>
            <span className="admin-kicker">Contact analytics</span>
            <h1>Unique IP Analytics</h1>
            <p>See different IPs by site, area, channel, and day.</p>
          </div>
          <div className="admin-top-actions">
            <label>
              <span>Site</span>
              <select data-click-site defaultValue="all">
                <option value="all">All sites</option>
                <option value="klhuisuo">吉隆坡会所</option>
                <option value="onespa">OneSpa</option>
                <option value="unknown">Old records</option>
              </select>
            </label>
            <label>
              <span>Area</span>
              <select data-click-source defaultValue="all">
                <option value="all">All areas</option>
                <option value="main">主页/普通页面</option>
                <option value="baiqu">白区</option>
                <option value="jishi_tiaoxuan">技师挑选</option>
                <option value="unknown">Old records</option>
              </select>
            </label>
            <label>
              <span>Channel</span>
              <select data-click-channel defaultValue="all">
                <option value="all">All</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="wechat">WeChat</option>
              </select>
            </label>
            <label>
              <span>Graph period</span>
              <select data-click-period defaultValue="week">
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </label>
            <button className="btn line" type="button" data-click-refresh>
              Refresh
            </button>
            <a className="btn line" href="/admin">
              Back
            </a>
            <button className="btn line" type="button" data-click-logout>
              Logout
            </button>
          </div>
        </header>

        <div className="admin-status" data-click-status />

        <div className="click-tabs" role="tablist" aria-label="Contact click views">
          <button className="click-tab active" type="button" role="tab" aria-selected="true" data-click-tab="history">
            Click Records
          </button>
          <button className="click-tab" type="button" role="tab" aria-selected="false" data-click-tab="graph">
            Graph
          </button>
        </div>

        <section className="click-panel" data-click-panel="history">
          <div className="click-table-card" data-click-table>
            <div className="admin-empty">Click history will load after login.</div>
          </div>
          <div className="click-pager">
            <button className="btn line" type="button" data-click-prev>
              Previous
            </button>
            <span data-click-page>Page 1</span>
            <button className="btn line" type="button" data-click-next>
              Next
            </button>
          </div>
        </section>

        <section className="click-panel" data-click-panel="graph" hidden>
          <div className="click-graph-card" data-click-graph>
            <div className="admin-empty">Graph will load after login.</div>
          </div>
        </section>
      </section>

      <script src="/admin-click-history.js?v=20260911-daily-groups" defer />
    </main>
  );
}
