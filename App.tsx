import React, { useState } from "react";

type NavItem = {
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "New Chat", icon: "＋" },
  { label: "Projects", icon: "□" },
  { label: "Workflows", icon: "⌘" },
  { label: "Programs", icon: "▣" },
  { label: "Files", icon: "□" },
  { label: "Connected Devices", icon: "▱" },
  { label: "Tools", icon: "⚒" },
  { label: "Library", icon: "▤" },
];

const quickActions = [
  ["</>", "Create a Program", "Generate complete software, scripts or apps"],
  ["⌘", "Create a Workflow", "Automate multi-step tasks"],
  ["▤", "Process Documents", "Read invoices, GST, PDFs and extract data"],
  ["▱", "Connect Computers", "Run tasks across multiple devices"],
  ["□", "Build a Website", "Create and deploy websites"],
  ["▥", "Analyze Data", "Process and visualize your data"],
  ["⌁", "Use External Tools", "Connect APIs and third-party services"],
  ["＋", "More Options", "Explore Prowo capabilities"],
];

const recentProjects = [
  "Invoice Generator",
  "Interior Design CRM",
  "Shopify Product Uploader",
  "GST Report Automation",
  "Inventory Management",
  "WhatsApp Automation",
  "Computer Sync Tool",
];

export default function App() {
  const [active, setActive] = useState("New Chat");
  const [prompt, setPrompt] = useState("");

  const submitPrompt = () => {
    const value = prompt.trim();
    if (!value) return;
    console.log("Prowo request:", value);
    setPrompt("");
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span>PROWO</span>
          <b> AI</b>
        </div>

        <button style={{ ...styles.newChat, ...(active === "New Chat" ? styles.activeNav : {}) }}
          onClick={() => setActive("New Chat")}>
          <span style={styles.navIcon}>▢</span>
          New Chat
        </button>

        <nav style={styles.nav}>
          {navItems.slice(1).map((item) => (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              style={{
                ...styles.navButton,
                ...(active === item.label ? styles.activeNav : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={styles.divider} />

        <div style={styles.sectionLabel}>RECENT</div>
        <div style={styles.recentList}>
          {recentProjects.map((project) => (
            <button key={project} style={styles.recentButton}>
              <span style={styles.fileIcon}>□</span>
              <span>{project}</span>
            </button>
          ))}
        </div>

        <div style={styles.sidebarBottom}>
          <button style={styles.navButton}>
            <span style={styles.navIcon}>⚙</span>
            Settings
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div />
          <div style={styles.topbarRight}>
            <div style={styles.credits}>
              <span style={styles.creditBolt}>ϟ</span>
              <span>2,450 credits</span>
              <button style={styles.creditPlus}>+</button>
            </div>
            <button style={styles.iconButton}>♧</button>
            <div style={styles.avatar}>U</div>
          </div>
        </header>

        <section style={styles.hero}>
          <div style={styles.logo}>PROWO <span>AI</span></div>
          <h1 style={styles.heroTitle}>What do you want to build?</h1>
          <p style={styles.heroSubtitle}>Prowo AI will understand, plan, create and execute it.</p>
        </section>

        <section style={styles.quickGrid}>
          {quickActions.map(([icon, title, description]) => (
            <button
              key={title}
              style={styles.quickCard}
              onClick={() => setPrompt(`${title}: `)}
            >
              <span style={styles.quickIcon}>{icon}</span>
              <strong>{title}</strong>
              <span style={styles.quickDescription}>{description}</span>
            </button>
          ))}
        </section>

        <section style={styles.promptArea}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitPrompt();
              }
            }}
            placeholder="Ask Prowo AI to build something..."
            style={styles.textarea}
          />

          <div style={styles.promptControls}>
            <div style={styles.promptLeft}>
              <button style={styles.roundButton}>+</button>
              <button style={styles.toolButton}>◎</button>
              <button style={styles.toolButton}>⚒ Tools</button>
              <button style={styles.toolButton}>▱ Devices</button>
            </div>

            <div style={styles.promptRight}>
              <button style={styles.roundButton}>♩</button>
              <button
                onClick={submitPrompt}
                style={{
                  ...styles.sendButton,
                  opacity: prompt.trim() ? 1 : 0.65,
                }}
              >
                ↑
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#090b0e",
    color: "#f4f4f5",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: 286,
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "22px 16px",
    background: "#0c0f12",
    borderRight: "1px solid #24272b",
    display: "flex",
    flexDirection: "column",
  },
  brand: {
    fontSize: 25,
    fontWeight: 800,
    letterSpacing: "-1.2px",
    padding: "4px 10px 25px",
  },
  newChat: {
    width: "100%",
    border: "1px solid #2a2d31",
    background: "#181b1f",
    color: "#fff",
    borderRadius: 10,
    padding: "12px 13px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left",
  },
  nav: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  navButton: {
    width: "100%",
    border: "1px solid transparent",
    background: "transparent",
    color: "#b9bdc4",
    borderRadius: 9,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 13,
    fontSize: 14,
    cursor: "pointer",
    textAlign: "left",
  },
  activeNav: {
    background: "#191c20",
    color: "#ffffff",
    borderColor: "#2c3035",
  },
  navIcon: {
    width: 20,
    color: "#d5d7db",
    fontSize: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    background: "#25282d",
    margin: "16px 4px",
  },
  sectionLabel: {
    fontSize: 10,
    color: "#717780",
    letterSpacing: "1.5px",
    padding: "0 10px 9px",
  },
  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    overflow: "hidden",
  },
  recentButton: {
    border: 0,
    background: "transparent",
    color: "#aeb2b9",
    padding: "8px 10px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 12,
    cursor: "pointer",
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  fileIcon: {
    color: "#777d85",
    fontSize: 13,
  },
  sidebarBottom: {
    marginTop: "auto",
    borderTop: "1px solid #25282d",
    paddingTop: 12,
  },
  main: {
    flex: 1,
    minWidth: 0,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    height: 70,
    padding: "0 30px",
    borderBottom: "1px solid #171a1e",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topbarRight: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  credits: {
    height: 34,
    border: "1px solid #5d4a1f",
    background: "#17140d",
    borderRadius: 18,
    paddingLeft: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#dedfe2",
    fontSize: 12,
  },
  creditBolt: {
    color: "#e9b93f",
    fontSize: 17,
  },
  creditPlus: {
    height: 28,
    width: 28,
    marginRight: 3,
    border: 0,
    borderRadius: 14,
    background: "#2a2415",
    color: "#e8bd4c",
    cursor: "pointer",
    fontSize: 16,
  },
  iconButton: {
    border: 0,
    background: "transparent",
    color: "#c5c8cc",
    fontSize: 21,
    cursor: "pointer",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#26292e",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontSize: 13,
  },
  logo: {
    fontSize: 52,
    fontWeight: 850,
    letterSpacing: "-3px",
  },
  hero: {
    textAlign: "center",
    padding: "66px 24px 28px",
  },
  heroTitle: {
    margin: "16px 0 7px",
    fontSize: 25,
    fontWeight: 650,
    letterSpacing: "-0.5px",
  },
  heroSubtitle: {
    margin: 0,
    color: "#8f949c",
    fontSize: 15,
  },
  quickGrid: {
    width: "min(1080px, calc(100% - 60px))",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 13,
  },
  quickCard: {
    minHeight: 148,
    padding: "22px 17px",
    borderRadius: 13,
    border: "1px solid #2b2f34",
    background: "linear-gradient(145deg, #111417, #0d1013)",
    color: "#f4f4f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 8,
    cursor: "pointer",
  },
  quickIcon: {
    fontSize: 25,
    color: "#d9dce0",
    marginBottom: 3,
  },
  quickDescription: {
    color: "#858b94",
    fontSize: 12,
    lineHeight: 1.45,
    maxWidth: 190,
  },
  promptArea: {
    width: "min(1080px, calc(100% - 60px))",
    margin: "42px auto 34px",
    border: "1px solid #4a4e54",
    borderRadius: 17,
    background: "#101316",
    boxShadow: "0 15px 45px rgba(0,0,0,.22)",
    overflow: "hidden",
  },
  textarea: {
    width: "100%",
    minHeight: 92,
    boxSizing: "border-box",
    resize: "none",
    border: 0,
    outline: 0,
    background: "transparent",
    color: "#f2f2f4",
    padding: "19px 21px 8px",
    fontSize: 15,
    fontFamily: "inherit",
  },
  promptControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "7px 12px 12px",
  },
  promptLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  promptRight: {
    display: "flex",
    alignItems: "center",
    gap: 9,
  },
  roundButton: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    border: "1px solid #30343a",
    background: "#171a1e",
    color: "#d6d9dd",
    cursor: "pointer",
    fontSize: 17,
  },
  toolButton: {
    height: 36,
    borderRadius: 18,
    border: "1px solid #30343a",
    background: "#171a1e",
    color: "#c8cbd0",
    padding: "0 13px",
    cursor: "pointer",
    fontSize: 12,
  },
  sendButton: {
    width: 43,
    height: 43,
    borderRadius: "50%",
    border: 0,
    background: "#f2f2f2",
    color: "#0b0c0e",
    cursor: "pointer",
    fontSize: 21,
    fontWeight: 700,
  },
};
