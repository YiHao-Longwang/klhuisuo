export const metadata = {
  title: "吉隆坡会所 预约管理",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="admin-portal" data-admin-page>
      <section className="admin-login" data-admin-login>
        <div className="admin-login-card">
          <div><span className="admin-kicker">吉隆坡会所 管理后台</span><h1>预约管理</h1><p>登录后可查看顾客联络资料、处理预约及更新状态。</p></div>
          <label><span>管理员密钥</span><input data-admin-token type="password" autoComplete="current-password" placeholder="请输入管理员密钥" /></label>
          <button className="btn wide" type="button" data-admin-save>登录</button>
          <div className="admin-status" data-admin-login-status />
        </div>
      </section>
      <section className="admin-dashboard" data-admin-dashboard hidden>
        <header className="admin-top">
          <div><span className="admin-kicker">实时预约</span><h1>预约订单</h1><p>这里保留之前的线上预约记录与顾客联络资料。新预约请通过 WhatsApp、WeChat 或 Telegram 联系客服。</p></div>
          <div className="admin-top-actions">
            <label><span>状态</span><select data-admin-filter defaultValue="all"><option value="all">全部</option><option value="pending">待确认</option><option value="confirmed">已确认</option><option value="completed">已完成</option><option value="cancelled">已取消</option><option value="no_show">未到店</option></select></label>
            <button className="btn line" type="button" data-admin-refresh>刷新预约</button>
            <button className="btn line" type="button" data-admin-logout>退出登录</button>
          </div>
        </header>
        <div className="admin-status" data-admin-status />
        <section className="admin-click-stats" aria-label="联络点击分析">
          <div className="admin-click-head"><div><span className="admin-kicker">联络点击人数</span><h2>按网站和区域统计</h2><p className="fine">金悦汇 · 南海龙宫 · 吉隆坡会所；技师挑选显示 WhatsApp 与 Telegram。</p></div>
            <button className="btn line" type="button" data-admin-refresh-clicks>刷新统计</button><a className="btn line" href="/admin/clicks">查看完整记录</a></div>
          <div className="admin-click-grid" data-admin-click-stats><div className="admin-empty">登录后载入联络统计。</div></div>
          <div className="admin-click-recent" data-admin-click-recent />
        </section>
        <div className="admin-list" data-admin-list><div className="admin-empty">登录后载入预约。</div></div>
      </section>
      <script src="/admin-reservations.js?v=20261002-community" defer />
    </main>
  );
}
