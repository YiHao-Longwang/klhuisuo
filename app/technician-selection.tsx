"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TechnicianMedia = {
  id: number;
  type: string;
  filePath: string;
  fileName?: string;
  displayOrder?: number;
};

type TechnicianTimer = {
  remainingSeconds: number;
  isRunning: boolean;
};

type Technician = {
  id: number;
  name: string;
  zone: string;
  fieldWork: boolean;
  status: string;
  media: TechnicianMedia[];
  timer?: TechnicianTimer | null;
};

const filters = [
  { key: "ALL", label: "首页" },
  { key: "A", label: "A区" },
  { key: "S", label: "S区" },
  { key: "T", label: "T区" },
  { key: "M", label: "M区" },
  { key: "FIELD", label: "可外出" },
];

const whatsappHref =
  "https://wa.me/60143155632?text=%E6%82%A8%E5%A5%BD%EF%BC%8C%E6%88%91%E6%83%B3%E9%A2%84%E7%BA%A6%E6%9C%8D%E5%8A%A1";
const telegramHref = "https://t.me/nhlg09";
const wechatId = process.env.NEXT_PUBLIC_WECHAT_ID || "Longwang1918";
const mediaBase = process.env.NEXT_PUBLIC_TECHNICIAN_MEDIA_BASE_URL || "https://chuqinbiao.klyihao.com";

