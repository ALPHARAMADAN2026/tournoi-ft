import { useState, useEffect } from "react";

// ================= JSONBIN CONFIG =================
const BIN_ID = "699e472a43b1c97be99b0c93";
const API_KEY = "$2a$10$7JcGfyoAVRMxz9UCi86y5e9ioAlu66JfcC431wUHlqXgjQnFTdqj6";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const fetchData = async () => {
  const res = await fetch(BIN_URL + "/latest", { headers: { "X-Master-Key": API_KEY } });
  const json = await res.json();
  return json.record;
};
const saveData = async (data) => {
  await fetch(BIN_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": API_KEY },
    body: JSON.stringify(data)
  });
};

// ================= TEAMS LIST =================
const TEAMS = ["BCAS","3DIR","3ESC","2ESC","2DIR","1BIE","DCS"];

// ================= JOUEURS FIELD =================
const JoueursField = ({ list, onAdd, onUpdate, onRemove, isAdmin, icon }) => {
  if (!isAdmin) {
    if (list.length === 0) return <span className="text-gray-400 text-sm">—</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {list.map((name, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold px-2 py-1 rounded-full">
            {icon} {name}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {list.map((name, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="text-sm">{icon}</span>
          <input value={name} onChange={e => onUpdate(i, e.target.value)}
            placeholder="Nom du joueur"
            className="border rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-blue-400"/>
          <button onClick={() => onRemove(i)} className="text-red-500 hover:text-red-700 font-bold text-sm px-1">✕</button>
        </div>
      ))}
      <button onClick={onAdd} className="mt-1 bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-1 rounded self-start">
        + Joueur
      </button>
    </div>
  );
};

// ================= BACK BUTTON =================
const BackButton = ({ onBack }) => (
  <button
    onClick={onBack}
    className="flex items-center gap-2 mb-6 px-5 py-2.5 bg-white border-2 border-blue-200 text-blue-900 font-bold rounded-xl shadow-md hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all duration-200 text-sm"
  >
    <span className="text-base">←</span> Accueil
  </button>
);

// ================= PAGE HEADER =================
const PageHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="text-3xl">{icon}</span>
    <div>
      <h2 className="text-2xl font-extrabold text-blue-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ================= SHARED TOP BAR =================
const TopBar = ({ saving }) => (
  <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-4 mb-6 shadow-lg sticky top-0 z-10">
    <h1 className="text-lg font-extrabold text-center tracking-wide">⚽ TOURNOI OFFICIEL RAMADAN 2026</h1>
    {saving && <p className="text-center text-green-300 text-xs font-semibold mt-1 animate-pulse">💾 Sauvegarde...</p>}
  </div>
);

// ================= FINALE MATCH CARD =================
const FinaleMatchCard = ({ label, equipeA, equipeB, match, isAdmin, onChangeScore, onChangeMeta, onAddPlayer, onUpdatePlayer, onRemovePlayer, matchIndex }) => {
  const scoreDisplay = match && match.scoreA !== "" && match.scoreB !== ""
    ? `${match.scoreA} - ${match.scoreB}` : "— vs —";
  const winner = match && match.scoreA !== "" && match.scoreB !== ""
    ? (parseInt(match.scoreA) > parseInt(match.scoreB) ? equipeA : parseInt(match.scoreB) > parseInt(match.scoreA) ? equipeB : null)
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-4 mb-4">
      <div className="flex justify-center mb-3">
        <span className="bg-blue-900 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-4">
        <div className="flex flex-col items-center flex-1">
          <span className="font-extrabold text-blue-900 text-lg leading-tight text-center">{equipeA || "?"}</span>
          {winner === equipeA && <span className="text-xs text-green-600 font-bold mt-1">🏆 Qualifié</span>}
        </div>
        <div className="flex flex-col items-center">
          {isAdmin && match ? (
            <div className="flex items-center gap-1">
              <input type="number" value={match.scoreA} onChange={e => onChangeScore(matchIndex, "scoreA", e.target.value)}
                className="w-10 border-2 border-blue-300 rounded text-center font-bold text-lg focus:outline-none focus:border-blue-600"/>
              <span className="font-bold text-gray-400 text-lg">-</span>
              <input type="number" value={match.scoreB} onChange={e => onChangeScore(matchIndex, "scoreB", e.target.value)}
                className="w-10 border-2 border-blue-300 rounded text-center font-bold text-lg focus:outline-none focus:border-blue-600"/>
            </div>
          ) : (
            <span className="font-extrabold text-gray-700 text-xl px-3">{scoreDisplay}</span>
          )}
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="font-extrabold text-blue-900 text-lg leading-tight text-center">{equipeB || "?"}</span>
          {winner === equipeB && <span className="text-xs text-green-600 font-bold mt-1">🏆 Qualifié</span>}
        </div>
      </div>
      {match && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold uppercase">📅 Date</span>
            {isAdmin ? (
              <input type="date" value={match.date || ""} onChange={e => onChangeMeta(matchIndex, "date", e.target.value)}
                className="border rounded p-1 text-sm mt-1"/>
            ) : <span className="text-gray-700 mt-1">{match.date || "—"}</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold uppercase">🏟️ Terrain</span>
            {isAdmin ? (
              <input type="text" value={match.terrain || ""} placeholder="Terrain" onChange={e => onChangeMeta(matchIndex, "terrain", e.target.value)}
                className="border rounded p-1 text-sm mt-1 w-full"/>
            ) : <span className="text-gray-700 mt-1">{match.terrain || "—"}</span>}
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-xs text-gray-400 font-semibold uppercase">🟨 Arbitre</span>
            {isAdmin ? (
              <input type="text" value={match.arbitre || ""} placeholder="Arbitre" onChange={e => onChangeMeta(matchIndex, "arbitre", e.target.value)}
                className="border rounded p-1 text-sm mt-1 w-full"/>
            ) : <span className="text-gray-700 mt-1">{match.arbitre || "—"}</span>}
          </div>
        </div>
      )}
      {match && (
        <>
          <div className="mb-3">
            <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">⚽ Buteurs</span>
            <JoueursField list={match.buteurs || []}
              onAdd={() => onAddPlayer(matchIndex, "buteurs")}
              onUpdate={(idx, val) => onUpdatePlayer(matchIndex, "buteurs", idx, val)}
              onRemove={(idx) => onRemovePlayer(matchIndex, "buteurs", idx)}
              isAdmin={isAdmin} icon="⚽"/>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">🎯 Passes décisives</span>
            <JoueursField list={match.passes || []}
              onAdd={() => onAddPlayer(matchIndex, "passes")}
              onUpdate={(idx, val) => onUpdatePlayer(matchIndex, "passes", idx, val)}
              onRemove={(idx) => onRemovePlayer(matchIndex, "passes", idx)}
              isAdmin={isAdmin} icon="🎯"/>
          </div>
        </>
      )}
    </div>
  );
};

// ================= HOME FINALE BRACKET =================
const HomeFinaleBracket = ({ finaleMatches, dfTeams, onNavigate }) => {
  const team1 = dfTeams.df1A || "";
  const team4 = dfTeams.df1B || "";
  const team2 = dfTeams.df2A || "";
  const team3 = dfTeams.df2B || "";

  const getWinner = (match, tA, tB) => {
    if (!match || match.scoreA === "" || match.scoreB === "") return null;
    const a = parseInt(match.scoreA), b = parseInt(match.scoreB);
    return a > b ? tA : b > a ? tB : null;
  };

  const finalisteA = getWinner(finaleMatches[0], team1, team4);
  const finalisteB = getWinner(finaleMatches[1], team2, team3);
  const champion = finalisteA && finalisteB ? getWinner(finaleMatches[2], finalisteA, finalisteB) : null;

  const fmScore = (match) =>
    match && match.scoreA !== "" && match.scoreB !== ""
      ? `${match.scoreA} - ${match.scoreB}` : "— : —";

  // Carte match en inline styles purs
  const MatchCard = ({ label, teamA, teamB, match, headerBg = "#1e3a8a", headerColor = "#fff", borderColor = "#bfdbfe", scoreBg = "#eff6ff", scoreColor = "#1e3a8a", isFinale = false }) => {
    const score = fmScore(match);
    const winner = match ? getWinner(match, teamA, teamB) : null;
    return (
      <div
        onClick={() => onNavigate("finale")}
        style={{ border: `2px solid ${borderColor}`, borderRadius: 12, overflow: "hidden", background: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: 0 }}
      >
        {/* Header */}
        <div style={{ background: headerBg, color: headerColor, fontSize: 10, fontWeight: 700, textAlign: "center", padding: "5px 8px", letterSpacing: 1, textTransform: "uppercase" }}>
          {label}
        </div>
        {/* Score row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: winner === teamA ? "#16a34a" : "#1e3a8a" }}>
              {teamA || <span style={{ color: "#d1d5db", fontStyle: "italic", fontSize: 11 }}>À définir</span>}
            </div>
          </div>
          <div style={{ background: scoreBg, color: scoreColor, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "4px 10px", fontWeight: 800, fontSize: 14, minWidth: 60, textAlign: "center", flexShrink: 0 }}>
            {score}
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: winner === teamB ? "#16a34a" : "#1e3a8a" }}>
              {teamB || <span style={{ color: "#d1d5db", fontStyle: "italic", fontSize: 11 }}>À définir</span>}
            </div>
          </div>
        </div>
        {/* Meta info */}
        {match && (
          isFinale ? (
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "6px 14px 8px", display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 11, color: match.date ? "#94a3b8" : "#d1d5db" }}>📅 {match.date || "—"}</span>
              <span style={{ fontSize: 11, color: match.terrain ? "#94a3b8" : "#d1d5db" }}>🏟️ {match.terrain || "—"}</span>
              <span style={{ fontSize: 11, color: match.arbitre ? "#94a3b8" : "#d1d5db" }}>🟨 {match.arbitre || "—"}</span>
            </div>
          ) : (
            <div style={{ borderTop: "1px solid #f1f5f9", padding: "6px 10px 8px", display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 11, color: match.date ? "#94a3b8" : "#d1d5db" }}>📅 {match.date || "—"}</span>
              <span style={{ fontSize: 11, color: match.terrain ? "#94a3b8" : "#d1d5db" }}>🏟️ {match.terrain || "—"}</span>
              <span style={{ fontSize: 11, color: match.arbitre ? "#94a3b8" : "#d1d5db" }}>🟨 {match.arbitre || "—"}</span>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Titre */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>🏆</span>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e3a8a", margin: 0 }}>Phase finale</h2>
        <button
          onClick={() => onNavigate("finale")}
          style={{ marginLeft: "auto", fontSize: 12, color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          Voir détails →
        </button>
      </div>

      {/* Bracket principal */}
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", padding: 16, overflowX: "auto" }}>
        <div style={{ minWidth: 480 }}>

          {/* Ligne 1 : DF1 | Champion | DF2 */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

            {/* DF1 à gauche */}
            <div style={{ flex: 1 }}>
              <MatchCard label="Demi-finale 1" teamA={team1} teamB={team4} match={finaleMatches[0]} showMeta={true} />
            </div>

            {/* Champion au centre */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: 1, textAlign: "center", marginBottom: 6 }}>Champion</p>
              <div
                onClick={() => onNavigate("finale")}
                style={{ border: "2px solid #fbbf24", borderRadius: 12, background: "linear-gradient(160deg,#1e3a8a 0%,#1e40af 50%,#1e3a8a 100%)", textAlign: "center", padding: "14px 10px 12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", minHeight: 110, position: "relative", overflow: "hidden" }}
              >
                {/* Étoiles décoratives */}
                <span style={{ position: "absolute", top: 6, left: 10, fontSize: 8, color: "#fbbf24", opacity: 0.6 }}>★</span>
                <span style={{ position: "absolute", top: 6, right: 10, fontSize: 8, color: "#fbbf24", opacity: 0.6 }}>★</span>
                <span style={{ position: "absolute", bottom: 6, left: 14, fontSize: 6, color: "#fbbf24", opacity: 0.4 }}>★</span>
                <span style={{ position: "absolute", bottom: 6, right: 14, fontSize: 6, color: "#fbbf24", opacity: 0.4 }}>★</span>

                {/* Coupe SVG officielle */}
                <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Reflet haut de la coupe */}
                  <ellipse cx="32" cy="14" rx="16" ry="3" fill="#fde68a" opacity="0.3"/>
                  {/* Corps principal de la coupe */}
                  <path d="M16 8 H48 L44 32 Q42 42 32 44 Q22 42 20 32 Z" fill="url(#cupGold)"/>
                  {/* Anses gauche */}
                  <path d="M16 12 Q6 16 8 26 Q10 34 20 32" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  {/* Anses droite */}
                  <path d="M48 12 Q58 16 56 26 Q54 34 44 32" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  {/* Pied / tige */}
                  <rect x="28" y="44" width="8" height="8" rx="1" fill="#f59e0b"/>
                  {/* Base */}
                  <rect x="22" y="52" width="20" height="4" rx="2" fill="#d97706"/>
                  {/* Reflet sur le corps */}
                  <path d="M22 12 Q24 28 24 36" stroke="#fde68a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  {/* Étoile au centre de la coupe */}
                  <text x="32" y="30" textAnchor="middle" fontSize="12" fill="#fef3c7" fontWeight="bold" opacity="0.9">★</text>
                  <defs>
                    <linearGradient id="cupGold" x1="16" y1="8" x2="48" y2="44" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#fde68a"/>
                      <stop offset="40%" stopColor="#f59e0b"/>
                      <stop offset="100%" stopColor="#b45309"/>
                    </linearGradient>
                  </defs>
                </svg>

                {champion ? (
                  <>
                    <div style={{ fontWeight: 800, color: "#fde68a", fontSize: 15, letterSpacing: 0.5, textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{champion}</div>
                    <div style={{ fontSize: 9, color: "#fbbf24", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", opacity: 0.9 }}>Champion du tournoi</div>
                  </>
                ) : (
                  <div style={{ color: "#93c5fd", fontSize: 10, fontStyle: "italic", opacity: 0.8 }}>Vainqueur de la finale</div>
                )}
              </div>
            </div>

            {/* DF2 à droite */}
            <div style={{ flex: 1 }}>
              <MatchCard label="Demi-finale 2" teamA={team2} teamB={team3} match={finaleMatches[1]} showMeta={true} />
            </div>

          </div>

          {/* Connecteurs SVG : DF1 et DF2 convergent vers la Finale en bas au centre */}
          <div style={{ height: 36 }}>
            <svg width="100%" height="36" viewBox="0 0 100 36" preserveAspectRatio="none" style={{ display: "block" }}>
              <line x1="17" y1="0" x2="17" y2="18" stroke="#cbd5e1" strokeWidth="0.5"/>
              <line x1="17" y1="18" x2="50" y2="18" stroke="#cbd5e1" strokeWidth="0.5"/>
              <line x1="83" y1="0" x2="83" y2="18" stroke="#cbd5e1" strokeWidth="0.5"/>
              <line x1="83" y1="18" x2="50" y2="18" stroke="#cbd5e1" strokeWidth="0.5"/>
              <line x1="50" y1="18" x2="50" y2="30" stroke="#cbd5e1" strokeWidth="0.5"/>
              <polygon points="50,36 47,29 53,29" fill="#cbd5e1"/>
            </svg>
          </div>

          {/* Finale en bas au centre */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: 1, textAlign: "center", marginBottom: 6 }}>🏆 Finale</p>
              <MatchCard
                label="Finale"
                teamA={finalisteA ? finalisteA : "DF1"}
                teamB={finalisteB ? finalisteB : "DF2"}
                match={finaleMatches[2]}
                headerBg="#b45309"
                borderColor="#fde68a"
                scoreBg="#fffbeb"
                scoreColor="#92400e"
                isFinale={true}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// =================================================================================
//   MAIN APP
// =================================================================================
function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingOrder, setEditingOrder] = useState(false);
  const [showResetFinaleModal, setShowResetFinaleModal] = useState(false);

  const [regles, setRegles] = useState(
`1. Victoire = 3 points
2. Match nul = 1 point
3. Défaite = 0 point
4. En cas d'égalité : Différence > Buts marqués > Moins de cartons rouges > Moins de cartons jaunes`
  );

  const generateMatches = () => ([
    ["BCAS","3DIR"],["3ESC","2ESC"],["2DIR","1BIE"],["DCS","3DIR"],
    ["BCAS","3ESC"],["1BIE","2ESC"],["2DIR","2ESC"],["1BIE","DCS"],
    ["BCAS","2DIR"],["3DIR","3ESC"],["BCAS","1BIE"],["3ESC","DCS"],
    ["2DIR","3DIR"],["BCAS","DCS"],["2ESC","3DIR"],["1BIE","3ESC"],
    ["2DIR","DCS"],["BCAS","2ESC"],["1BIE","3DIR"],["3ESC","2DIR"],
    ["DCS","2ESC"],
  ].map(([a,b]) => ({
    date:"", equipeA:a, equipeB:b, scoreA:"", scoreB:"",
    jaunesA:[], jaunesB:[], rougesA:[], rougesB:[],
    buteurs:[], passes:[], arbitre:"", terrain:""
  })));

  const generateFinaleMatches = () => ([
    { label:"Demi-finale 1", date:"", scoreA:"", scoreB:"", jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[], arbitre:"", terrain:"" },
    { label:"Demi-finale 2", date:"", scoreA:"", scoreB:"", jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[], arbitre:"", terrain:"" },
    { label:"Finale",        date:"", scoreA:"", scoreB:"", jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[], arbitre:"", terrain:"" },
  ]);

  const [matches, setMatches] = useState(generateMatches());
  const [finaleMatches, setFinaleMatches] = useState(generateFinaleMatches());
  const [dfTeams, setDfTeams] = useState({ df1A:"", df1B:"", df2A:"", df2B:"" });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchData();
        if (data.matches?.length > 0) setMatches(data.matches);
        if (data.regles) setRegles(data.regles);
        if (data.finaleMatches?.length > 0) setFinaleMatches(data.finaleMatches);
        if (data.dfTeams) setDfTeams(data.dfTeams);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const save = async (m, r, fm, dt) => {
    setSaving(true);
    try { await saveData({ matches: m, regles: r, finaleMatches: fm, dfTeams: dt }); }
    catch (e) { alert("Erreur de sauvegarde !"); }
    setSaving(false);
  };

  const handleLogin = () => {
    if (adminPassword === "1bie123") setIsAdmin(true);
    else alert("Mot de passe incorrect !");
  };

  // ---- Match handlers ----
  const handleChange = (i, f, v) => { const c=[...matches]; c[i][f]=v; setMatches(c); save(c,regles,finaleMatches,dfTeams); };
  const handleTeamChange = (i, s, v) => { const c=[...matches]; c[i][s]=v; setMatches(c); save(c,regles,finaleMatches,dfTeams); };
  const moveMatch = (i, d) => {
    const c=[...matches]; const t=i+d;
    if(t<0||t>=c.length) return;
    [c[i],c[t]]=[c[t],c[i]]; setMatches(c); save(c,regles,finaleMatches,dfTeams);
  };
  const handleCJCRInput = (i, type, v) => {
    const c=[...matches]; const p=v.split("/").map(x=>x.trim());
    if(p.length===2){ c[i][type+"A"]=Array(Number(p[0])).fill("x"); c[i][type+"B"]=Array(Number(p[1])).fill("x"); setMatches(c); save(c,regles,finaleMatches,dfTeams); }
  };
  const addPlayer    = (i,f)     => { const c=[...matches]; c[i][f].push(""); setMatches(c); save(c,regles,finaleMatches,dfTeams); };
  const updatePlayer = (i,f,idx,v) => { const c=[...matches]; c[i][f][idx]=v; setMatches(c); save(c,regles,finaleMatches,dfTeams); };
  const removePlayer = (i,f,idx)   => { const c=[...matches]; c[i][f].splice(idx,1); setMatches(c); save(c,regles,finaleMatches,dfTeams); };

  // ---- Finale handlers ----
  const handleFinaleScore  = (i,f,v)     => { const c=[...finaleMatches]; c[i][f]=v; setFinaleMatches(c); save(matches,regles,c,dfTeams); };
  const handleFinaleMeta   = (i,f,v)     => { const c=[...finaleMatches]; c[i][f]=v; setFinaleMatches(c); save(matches,regles,c,dfTeams); };
  const addFinalePlayer    = (i,f)       => { const c=[...finaleMatches]; c[i][f].push(""); setFinaleMatches(c); save(matches,regles,c,dfTeams); };
  const updateFinalePlayer = (i,f,idx,v) => { const c=[...finaleMatches]; c[i][f][idx]=v; setFinaleMatches(c); save(matches,regles,c,dfTeams); };
  const removeFinalePlayer = (i,f,idx)   => { const c=[...finaleMatches]; c[i][f].splice(idx,1); setFinaleMatches(c); save(matches,regles,c,dfTeams); };

  const handleDfTeamChange = (key,v) => { const c={...dfTeams,[key]:v}; setDfTeams(c); save(matches,regles,finaleMatches,c); };
  const handleReglesChange = (v)     => { setRegles(v); save(matches,v,finaleMatches,dfTeams); };

  const handleReset = async () => {
    if (window.confirm("Réinitialiser toutes les données ?")) {
      const fm=generateMatches(), ff=generateFinaleMatches(), fd={df1A:"",df1B:"",df2A:"",df2B:""};
      const fr=`1. Victoire = 3 points\n2. Match nul = 1 point\n3. Défaite = 0 point\n4. En cas d'égalité : Différence > Buts marqués > Moins de cartons rouges > Moins de cartons jaunes`;
      setMatches(fm); setFinaleMatches(ff); setDfTeams(fd); setRegles(fr);
      await save(fm,fr,ff,fd);
    }
  };

  const handleResetFinale = async () => {
    const ff = generateFinaleMatches();
    const fd = { df1A:"", df1B:"", df2A:"", df2B:"" };
    setFinaleMatches(ff); setDfTeams(fd);
    await save(matches, regles, ff, fd);
  };

  // ---- Classement ----
  const classement = TEAMS.map(team => {
    let points=0,bm=0,be=0,cj=0,cr=0,mj=0;
    matches.forEach(m => {
      const a=parseInt(m.scoreA)||0, b=parseInt(m.scoreB)||0;
      if(m.equipeA===team){ if(m.scoreA!==""&&m.scoreB!=="") mj++; if(a>b) points+=3; else if(a===b&&m.scoreA!=="") points+=1; bm+=a;be+=b;cj+=m.jaunesA.length;cr+=m.rougesA.length; }
      if(m.equipeB===team){ if(m.scoreA!==""&&m.scoreB!=="") mj++; if(b>a) points+=3; else if(a===b&&m.scoreA!=="") points+=1; bm+=b;be+=a;cj+=m.jaunesB.length;cr+=m.rougesB.length; }
    });
    return {team,mj,points,bm,be,diff:bm-be,cj,cr};
  }).sort((a,b)=>b.points-a.points||b.diff-a.diff||b.bm-a.bm||a.cr-b.cr||a.cj-b.cj);

  // Équipes phase finale : uniquement ce que l'admin a saisi, sinon "?" masqué
  const team1 = dfTeams.df1A || "";
  const team4 = dfTeams.df1B || "";
  const team2 = dfTeams.df2A || "";
  const team3 = dfTeams.df2B || "";

  const getWinner = (match,tA,tB) => {
    if(!match||match.scoreA===""||match.scoreB==="") return null;
    const a=parseInt(match.scoreA),b=parseInt(match.scoreB);
    return a>b?tA:b>a?tB:null;
  };
  const finalisteA = getWinner(finaleMatches[0],team1,team4)||"Vainqueur DF1";
  const finalisteB = getWinner(finaleMatches[1],team2,team3)||"Vainqueur DF2";

  const goalStats={};
  matches.forEach(m=>m.buteurs.forEach(n=>{if(n) goalStats[n]=(goalStats[n]||0)+1;}));
  const topScorers=Object.entries(goalStats).map(([name,goals])=>({name,goals})).sort((a,b)=>b.goals-a.goals);

  const assistStats={};
  matches.forEach(m=>m.passes.forEach(n=>{if(n) assistStats[n]=(assistStats[n]||0)+1;}));
  const topAssists=Object.entries(assistStats).map(([name,assists])=>({name,assists})).sort((a,b)=>b.assists-a.assists);

  // ---- Loading ----
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">⚽</div>
        <p className="text-blue-900 text-xl font-bold">Chargement du tournoi...</p>
      </div>
    </div>
  );

  // ==========================================================================
  //  PAGE HOME
  // ==========================================================================
  if (page === "home") return (
    <div className="min-h-screen bg-gray-100">
      <TopBar saving={saving}/>
      <div className="px-4 pb-10 max-w-2xl mx-auto">

        {/* Admin */}
        {!isAdmin ? (
          <div className="flex gap-2 mb-6">
            <input type="password" placeholder="Mot de passe admin"
              onChange={e => setAdminPassword(e.target.value)}
              onKeyDown={e => e.key==="Enter" && handleLogin()}
              className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm flex-1 focus:outline-none focus:border-blue-500 bg-white shadow-sm"/>
            <button onClick={handleLogin}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm">
              🔐 Admin
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-6 items-center bg-green-50 border border-green-200 rounded-2xl p-3">
            <span className="text-green-800 text-sm font-bold">✅ Mode Admin activé</span>
            <button onClick={handleReset}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors">
              🗑️ Réinitialiser
            </button>
          </div>
        )}

        {/* ===== BRACKET PHASE FINALE ===== */}
        <HomeFinaleBracket
          finaleMatches={finaleMatches}
          dfTeams={dfTeams}
          onNavigate={setPage}
        />

        {/* Classement */}
        <div className="mb-8">
          <h2 className="text-xl font-extrabold mb-3 text-blue-900">🏅 Classement des équipes</h2>
          <div className="overflow-x-auto rounded-2xl shadow-xl">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-blue-900 to-blue-600 text-white text-center text-xs font-bold">
                  <th className="p-3">#</th>
                  <th className="p-3">Équipe</th>
                  <th className="p-3">MJ</th>
                  <th className="p-3">Pts</th>
                  <th className="p-3">BM</th>
                  <th className="p-3">BE</th>
                  <th className="p-3">Diff</th>
                  <th className="p-3">CR</th>
                  <th className="p-3">CJ</th>
                </tr>
              </thead>
              <tbody>
                {classement.map((c,i) => (
                  <tr key={i} className={`text-center border-b text-sm ${i===0?"bg-yellow-50 font-bold":i<4?"bg-blue-50/30":""}`}>
                    <td className="p-3 font-bold">
                      {i+1}
                      {i<4 && <span className="ml-1 text-blue-400 text-xs">★</span>}
                    </td>
                    <td className="p-3 font-bold text-blue-900">{c.team}</td>
                    <td className="p-3">{c.mj}</td>
                    <td className="p-3 font-extrabold text-blue-900 text-base">{c.points}</td>
                    <td className="p-3">{c.bm}</td>
                    <td className="p-3">{c.be}</td>
                    <td className="p-3 font-semibold">{c.diff}</td>
                    <td className="p-3 text-red-600 font-bold">{c.cr}</td>
                    <td className="p-3 text-yellow-600 font-bold">{c.cj}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-blue-400 mt-2 px-1">★ Les 4 premières équipes sont qualifiées pour la phase finale</p>
        </div>

        {/* 4 Boutons de navigation */}
        <div className="grid grid-cols-2 gap-3 mb-8">

          <button onClick={() => setPage("ligue")}
            className="group flex flex-col items-center justify-center gap-2 bg-white border-2 border-blue-200 hover:bg-blue-900 hover:border-blue-900 rounded-2xl p-5 shadow-md active:scale-95 transition-all duration-200">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">⚽</span>
            <span className="font-extrabold text-blue-900 group-hover:text-white text-sm text-center leading-tight transition-colors duration-200">Phase de ligue</span>
            <span className="text-xs text-gray-400 group-hover:text-blue-300 transition-colors duration-200">21 matches</span>
          </button>

          <button onClick={() => setPage("finale")}
            className="group flex flex-col items-center justify-center gap-2 bg-white border-2 border-yellow-300 hover:bg-yellow-500 hover:border-yellow-500 rounded-2xl p-5 shadow-md active:scale-95 transition-all duration-200">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">🏆</span>
            <span className="font-extrabold text-yellow-700 group-hover:text-white text-sm text-center leading-tight transition-colors duration-200">Phase finale</span>
            <span className="text-xs text-gray-400 group-hover:text-yellow-100 transition-colors duration-200">DF + Finale</span>
          </button>

          <button onClick={() => setPage("topGoals")}
            className="group flex flex-col items-center justify-center gap-2 bg-white border-2 border-green-300 hover:bg-green-700 hover:border-green-700 rounded-2xl p-5 shadow-md active:scale-95 transition-all duration-200">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">🥅</span>
            <span className="font-extrabold text-green-700 group-hover:text-white text-sm text-center leading-tight transition-colors duration-200">Top Goals</span>
            <span className="text-xs text-gray-400 group-hover:text-green-200 transition-colors duration-200">{topScorers.length} buteur(s)</span>
          </button>

          <button onClick={() => setPage("topAssists")}
            className="group flex flex-col items-center justify-center gap-2 bg-white border-2 border-purple-300 hover:bg-purple-700 hover:border-purple-700 rounded-2xl p-5 shadow-md active:scale-95 transition-all duration-200">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">🎯</span>
            <span className="font-extrabold text-purple-700 group-hover:text-white text-sm text-center leading-tight transition-colors duration-200">Top Assists</span>
            <span className="text-xs text-gray-400 group-hover:text-purple-200 transition-colors duration-200">{topAssists.length} passeur(s)</span>
          </button>

        </div>

        {/* Règlement */}
        <div className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-blue-900 to-blue-700 text-white">
          <h2 className="text-base font-extrabold mb-3 tracking-wide">📋 Règlement Officiel</h2>
          {isAdmin ? (
            <textarea value={regles} onChange={e => handleReglesChange(e.target.value)} rows={6}
              className="w-full p-3 rounded-xl text-black text-sm focus:outline-none"/>
          ) : (
            <p className="whitespace-pre-line text-sm leading-relaxed opacity-90">{regles}</p>
          )}
        </div>
      </div>
    </div>
  );

  // ==========================================================================
  //  PAGE PHASE DE LIGUE
  // ==========================================================================
  if (page === "ligue") return (
    <div className="min-h-screen bg-gray-100">
      <TopBar saving={saving}/>
      <div className="px-4 pb-10 max-w-3xl mx-auto">
        <BackButton onBack={() => { setEditingOrder(false); setPage("home"); }}/>
        <PageHeader icon="⚽" title="Phase de ligue" subtitle="21 matches — Journée de championnat"/>

        {isAdmin && (
          <div className="flex gap-2 mb-5">
            <button onClick={() => setEditingOrder(!editingOrder)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${editingOrder?"bg-orange-500 text-white":"bg-blue-800 text-white hover:bg-blue-900"}`}>
              {editingOrder ? "✅ Terminer la réorganisation" : "🔀 Réorganiser l'ordre des matches"}
            </button>
          </div>
        )}

        {/* MODE RÉORGANISATION : liste compacte avec boutons haut/bas + numéro de position */}
        {editingOrder && isAdmin && (
          <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
            <p className="text-xs text-orange-600 font-semibold mb-3">Utilisez les boutons ↑ ↓ pour changer l'ordre, ou saisissez directement le numéro de position souhaitée.</p>
            <div className="space-y-2">
              {matches.map((m, i) => (
                <div key={i} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-orange-100">
                  {/* Numéro de position éditable */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 font-bold leading-none mb-0.5">Pos.</span>
                    <input
                      type="number" min="1" max={matches.length}
                      value={i+1}
                      onChange={e => {
                        const target = parseInt(e.target.value) - 1;
                        if (isNaN(target) || target < 0 || target >= matches.length || target === i) return;
                        const copy = [...matches];
                        const [moved] = copy.splice(i, 1);
                        copy.splice(target, 0, moved);
                        setMatches(copy);
                        save(copy, regles, finaleMatches, dfTeams);
                      }}
                      className="w-10 text-center border-2 border-orange-300 rounded-lg font-extrabold text-blue-900 text-sm focus:outline-none focus:border-orange-500 py-0.5"
                    />
                  </div>
                  {/* Nom du match */}
                  <div className="flex-1 flex items-center justify-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5">
                    <span className="font-extrabold text-blue-900 text-sm">{m.equipeA}</span>
                    <span className="text-gray-400 text-xs font-bold">vs</span>
                    <span className="font-extrabold text-blue-900 text-sm">{m.equipeB}</span>
                  </div>
                  {/* Boutons haut/bas */}
                  <div className="flex flex-col gap-0.5">
                    <button onClick={()=>moveMatch(i,-1)} disabled={i===0}
                      className="bg-blue-100 hover:bg-blue-200 disabled:opacity-25 text-blue-800 font-black px-2 py-0.5 rounded-lg text-xs transition-colors">↑</button>
                    <button onClick={()=>moveMatch(i,1)} disabled={i===matches.length-1}
                      className="bg-blue-100 hover:bg-blue-200 disabled:opacity-25 text-blue-800 font-black px-2 py-0.5 rounded-lg text-xs transition-colors">↓</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MOBILE : cartes normales (seulement si pas en mode édition) */}
        {!editingOrder && (
        <div className="block md:hidden space-y-4">
          {matches.map((m,i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-md p-4 border-2 ${editingOrder?"border-orange-300":"border-gray-100"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded-full">Match {i+1}</span>
                {editingOrder && (
                  <div className="flex gap-1">
                    <button onClick={()=>moveMatch(i,-1)} disabled={i===0} className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-gray-700 font-bold px-2 py-1 rounded text-xs">▲</button>
                    <button onClick={()=>moveMatch(i,1)} disabled={i===matches.length-1} className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-gray-700 font-bold px-2 py-1 rounded text-xs">▼</button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mb-3 bg-blue-50 rounded-xl p-3">
                {editingOrder ? (
                  <select value={m.equipeA} onChange={e=>handleTeamChange(i,"equipeA",e.target.value)} className="border rounded px-1 py-1 text-sm font-bold text-blue-900 bg-white">
                    {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                ) : <span className="font-extrabold text-blue-900">{m.equipeA}</span>}
                {isAdmin && !editingOrder ? (
                  <div className="flex items-center gap-1">
                    <input type="number" value={m.scoreA} onChange={e=>handleChange(i,"scoreA",e.target.value)} className="w-10 border-2 rounded text-center font-bold"/>
                    <span className="font-bold text-gray-400">-</span>
                    <input type="number" value={m.scoreB} onChange={e=>handleChange(i,"scoreB",e.target.value)} className="w-10 border-2 rounded text-center font-bold"/>
                  </div>
                ) : !editingOrder ? (
                  <span className="font-bold text-gray-700 px-2 text-lg">{m.scoreA!==""?`${m.scoreA} - ${m.scoreB}`:"— vs —"}</span>
                ) : <span className="text-gray-400 font-bold px-2">vs</span>}
                {editingOrder ? (
                  <select value={m.equipeB} onChange={e=>handleTeamChange(i,"equipeB",e.target.value)} className="border rounded px-1 py-1 text-sm font-bold text-blue-900 bg-white">
                    {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                ) : <span className="font-extrabold text-blue-900">{m.equipeB}</span>}
              </div>
              {!editingOrder && (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-semibold uppercase">📅 Date</span>
                      {isAdmin?<input type="date" value={m.date} onChange={e=>handleChange(i,"date",e.target.value)} className="border rounded p-1 text-sm mt-1"/>:<span className="text-gray-700 mt-1">{m.date||"—"}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-semibold uppercase">🏟️ Terrain</span>
                      {isAdmin?<input type="text" value={m.terrain||""} placeholder="Terrain" onChange={e=>handleChange(i,"terrain",e.target.value)} className="border rounded p-1 text-sm mt-1 w-full"/>:<span className="text-gray-700 mt-1">{m.terrain||"—"}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-semibold uppercase">🟨 Arbitre</span>
                      {isAdmin?<input type="text" value={m.arbitre||""} placeholder="Arbitre" onChange={e=>handleChange(i,"arbitre",e.target.value)} className="border rounded p-1 text-sm mt-1 w-full"/>:<span className="text-gray-700 mt-1">{m.arbitre||"—"}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Cartons</span>
                      <div className="flex gap-3 mt-1">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-yellow-600 font-bold">CJ</span>
                          {isAdmin?<input type="text" value={`${m.jaunesA.length} / ${m.jaunesB.length}`} onChange={e=>handleCJCRInput(i,"jaunes",e.target.value)} className="border rounded p-1 w-16 text-center text-sm"/>:<span className="text-yellow-600 font-bold">{m.jaunesA.length} / {m.jaunesB.length}</span>}
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-red-600 font-bold">CR</span>
                          {isAdmin?<input type="text" value={`${m.rougesA.length} / ${m.rougesB.length}`} onChange={e=>handleCJCRInput(i,"rouges",e.target.value)} className="border rounded p-1 w-16 text-center text-sm"/>:<span className="text-red-600 font-bold">{m.rougesA.length} / {m.rougesB.length}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">⚽ Buteurs</span>
                    <JoueursField list={m.buteurs} onAdd={()=>addPlayer(i,"buteurs")} onUpdate={(idx,v)=>updatePlayer(i,"buteurs",idx,v)} onRemove={(idx)=>removePlayer(i,"buteurs",idx)} isAdmin={isAdmin} icon="⚽"/>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">🎯 Passes décisives</span>
                    <JoueursField list={m.passes} onAdd={()=>addPlayer(i,"passes")} onUpdate={(idx,v)=>updatePlayer(i,"passes",idx,v)} onRemove={(idx)=>removePlayer(i,"passes",idx)} isAdmin={isAdmin} icon="🎯"/>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        )}

        {/* PC : tableau normal (masqué en mode réorganisation) */}
        {!editingOrder && (
        <div className="hidden md:block overflow-x-auto shadow-xl rounded-2xl">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-2">#</th><th className="p-2">Match</th>
                <th className="p-2">Date</th><th className="p-2">Arbitre</th><th className="p-2">Terrain</th><th className="p-2">Buteurs</th><th className="p-2">Passes</th><th className="p-2">CJ</th><th className="p-2">CR</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m,i) => (
                <tr key={i} className="border-b align-top">
                  <td className="p-2 text-center font-bold text-gray-400">{i+1}</td>
                  <td className="p-2 text-center font-semibold">
                    {m.equipeA}
                    {isAdmin?(<><input type="number" value={m.scoreA} onChange={e=>handleChange(i,"scoreA",e.target.value)} className="w-12 mx-1 border text-center"/>-<input type="number" value={m.scoreB} onChange={e=>handleChange(i,"scoreB",e.target.value)} className="w-12 mx-1 border text-center"/></>):` ${m.scoreA!==""?m.scoreA:"—"} - ${m.scoreB!==""?m.scoreB:"—"} `}
                    {m.equipeB}
                  </td>
                  <td className="p-2 text-center">{isAdmin?<input type="date" value={m.date} onChange={e=>handleChange(i,"date",e.target.value)} className="border p-1 text-sm"/>:<span className="text-sm">{m.date||"—"}</span>}</td>
                  <td className="p-2 text-center">{isAdmin?<input type="text" value={m.arbitre||""} onChange={e=>handleChange(i,"arbitre",e.target.value)} className="border p-1 w-28 text-sm"/>:<span className="text-sm">{m.arbitre||"—"}</span>}</td>
                  <td className="p-2 text-center">{isAdmin?<input type="text" value={m.terrain||""} onChange={e=>handleChange(i,"terrain",e.target.value)} className="border p-1 w-28 text-sm"/>:<span className="text-sm">{m.terrain||"—"}</span>}</td>
                  <td className="p-2"><JoueursField list={m.buteurs} onAdd={()=>addPlayer(i,"buteurs")} onUpdate={(idx,v)=>updatePlayer(i,"buteurs",idx,v)} onRemove={(idx)=>removePlayer(i,"buteurs",idx)} isAdmin={isAdmin} icon="⚽"/></td>
                  <td className="p-2"><JoueursField list={m.passes} onAdd={()=>addPlayer(i,"passes")} onUpdate={(idx,v)=>updatePlayer(i,"passes",idx,v)} onRemove={(idx)=>removePlayer(i,"passes",idx)} isAdmin={isAdmin} icon="🎯"/></td>
                  <td className="p-2 text-center text-yellow-600 font-bold">{isAdmin?<input type="text" value={`${m.jaunesA.length} / ${m.jaunesB.length}`} onChange={e=>handleCJCRInput(i,"jaunes",e.target.value)} className="border p-1 w-20 text-center text-sm"/>:`${m.jaunesA.length} / ${m.jaunesB.length}`}</td>
                  <td className="p-2 text-center text-red-600 font-bold">{isAdmin?<input type="text" value={`${m.rougesA.length} / ${m.rougesB.length}`} onChange={e=>handleCJCRInput(i,"rouges",e.target.value)} className="border p-1 w-20 text-center text-sm"/>:`${m.rougesA.length} / ${m.rougesB.length}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );

  // ==========================================================================
  //  PAGE PHASE FINALE
  // ==========================================================================
  if (page === "finale") return (
    <div className="min-h-screen bg-gray-100">
      <TopBar saving={saving}/>
      <div className="px-4 pb-10 max-w-2xl mx-auto">
        <BackButton onBack={() => setPage("home")}/>
        <PageHeader icon="🏆" title="Phase finale" subtitle="Demi-finales & Finale du tournoi"/>

        {isAdmin && (
          <>
            {/* Modal de confirmation reset */}
            {showResetFinaleModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 360, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", border: "1px solid #fee2e2" }}>
                  {/* Icône */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fef2f2", border: "2px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  {/* Titre */}
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", textAlign: "center", margin: "0 0 8px" }}>Réinitialiser la phase finale ?</h3>
                  {/* Description */}
                  <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", margin: "0 0 8px", lineHeight: 1.6 }}>
                    Cette action effacera <strong style={{ color: "#374151" }}>toutes les données</strong> de la phase finale :
                  </p>
                  <ul style={{ fontSize: 12, color: "#6b7280", margin: "0 0 20px", paddingLeft: 20, lineHeight: 2 }}>
                    <li>Équipes des demi-finales</li>
                    <li>Scores des demi-finales et de la finale</li>
                    <li>Dates, terrains et arbitres</li>
                    <li>Buteurs et passes décisives</li>
                  </ul>
                  {/* Boutons */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setShowResetFinaleModal(false)}
                      style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "2px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={async () => { await handleResetFinale(); setShowResetFinaleModal(false); }}
                      style={{ flex: 1, padding: "10px 0", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.35)" }}
                    >
                      🗑️ Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-orange-700 text-sm">✏️ Saisir les équipes des demi-finales</div>
                <button
                  onClick={() => setShowResetFinaleModal(true)}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Réinitialiser
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-2 uppercase">Demi-finale 1</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select value={dfTeams.df1A} onChange={e=>handleDfTeamChange("df1A",e.target.value)} className="border-2 border-blue-300 rounded-xl px-2 py-1.5 text-sm font-bold text-blue-900 bg-white flex-1">
                      <option value="">— Choisir équipe —</option>
                      {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="text-gray-400 font-bold text-sm">vs</span>
                    <select value={dfTeams.df1B} onChange={e=>handleDfTeamChange("df1B",e.target.value)} className="border-2 border-blue-300 rounded-xl px-2 py-1.5 text-sm font-bold text-blue-900 bg-white flex-1">
                      <option value="">— Choisir équipe —</option>
                      {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-2 uppercase">Demi-finale 2</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select value={dfTeams.df2A} onChange={e=>handleDfTeamChange("df2A",e.target.value)} className="border-2 border-blue-300 rounded-xl px-2 py-1.5 text-sm font-bold text-blue-900 bg-white flex-1">
                      <option value="">— Choisir équipe —</option>
                      {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="text-gray-400 font-bold text-sm">vs</span>
                    <select value={dfTeams.df2B} onChange={e=>handleDfTeamChange("df2B",e.target.value)} className="border-2 border-blue-300 rounded-xl px-2 py-1.5 text-sm font-bold text-blue-900 bg-white flex-1">
                      <option value="">— Choisir équipe —</option>
                      {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Bracket */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-4 mb-6 text-white shadow-xl">
          <div className="text-center font-extrabold text-sm mb-4 tracking-widest uppercase opacity-80">🗓️ Tableau de la phase finale</div>
          <div className="flex flex-col md:flex-row items-stretch justify-around gap-3">
            <div className="bg-white/10 rounded-xl p-3 text-center flex-1">
              <div className="text-xs text-blue-200 font-bold mb-2 uppercase tracking-wide">Demi-finale 1</div>
              <div className={`font-extrabold text-base ${team1?"text-yellow-300":"text-white/30 italic text-sm"}`}>{team1||"À définir"}</div>
              <div className="text-blue-300 text-xs my-1">vs</div>
              <div className={`font-extrabold text-base ${team4?"text-yellow-300":"text-white/30 italic text-sm"}`}>{team4||"À définir"}</div>
            </div>
            <div className="flex items-center justify-center text-white/30 font-black text-2xl hidden md:flex">→</div>
            <div className="bg-yellow-400/20 border-2 border-yellow-400 rounded-xl p-3 text-center flex-1">
              <div className="text-xs text-yellow-300 font-extrabold mb-2 tracking-widest">🏆 FINALE</div>
              <div className={`font-extrabold text-base ${finalisteA!=="Vainqueur DF1"?"text-white":"text-white/40 italic text-sm"}`}>{finalisteA}</div>
              <div className="text-blue-200 text-xs my-1">vs</div>
              <div className={`font-extrabold text-base ${finalisteB!=="Vainqueur DF2"?"text-white":"text-white/40 italic text-sm"}`}>{finalisteB}</div>
            </div>
            <div className="flex items-center justify-center text-white/30 font-black text-2xl hidden md:flex">←</div>
            <div className="bg-white/10 rounded-xl p-3 text-center flex-1">
              <div className="text-xs text-blue-200 font-bold mb-2 uppercase tracking-wide">Demi-finale 2</div>
              <div className={`font-extrabold text-base ${team2?"text-yellow-300":"text-white/30 italic text-sm"}`}>{team2||"À définir"}</div>
              <div className="text-blue-300 text-xs my-1">vs</div>
              <div className={`font-extrabold text-base ${team3?"text-yellow-300":"text-white/30 italic text-sm"}`}>{team3||"À définir"}</div>
            </div>
          </div>
        </div>

        <FinaleMatchCard label="Demi-finale 1" equipeA={team1} equipeB={team4}
          match={finaleMatches[0]} isAdmin={isAdmin} matchIndex={0}
          onChangeScore={handleFinaleScore} onChangeMeta={handleFinaleMeta}
          onAddPlayer={addFinalePlayer} onUpdatePlayer={updateFinalePlayer} onRemovePlayer={removeFinalePlayer}/>

        <FinaleMatchCard label="Demi-finale 2" equipeA={team2} equipeB={team3}
          match={finaleMatches[1]} isAdmin={isAdmin} matchIndex={1}
          onChangeScore={handleFinaleScore} onChangeMeta={handleFinaleMeta}
          onAddPlayer={addFinalePlayer} onUpdatePlayer={updateFinalePlayer} onRemovePlayer={removeFinalePlayer}/>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-yellow-400"/>
          <span className="text-yellow-600 font-extrabold text-sm tracking-widest">🏆 GRANDE FINALE</span>
          <div className="flex-1 h-px bg-yellow-400"/>
        </div>

        <FinaleMatchCard label="Finale 🏆" equipeA={finalisteA} equipeB={finalisteB}
          match={finaleMatches[2]} isAdmin={isAdmin} matchIndex={2}
          onChangeScore={handleFinaleScore} onChangeMeta={handleFinaleMeta}
          onAddPlayer={addFinalePlayer} onUpdatePlayer={updateFinalePlayer} onRemovePlayer={removeFinalePlayer}/>

        {finaleMatches[2]?.scoreA !== "" && finaleMatches[2]?.scoreB !== "" && (() => {
          const champion = getWinner(finaleMatches[2], finalisteA, finalisteB);
          return champion ? (
            <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 text-center shadow-2xl">
              <div className="text-6xl mb-3">🏆</div>
              <div className="text-lg font-extrabold text-white tracking-widest uppercase">Champion du Tournoi</div>
              <div className="text-4xl font-black text-white mt-2 drop-shadow-lg">{champion}</div>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );

  // ==========================================================================
  //  PAGE TOP GOALS
  // ==========================================================================
  if (page === "topGoals") return (
    <div className="min-h-screen bg-gray-100">
      <TopBar saving={saving}/>
      <div className="px-4 pb-10 max-w-lg mx-auto">
        <BackButton onBack={() => setPage("home")}/>
        <PageHeader icon="🥅" title="Top Goals" subtitle="Classement des meilleurs buteurs"/>
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-3 text-center text-sm font-bold">#</th>
                <th className="p-3 text-left text-sm font-bold">Joueur</th>
                <th className="p-3 text-center text-sm font-bold">⚽ Buts</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map((p,i) => (
                <tr key={i} className={`border-b transition-colors ${i===0?"bg-yellow-50 font-bold":i%2===0?"bg-gray-50/60":""}`}>
                  <td className="p-3 text-center font-extrabold text-lg">{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</td>
                  <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                  <td className="p-3 text-center font-extrabold text-green-700 text-xl">{p.goals}</td>
                </tr>
              ))}
              {topScorers.length === 0 && (
                <tr><td colSpan="3" className="text-center text-gray-400 p-10">Aucun buteur enregistré</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ==========================================================================
  //  PAGE TOP ASSISTS
  // ==========================================================================
  if (page === "topAssists") return (
    <div className="min-h-screen bg-gray-100">
      <TopBar saving={saving}/>
      <div className="px-4 pb-10 max-w-lg mx-auto">
        <BackButton onBack={() => setPage("home")}/>
        <PageHeader icon="🎯" title="Top Assists" subtitle="Classement des meilleures passes décisives"/>
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-purple-700 text-white">
                <th className="p-3 text-center text-sm font-bold">#</th>
                <th className="p-3 text-left text-sm font-bold">Joueur</th>
                <th className="p-3 text-center text-sm font-bold">🎯 Passes</th>
              </tr>
            </thead>
            <tbody>
              {topAssists.map((p,i) => (
                <tr key={i} className={`border-b transition-colors ${i===0?"bg-yellow-50 font-bold":i%2===0?"bg-gray-50/60":""}`}>
                  <td className="p-3 text-center font-extrabold text-lg">{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</td>
                  <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                  <td className="p-3 text-center font-extrabold text-purple-700 text-xl">{p.assists}</td>
                </tr>
              ))}
              {topAssists.length === 0 && (
                <tr><td colSpan="3" className="text-center text-gray-400 p-10">Aucune passe enregistrée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
