import { useState, useEffect } from "react";

// ================= JSONBIN CONFIG =================
const BIN_ID = "699e472a43b1c97be99b0c93";
const API_KEY = "$2a$10$7JcGfyoAVRMxz9UCi86y5e9ioAlu66JfcC431wUHlqXgjQnFTdqj6";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const fetchData = async () => {
  const res = await fetch(BIN_URL + "/latest", {
    headers: { "X-Master-Key": API_KEY }
  });
  const json = await res.json();
  return json.record;
};

const saveData = async (data) => {
  await fetch(BIN_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY
    },
    body: JSON.stringify(data)
  });
};

// ================= COMPOSANT JOUEURS =================
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
          <input
            value={name}
            onChange={e => onUpdate(i, e.target.value)}
            placeholder="Nom du joueur"
            className="border rounded px-2 py-1 text-sm w-28 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button onClick={() => onRemove(i)}
            className="text-red-500 hover:text-red-700 font-bold text-sm px-1"
            title="Supprimer">✕</button>
        </div>
      ))}
      <button onClick={onAdd}
        className="mt-1 bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-1 rounded self-start">
        + Joueur
      </button>
    </div>
  );
};

// ================= TEAMS LIST =================
const TEAMS = ["BCAS","3DIR","3ESC","2ESC","2DIR","1BIE","DCS"];