function mediaUrl(path?: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${mediaBase.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatTimer(timer?: TechnicianTimer | null) {
  if (!timer || timer.remainingSeconds <= 0) return "";
  const minutes = Math.floor(timer.remainingSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}小时${String(rest).padStart(2, "0")}分`;
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L4 20l1-4.4A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function IconWeChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M10.5 18.5a8 6.2 0 1 1 7.6-4.2" />
      <path d="M14 16.6a5.1 4.1 0 1 0 4.7-2.6" />
      <path d="m8.2 18.3-3 .9.9-2" />
      <path d="m18 20.1 2.4.7-.7-1.7" />
      <path d="M7.8 10h.1M12 10h.1M16.2 17h.1M19.2 17h.1" />
    </svg>
  );
}

function MediaPreview({ media, name }: { media: TechnicianMedia[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sortedMedia = useMemo(
    () => [...(media || [])].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    [media],
  );
  const activeMedia = sortedMedia[activeIndex];
  const src = mediaUrl(activeMedia?.filePath);

  function tryNextMedia() {
    setActiveIndex((current) => current + 1);
  }

  if (!activeMedia || !src || activeIndex >= sortedMedia.length) {
    return <div className="tech-placeholder">暂无照片</div>;
  }

  if (activeMedia.type === "video") {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={tryNextMedia}
      />
    );
  }

  return <img src={src} alt={`${name} 技师照片`} loading="lazy" onError={tryNextMedia} />;
}

export default function TechnicianSelection() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selected, setSelected] = useState<Technician | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTechnicians() {
      try {
        const response = await fetch("/api/technicians/working-today", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as Technician[];
        if (mounted) setTechnicians(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        console.error(fetchError);
        if (mounted) setError("暂时无法载入技师资料，请稍后刷新。");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTechnicians();
    const interval = window.setInterval(loadTechnicians, 45000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return technicians.filter((technician) => {
      if (query && !technician.name.toLowerCase().includes(query)) return false;
      if (filter === "ALL") return true;
      if (filter === "FIELD") return technician.fieldWork;
      return technician.zone === filter;
    });
  }, [filter, search, technicians]);

  return (
    <main className="tech-home">
      <section className="tech-hero">
        <div className="tech-hero-inner">
          <div className="tech-stars" aria-hidden="true">
            <span />
            <IconStar />
            <IconStar />
            <IconStar />
            <span />
          </div>
          <p className="tech-eyebrow">吉隆坡会所</p>
          <button className="tech-guide-trigger" type="button" onClick={() => setShowGuide(true)} aria-label="查看挑选说明">
            ?
          </button>
          <h1>技师挑选</h1>
          <div className="tech-marquee" aria-label="今日出勤先看再选">
            <span>今日出勤 · 先看再选 · 不用预约 · 今日出勤 · 先看再选 · 不用预约</span>
          </div>
        </div>
      </section>

      <nav className="tech-filter-panel" aria-label="技师筛选">
        <div className="tech-search">
          <IconSearch />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索技师编号，如 T987 / S817" />
        </div>
        <div className="tech-tabs">
          {filters.map((item) => (
            <button
              className={filter === item.key ? "active" : undefined}
              key={item.key}
              onClick={() => setFilter(item.key)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="tech-contact-bar">
        <a className="whatsapp" href={whatsappHref} target="_blank" rel="noopener" data-click-source="jishi_tiaoxuan">
          <IconChat />
          WhatsApp客服
        </a>
        <a className="telegram" href={telegramHref} target="_blank" rel="noopener" data-click-source="jishi_tiaoxuan">
          Telegram客服
        </a>
        <button
          className="wechat"
          type="button"
          data-wechat-copy={wechatId}
          data-copy-label={`WeChat ${wechatId}`}
          data-copied-label="已复制 WeChat ID"
        >
          <IconWeChat />
          WeChat客服
        </button>
      </div>

      <section className="tech-content">
        {loading ? (
          <div className="tech-empty">资料载入中...</div>
        ) : error ? (
          <div className="tech-empty">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="tech-empty">
            <IconStar />
            <p>暂无出勤技师</p>
          </div>
        ) : (
          <div className="tech-grid">
            {filtered.map((technician) => {
              const timer = formatTimer(technician.timer);
              return (
                <button className="tech-card" key={technician.id} onClick={() => setSelected(technician)} type="button">
                  <div className="tech-cover">
                    <MediaPreview media={technician.media || []} name={technician.name} />
                    <span className="tech-zone">{technician.zone}区</span>
                    {technician.fieldWork ? <span className="tech-field">可外出</span> : null}
                  </div>
                  <div className="tech-card-body">
                    <strong>{technician.name}</strong>
                    <span>{timer || (technician.status === "Available" ? "可预约" : technician.status)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {showGuide ? (
        <div className="tech-guide-modal" role="dialog" aria-modal="true" aria-label="技师挑选说明">
          <button className="tech-guide-backdrop" onClick={() => setShowGuide(false)} type="button" aria-label="关闭说明" />
          <div className="tech-guide-panel">
            <button className="tech-guide-close" onClick={() => setShowGuide(false)} type="button" aria-label="关闭说明">
              ×
            </button>
            <p className="tech-guide-title">挑选说明</p>
            <ol className="tech-steps">
              <li>
                <b>1</b>
                <span>WhatsApp 问客服，这位技师今天有没有空</span>
              </li>
              <li>
                <b>2</b>
                <span>告诉客服你大概几点到，不必约准时间</span>
              </li>
              <li className="tech-step-key">
                <b>3</b>
                <span>
                  进店时一定要说<strong>「我是龙王来的」</strong>
                </span>
              </li>
            </ol>
            <Link className="tech-baiqu-link" href="/">
              返回主页
            </Link>
          </div>
        </div>
      ) : null}

      {selected ? (
        <div className="tech-modal" role="dialog" aria-modal="true" aria-label={`${selected.name} 详情`}>
          <button className="tech-modal-backdrop" onClick={() => setSelected(null)} type="button" aria-label="关闭" />
          <div className="tech-modal-panel">
            <button className="tech-close" onClick={() => setSelected(null)} type="button">
              关闭
            </button>
            <h2>{selected.name}</h2>
            <p>
              {selected.zone}区 {selected.fieldWork ? " · 可外出" : ""} · {formatTimer(selected.timer) || "可预约"}
            </p>
            <div className="tech-media-strip">
              {(selected.media || []).map((item) => {
                const src = mediaUrl(item.filePath);
                return item.type === "video" ? (
                  <video key={item.id} src={src} controls playsInline />
                ) : (
                  <img key={item.id} src={src} alt={`${selected.name} 技师照片`} loading="lazy" />
                );
              })}
            </div>
            <div className="tech-modal-actions">
              <a className="whatsapp" href={whatsappHref} target="_blank" rel="noopener" data-click-source="jishi_tiaoxuan">
                WhatsApp预约
              </a>
              <a className="telegram" href={telegramHref} target="_blank" rel="noopener" data-click-source="jishi_tiaoxuan">
                Telegram预约
              </a>
              <button
                className="wechat"
                type="button"
                data-wechat-copy={wechatId}
                data-copy-label={`WeChat ${wechatId}`}
                data-copied-label="已复制 WeChat ID"
              >
                WeChat预约
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
