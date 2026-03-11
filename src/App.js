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

// ================= FLOATING BACK BUTTON =================
const FloatingBackButton = ({ onBack }) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Apparaît après un court délai dès l'entrée dans la page
    const timer = setTimeout(() => setVisible(true), 300);
    // Se cache quand l'utilisateur revient tout en haut
    const handleScroll = () => {
      setVisible(window.scrollY <= 80 ? false : true);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      onClick={onBack}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Retour à l'accueil"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "20px",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.85)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease, transform 0.3s ease, background 0.2s ease, box-shadow 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: hovered
          ? "linear-gradient(135deg, #172554 0%, #1e40af 100%)"
          : "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
        color: "#ffffff",
        border: "none",
        borderRadius: "999px",
        padding: "12px 20px",
        fontWeight: "800",
        fontSize: "13px",
        boxShadow: hovered
          ? "0 6px 28px rgba(30,58,138,0.55), 0 2px 6px rgba(0,0,0,0.2)"
          : "0 4px 20px rgba(30,58,138,0.45), 0 1px 4px rgba(0,0,0,0.15)",
        cursor: "pointer",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: "16px", lineHeight: 1 }}>🏠</span>
      Accueil
    </button>
  );
};

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

  // Reset scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

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

  // ---- Classement ----
  // Fonction H2H : points de teamA contre teamB en confrontation directe
  const getH2HPoints = (teamA, teamB) => {
    let ptsA=0, ptsB=0;
    matches.forEach(m => {
      const a=parseInt(m.scoreA)||0, b=parseInt(m.scoreB)||0;
      if(m.scoreA===""||m.scoreB==="") return;
      if(m.equipeA===teamA && m.equipeB===teamB){ if(a>b) ptsA+=3; else if(a===b) { ptsA+=1; ptsB+=1; } else ptsB+=3; }
      if(m.equipeA===teamB && m.equipeB===teamA){ if(a>b) ptsB+=3; else if(a===b) { ptsA+=1; ptsB+=1; } else ptsA+=3; }
    });
    return ptsA - ptsB;
  };

  const classement = TEAMS.map(team => {
    let points=0,bm=0,be=0,cj=0,cr=0,mj=0;
    matches.forEach(m => {
      const a=parseInt(m.scoreA)||0, b=parseInt(m.scoreB)||0;
      if(m.equipeA===team){ if(m.scoreA!==""&&m.scoreB!=="") mj++; if(a>b) points+=3; else if(a===b&&m.scoreA!=="") points+=1; bm+=a;be+=b;cj+=m.jaunesA.length;cr+=m.rougesA.length; }
      if(m.equipeB===team){ if(m.scoreA!==""&&m.scoreB!=="") mj++; if(b>a) points+=3; else if(a===b&&m.scoreA!=="") points+=1; bm+=b;be+=a;cj+=m.jaunesB.length;cr+=m.rougesB.length; }
    });
    return {team,mj,points,bm,be,diff:bm-be,cj,cr};
  }).sort((a,b) => {
    if(b.points !== a.points) return b.points - a.points;
    if(b.diff   !== a.diff)   return b.diff   - a.diff;
    if(b.bm     !== a.bm)     return b.bm     - a.bm;
    const h2h = getH2HPoints(a.team, b.team);
    if(h2h !== 0) return -h2h;
    if(a.cr !== b.cr) return a.cr - b.cr;
    return a.cj - b.cj;
  });

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
                  <th className="p-3">B</th>
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
                    <td className="p-3">{c.bm}/{c.be}</td>
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

      {/* ✅ Bouton flottant retour accueil */}
      <FloatingBackButton onBack={() => { setEditingOrder(false); setPage("home"); }} />
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
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6">
            <div className="font-bold text-orange-700 mb-3 text-sm">✏️ Saisir les équipes des demi-finales</div>
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

        <FinaleMatchCard label="Demi-finale 1 — 1er vs 4ème" equipeA={team1} equipeB={team4}
          match={finaleMatches[0]} isAdmin={isAdmin} matchIndex={0}
          onChangeScore={handleFinaleScore} onChangeMeta={handleFinaleMeta}
          onAddPlayer={addFinalePlayer} onUpdatePlayer={updateFinalePlayer} onRemovePlayer={removeFinalePlayer}/>

        <FinaleMatchCard label="Demi-finale 2 — 2ème vs 3ème" equipeA={team2} equipeB={team3}
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

      {/* ✅ Bouton flottant retour accueil */}
      <FloatingBackButton onBack={() => setPage("home")} />
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

      {/* ✅ Bouton flottant retour accueil */}
      <FloatingBackButton onBack={() => setPage("home")} />
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

      {/* ✅ Bouton flottant retour accueil */}
      <FloatingBackButton onBack={() => setPage("home")} />
    </div>
  );
}

export default App;