function App() {

  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingOrder, setEditingOrder] = useState(false);

  const [regles, setRegles] = useState(
`1. Victoire = 3 points
2. Match nul = 1 point
3. Défaite = 0 point
4. En cas d'égalité : Différence > Buts marqués > Moins de cartons rouges > Moins de cartons jaunes`
  );

  const handleLogin = () => {
    if (adminPassword === "admin123") setIsAdmin(true);
    else alert("Mot de passe incorrect !");
  };

  const generateMatches = () => ([
    ["BCAS","3DIR"],["3ESC","2ESC"],["2DIR","1BIE"],["DCS","3DIR"],
    ["BCAS","3ESC"],["1BIE","2ESC"],["2DIR","2ESC"],["1BIE","DCS"],
    ["BCAS","2DIR"],["3DIR","3ESC"],["BCAS","1BIE"],["3ESC","DCS"],
    ["2DIR","3DIR"],["BCAS","DCS"],["2ESC","3DIR"],["1BIE","3ESC"],
    ["2DIR","DCS"],["BCAS","2ESC"],["1BIE","3DIR"],["3ESC","2DIR"],
    ["DCS","2ESC"],
  ].map(([a,b])=>({
    date:"", equipeA:a, equipeB:b,
    scoreA:"", scoreB:"",
    jaunesA:[], jaunesB:[],
    rougesA:[], rougesB:[],
    buteurs:[], passes:[],
    arbitre:"", terrain:""
  })));

  const [matches, setMatches] = useState(generateMatches());

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchData();
        if (data.matches && data.matches.length > 0) setMatches(data.matches);
        if (data.regles) setRegles(data.regles);
      } catch (e) {
        console.error("Erreur chargement:", e);
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async (newMatches, newRegles) => {
    setSaving(true);
    try {
      await saveData({ matches: newMatches, regles: newRegles });
    } catch (e) {
      alert("Erreur de sauvegarde !");
    }
    setSaving(false);
  };

  const handleChange = (i, field, value) => {
    const copy = [...matches];
    copy[i][field] = value;
    setMatches(copy);
    save(copy, regles);
  };

  // ================= MODIFIER ÉQUIPES DU MATCH =================
  const handleTeamChange = (i, side, value) => {
    const copy = [...matches];
    copy[i][side] = value;
    setMatches(copy);
    save(copy, regles);
  };

  // ================= DÉPLACER MATCH HAUT/BAS =================
  const moveMatch = (i, direction) => {
    const copy = [...matches];
    const target = i + direction;
    if (target < 0 || target >= copy.length) return;
    [copy[i], copy[target]] = [copy[target], copy[i]];
    setMatches(copy);
    save(copy, regles);
  };

  const handleCJCRInput = (i, type, value) => {
    const copy = [...matches];
    const parts = value.split("/").map(p => p.trim());
    if(parts.length === 2) {
      copy[i][type + "A"] = Array(Number(parts[0])).fill("x");
      copy[i][type + "B"] = Array(Number(parts[1])).fill("x");
      setMatches(copy);
      save(copy, regles);
    }
  };

  const addPlayer = (i, field) => {
    const copy = [...matches];
    copy[i][field].push("");
    setMatches(copy);
    save(copy, regles);
  };

  const updatePlayer = (i, field, index, value) => {
    const copy = [...matches];
    copy[i][field][index] = value;
    setMatches(copy);
    save(copy, regles);
  };

  const removePlayer = (i, field, index) => {
    const copy = [...matches];
    copy[i][field].splice(index, 1);
    setMatches(copy);
    save(copy, regles);
  };

  const handleReglesChange = (value) => {
    setRegles(value);
    save(matches, value);
  };

  const handleReset = async () => {
    if (window.confirm("Réinitialiser toutes les données ?")) {
      const fresh = generateMatches();
      const defaultRegles =
`1. Victoire = 3 points
2. Match nul = 1 point
3. Défaite = 0 point
4. En cas d'égalité : Différence > Buts marqués > Moins de cartons rouges > Moins de cartons jaunes`;
      setMatches(fresh);
      setRegles(defaultRegles);
      await save(fresh, defaultRegles);
    }
  };

  // ================= CLASSEMENT =================
  const classement = TEAMS.map(team=>{
    let points=0, bm=0, be=0, cj=0, cr=0, mj=0;
    matches.forEach(m=>{
      const a=parseInt(m.scoreA)||0;
      const b=parseInt(m.scoreB)||0;
      if(m.equipeA===team){
        if(m.scoreA!=="" && m.scoreB!=="") mj++;
        if(a>b) points+=3;
        else if(a===b && (m.scoreA!=="" && m.scoreB!=="")) points+=1;
        bm+=a; be+=b; cj+=m.jaunesA.length; cr+=m.rougesA.length;
      }
      if(m.equipeB===team){
        if(m.scoreA!=="" && m.scoreB!=="") mj++;
        if(b>a) points+=3;
        else if(a===b && (m.scoreA!=="" && m.scoreB!=="")) points+=1;
        bm+=b; be+=a; cj+=m.jaunesB.length; cr+=m.rougesB.length;
      }
    });
    return {team,mj,points,bm,be,diff:bm-be,cj,cr};
  }).sort((a,b)=>
    b.points-a.points || b.diff-a.diff || b.bm-a.bm || a.cr-b.cr || a.cj-b.cj
  );

  const goalStats = {};
  matches.forEach(m=>m.buteurs.forEach(name=>{ if(name) goalStats[name]=(goalStats[name]||0)+1; }));
  const topScorers = Object.entries(goalStats).map(([name,goals])=>({name,goals})).sort((a,b)=>b.goals-a.goals);

  const assistStats = {};
  matches.forEach(m=>m.passes.forEach(name=>{ if(name) assistStats[name]=(assistStats[name]||0)+1; }));
  const topAssists = Object.entries(assistStats).map(([name,assists])=>({name,assists})).sort((a,b)=>b.assists-a.assists);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="text-4xl mb-4">⚽</div>
        <p className="text-blue-900 text-xl font-bold">Chargement du tournoi...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-center mb-2 text-blue-900">
        TOURNOI OFFICIEL – 7 ÉQUIPES
      </h1>

      {saving && (
        <p className="text-center text-green-600 font-semibold mb-4 animate-pulse">
          💾 Sauvegarde en cours...
        </p>
      )}

      {!isAdmin && (
        <div className="text-center mb-8">
          <input type="password"
            placeholder="Mot de passe admin"
            onChange={e=>setAdminPassword(e.target.value)}
            className="border p-2 rounded mr-2"/>
          <button onClick={handleLogin}
            className="bg-blue-800 text-white px-4 py-2 rounded">
            Connexion
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="text-center mb-6 flex flex-wrap justify-center gap-3">
          <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-2 rounded-full">
            ✅ Mode Admin
          </span>
          <button
            onClick={() => setEditingOrder(!editingOrder)}
            className={`px-4 py-2 rounded font-semibold text-sm ${editingOrder ? "bg-orange-500 text-white" : "bg-blue-700 text-white hover:bg-blue-800"}`}>
            {editingOrder ? "✅ Terminer l'édition" : "✏️ Modifier l'ordre / équipes"}
          </button>
          <button onClick={handleReset}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm">
            🗑️ Réinitialiser
          </button>
        </div>
      )}

      {/* CLASSEMENT DES ÉQUIPES */}
      <div className="mb-12 shadow-xl overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Classement des équipes</h2>
        <table className="min-w-full bg-white rounded">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr className="text-center">
              <th className="p-2">#</th>
              <th className="p-2">Équipe</th>
              <th className="p-2">MJ</th>
              <th className="p-2">Pts</th>
              <th className="p-2">BM</th>
              <th className="p-2">BE</th>
              <th className="p-2">Diff</th>
              <th className="p-2">CR</th>
              <th className="p-2">CJ</th>
            </tr>
          </thead>
          <tbody>
            {classement.map((c,i)=>(
              <tr key={i} className={`text-center border-b ${i===0 ? "bg-yellow-100 font-bold" : ""}`}>
                <td className="p-2">{i+1}</td>
                <td className="p-2 font-semibold">{c.team}</td>
                <td className="p-2">{c.mj}</td>
                <td className="p-2 font-bold text-blue-900">{c.points}</td>
                <td className="p-2">{c.bm}</td>
                <td className="p-2">{c.be}</td>
                <td className="p-2">{c.diff}</td>
                <td className="p-2 text-red-600 font-bold">{c.cr}</td>
                <td className="p-2 text-yellow-600 font-bold">{c.cj}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DÉTAILS DES MATCHES */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Les détails des matches (21)</h2>

        {/* ===== VERSION MOBILE : CARTES ===== */}
        <div className="block md:hidden space-y-4">
          {matches.map((m,i)=>(
            <div key={i} className={`bg-white rounded-xl shadow-md p-4 border ${editingOrder ? "border-orange-300" : "border-gray-200"}`}>

              {/* HEADER CARTE */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-semibold">Match {i+1}</span>
                {/* BOUTONS ORDRE */}
                {editingOrder && (
                  <div className="flex gap-1">
                    <button onClick={()=>moveMatch(i,-1)} disabled={i===0}
                      className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-gray-700 font-bold px-2 py-1 rounded text-xs">
                      ▲
                    </button>
                    <button onClick={()=>moveMatch(i,1)} disabled={i===matches.length-1}
                      className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-gray-700 font-bold px-2 py-1 rounded text-xs">
                      ▼
                    </button>
                  </div>
                )}
              </div>

              {/* SCORE / ÉQUIPES */}
              <div className="flex items-center justify-center gap-2 mb-3 bg-blue-50 rounded-lg p-2">
                {editingOrder ? (
                  <select value={m.equipeA}
                    onChange={e=>handleTeamChange(i,"equipeA",e.target.value)}
                    className="border rounded px-1 py-1 text-sm font-bold text-blue-900 bg-white">
                    {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <span className="font-bold text-blue-900">{m.equipeA}</span>
                )}

                {isAdmin && !editingOrder ? (
                  <div className="flex items-center gap-1">
                    <input type="number" value={m.scoreA}
                      onChange={e=>handleChange(i,"scoreA",e.target.value)}
                      className="w-10 border rounded text-center font-bold"/>
                    <span className="font-bold">-</span>
                    <input type="number" value={m.scoreB}
                      onChange={e=>handleChange(i,"scoreB",e.target.value)}
                      className="w-10 border rounded text-center font-bold"/>
                  </div>
                ) : !editingOrder ? (
                  <span className="font-bold text-gray-700 px-2">
                    {m.scoreA !== "" ? `${m.scoreA} - ${m.scoreB}` : "— vs —"}
                  </span>
                ) : (
                  <span className="font-bold text-gray-400 px-2">vs</span>
                )}

                {editingOrder ? (
                  <select value={m.equipeB}
                    onChange={e=>handleTeamChange(i,"equipeB",e.target.value)}
                    className="border rounded px-1 py-1 text-sm font-bold text-blue-900 bg-white">
                    {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <span className="font-bold text-blue-900">{m.equipeB}</span>
                )}
              </div>

              {!editingOrder && (<>
              {/* INFOS */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-semibold uppercase">📅 Date</span>
                  {isAdmin ? (
                    <input type="date" value={m.date}
                      onChange={e=>handleChange(i,"date",e.target.value)}
                      className="border rounded p-1 text-sm mt-1"/>
                  ) : <span className="text-gray-700 mt-1">{m.date || "—"}</span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-semibold uppercase">🏟️ Terrain</span>
                  {isAdmin ? (
                    <input type="text" value={m.terrain || ""} placeholder="Terrain"
                      onChange={e=>handleChange(i,"terrain",e.target.value)}
                      className="border rounded p-1 text-sm mt-1 w-full"/>
                  ) : <span className="text-gray-700 mt-1">{m.terrain || "—"}</span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-semibold uppercase">🟨 Arbitre</span>
                  {isAdmin ? (
                    <input type="text" value={m.arbitre || ""} placeholder="Arbitre"
                      onChange={e=>handleChange(i,"arbitre",e.target.value)}
                      className="border rounded p-1 text-sm mt-1 w-full"/>
                  ) : <span className="text-gray-700 mt-1">{m.arbitre || "—"}</span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-semibold uppercase">Cartons</span>
                  <div className="flex gap-3 mt-1">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-yellow-600 font-bold">CJ</span>
                      {isAdmin ? (
                        <input type="text"
                          value={`${m.jaunesA.length} / ${m.jaunesB.length}`}
                          onChange={e=>handleCJCRInput(i,"jaunes",e.target.value)}
                          className="border rounded p-1 w-16 text-center text-sm"/>
                      ) : <span className="text-yellow-600 font-bold">{m.jaunesA.length} / {m.jaunesB.length}</span>}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-red-600 font-bold">CR</span>
                      {isAdmin ? (
                        <input type="text"
                          value={`${m.rougesA.length} / ${m.rougesB.length}`}
                          onChange={e=>handleCJCRInput(i,"rouges",e.target.value)}
                          className="border rounded p-1 w-16 text-center text-sm"/>
                      ) : <span className="text-red-600 font-bold">{m.rougesA.length} / {m.rougesB.length}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">⚽ Buteurs</span>
                <JoueursField list={m.buteurs}
                  onAdd={()=>addPlayer(i,"buteurs")}
                  onUpdate={(idx,val)=>updatePlayer(i,"buteurs",idx,val)}
                  onRemove={(idx)=>removePlayer(i,"buteurs",idx)}
                  isAdmin={isAdmin} icon="⚽"/>
              </div>
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">🎯 Passes décisives</span>
                <JoueursField list={m.passes}
                  onAdd={()=>addPlayer(i,"passes")}
                  onUpdate={(idx,val)=>updatePlayer(i,"passes",idx,val)}
                  onRemove={(idx)=>removePlayer(i,"passes",idx)}
                  isAdmin={isAdmin} icon="🎯"/>
              </div>
              </>)}

            </div>
          ))}
        </div>

        {/* ===== VERSION PC : TABLEAU ===== */}
        <div className="hidden md:block overflow-x-auto shadow-xl">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-900 text-white">
              <tr>
                {editingOrder && <th className="p-2">Ordre</th>}
                <th className="p-2">#</th>
                <th className="p-2">Match</th>
                {!editingOrder && <>
                  <th className="p-2">Date</th>
                  <th className="p-2">Arbitre</th>
                  <th className="p-2">Terrain</th>
                  <th className="p-2">Buteurs</th>
                  <th className="p-2">Passes</th>
                  <th className="p-2">CJ</th>
                  <th className="p-2">CR</th>
                </>}
              </tr>
            </thead>
            <tbody>
              {matches.map((m,i)=>(
                <tr key={i} className={`border-b align-top ${editingOrder ? "bg-orange-50" : ""}`}>

                  {/* BOUTONS ORDRE PC */}
                  {editingOrder && (
                    <td className="p-2 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <button onClick={()=>moveMatch(i,-1)} disabled={i===0}
                          className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-gray-700 font-bold px-3 py-1 rounded text-xs w-full">
                          ▲
                        </button>
                        <button onClick={()=>moveMatch(i,1)} disabled={i===matches.length-1}
                          className="bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-gray-700 font-bold px-3 py-1 rounded text-xs w-full">
                          ▼
                        </button>
                      </div>
                    </td>
                  )}

                  <td className="p-2 text-center font-bold text-gray-500">{i+1}</td>

                  {/* MATCH : équipes modifiables si editingOrder */}
                  <td className="p-2 text-center font-semibold">
                    {editingOrder ? (
                      <div className="flex items-center justify-center gap-2">
                        <select value={m.equipeA}
                          onChange={e=>handleTeamChange(i,"equipeA",e.target.value)}
                          className="border rounded px-2 py-1 text-sm font-bold text-blue-900 bg-white">
                          {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="text-gray-400 font-bold">vs</span>
                        <select value={m.equipeB}
                          onChange={e=>handleTeamChange(i,"equipeB",e.target.value)}
                          className="border rounded px-2 py-1 text-sm font-bold text-blue-900 bg-white">
                          {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    ) : (
                      <>
                        {m.equipeA}
                        {isAdmin ? (
                          <>
                            <input type="number" value={m.scoreA}
                              onChange={e=>handleChange(i,"scoreA",e.target.value)}
                              className="w-12 mx-1 border text-center"/>
                            -
                            <input type="number" value={m.scoreB}
                              onChange={e=>handleChange(i,"scoreB",e.target.value)}
                              className="w-12 mx-1 border text-center"/>
                          </>
                        ) : ` ${m.scoreA !== "" ? m.scoreA : "—"} - ${m.scoreB !== "" ? m.scoreB : "—"} `}
                        {m.equipeB}
                      </>
                    )}
                  </td>

                  {!editingOrder && <>
                    <td className="p-2 text-center">
                      {isAdmin ?
                        <input type="date" value={m.date}
                          onChange={e=>handleChange(i,"date",e.target.value)}
                          className="border p-1 text-sm"/>
                        : <span className="text-sm">{m.date || "—"}</span>}
                    </td>
                    <td className="p-2 text-center">
                      {isAdmin ?
                        <input type="text" value={m.arbitre || ""}
                          onChange={e=>handleChange(i,"arbitre",e.target.value)}
                          className="border p-1 w-28 text-sm"/>
                        : <span className="text-sm">{m.arbitre || "—"}</span>}
                    </td>
                    <td className="p-2 text-center">
                      {isAdmin ?
                        <input type="text" value={m.terrain || ""}
                          onChange={e=>handleChange(i,"terrain",e.target.value)}
                          className="border p-1 w-28 text-sm"/>
                        : <span className="text-sm">{m.terrain || "—"}</span>}
                    </td>
                    <td className="p-2">
                      <JoueursField list={m.buteurs}
                        onAdd={()=>addPlayer(i,"buteurs")}
                        onUpdate={(idx,val)=>updatePlayer(i,"buteurs",idx,val)}
                        onRemove={(idx)=>removePlayer(i,"buteurs",idx)}
                        isAdmin={isAdmin} icon="⚽"/>
                    </td>
                    <td className="p-2">
                      <JoueursField list={m.passes}
                        onAdd={()=>addPlayer(i,"passes")}
                        onUpdate={(idx,val)=>updatePlayer(i,"passes",idx,val)}
                        onRemove={(idx)=>removePlayer(i,"passes",idx)}
                        isAdmin={isAdmin} icon="🎯"/>
                    </td>
                    <td className="p-2 text-center text-yellow-600 font-bold">
                      {isAdmin ?
                        <input type="text"
                          value={`${m.jaunesA.length} / ${m.jaunesB.length}`}
                          onChange={e=>handleCJCRInput(i,"jaunes",e.target.value)}
                          className="border p-1 w-20 text-center text-sm"/>
                        : `${m.jaunesA.length} / ${m.jaunesB.length}`}
                    </td>
                    <td className="p-2 text-center text-red-600 font-bold">
                      {isAdmin ?
                        <input type="text"
                          value={`${m.rougesA.length} / ${m.rougesB.length}`}
                          onChange={e=>handleCJCRInput(i,"rouges",e.target.value)}
                          className="border p-1 w-20 text-center text-sm"/>
                        : `${m.rougesA.length} / ${m.rougesB.length}`}
                    </td>
                  </>}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CLASSEMENT BUTEURS */}
      <div className="mb-12 shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-blue-800">Classement des Buteurs</h2>
        <table className="w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr><th className="p-2">#</th><th className="p-2">Joueur</th><th className="p-2">Buts</th></tr>
          </thead>
          <tbody>
            {topScorers.map((p,i)=>(
              <tr key={i} className="text-center border-b">
                <td className="p-2">{i+1}</td>
                <td className="p-2 font-semibold">{p.name}</td>
                <td className="p-2 font-bold text-blue-900">{p.goals}</td>
              </tr>
            ))}
            {topScorers.length === 0 && (
              <tr><td colSpan="3" className="text-center text-gray-400 p-4">Aucun buteur enregistré</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CLASSEMENT PASSES */}
      <div className="mb-12 shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-blue-800">Classement des Passes Décisives</h2>
        <table className="w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr><th className="p-2">#</th><th className="p-2">Joueur</th><th className="p-2">Passes</th></tr>
          </thead>
          <tbody>
            {topAssists.map((p,i)=>(
              <tr key={i} className="text-center border-b">
                <td className="p-2">{i+1}</td>
                <td className="p-2 font-semibold">{p.name}</td>
                <td className="p-2 font-bold text-blue-900">{p.assists}</td>
              </tr>
            ))}
            {topAssists.length === 0 && (
              <tr><td colSpan="3" className="text-center text-gray-400 p-4">Aucune passe enregistrée</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* REGLES */}
      <div className="mt-16 p-8 rounded-xl shadow-2xl bg-gradient-to-r from-blue-900 to-blue-600 text-white">
        <h2 className="text-2xl font-bold mb-4">Règlement Officiel du Tournoi</h2>
        {isAdmin ? (
          <textarea value={regles}
            onChange={e=>handleReglesChange(e.target.value)}
            className="w-full p-4 rounded text-black"/>
        ) : (
          <p className="whitespace-pre-line text-lg">{regles}</p>
        )}
      </div>

    </div>
  );
}

export default App;
