import { useState } from "react";

function App() {

  // ================= ADMIN =================
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
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

  // ================= ÉQUIPES =================
  const teams = ["BCAS","3DIR","3ESC","2ESC","2DIR","1BIE","DCS"];

  // ================= MATCHES (ORDRE OPTIMISÉ) =================
  const generateMatches = () => ([
    ["BCAS","3DIR"],
    ["3ESC","2ESC"],
    ["2DIR","1BIE"],
    ["DCS","3DIR"],
    ["BCAS","3ESC"],
    ["1BIE","2ESC"], // 6e match
    ["2DIR","2ESC"],
    ["1BIE","DCS"],
    ["BCAS","2DIR"],
    ["3DIR","3ESC"],
    ["BCAS","1BIE"],
    ["3ESC","DCS"],
    ["2DIR","3DIR"],
    ["BCAS","DCS"],
    ["2ESC","3DIR"],
    ["1BIE","3ESC"],
    ["2DIR","DCS"],
    ["BCAS","2ESC"],
    ["1BIE","3DIR"],
    ["3ESC","2DIR"],
    ["DCS","2ESC"],
  ].map(([a,b])=>({
    date:"",
    equipeA:a,
    equipeB:b,
    scoreA:"",
    scoreB:"",
    jaunesA:[],
    jaunesB:[],
    rougesA:[],
    rougesB:[],
    buteurs:[],
    passes:[],
    arbitre:"",
    terrain:""
  })));

  const [matches, setMatches] = useState(generateMatches());

  // ================= MODIFICATIONS =================
  const handleChange = (i, field, value) => {
    const copy = [...matches];
    copy[i][field] = value;
    setMatches(copy);
  };

  const handleCardChange = (i, field, value) => {
    const copy = [...matches];
    copy[i][field] = Array(Number(value)).fill("x");
    setMatches(copy);
  };

  const handleCJCRInput = (i, type, value) => {
    const copy = [...matches];
    const parts = value.split("/").map(p => p.trim());
    if(parts.length === 2) {
      copy[i][type + "A"] = Array(Number(parts[0])).fill("x");
      copy[i][type + "B"] = Array(Number(parts[1])).fill("x");
      setMatches(copy);
    }
  };

  const addPlayer = (i, field) => {
    const copy = [...matches];
    copy[i][field].push("");
    setMatches(copy);
  };

  const updatePlayer = (i, field, index, value) => {
    const copy = [...matches];
    copy[i][field][index] = value;
    setMatches(copy);
  };

  // ================= CLASSEMENT =================
  const classement = teams.map(team=>{
    let points=0, bm=0, be=0, cj=0, cr=0, mj=0;

    matches.forEach(m=>{
      const a=parseInt(m.scoreA)||0;
      const b=parseInt(m.scoreB)||0;

      if(m.equipeA===team){
        if(m.scoreA!=="" && m.scoreB!=="") mj++;
        if(a>b) points+=3;
        else if(a===b && (m.scoreA!=="" && m.scoreB!=="")) points+=1;
        bm+=a; be+=b;
        cj+=m.jaunesA.length;
        cr+=m.rougesA.length;
      }
      if(m.equipeB===team){
        if(m.scoreA!=="" && m.scoreB!=="") mj++;
        if(b>a) points+=3;
        else if(a===b && (m.scoreA!=="" && m.scoreB!=="")) points+=1;
        bm+=b; be+=a;
        cj+=m.jaunesB.length;
        cr+=m.rougesB.length;
      }
    });

    return {team,mj,points,bm,be,diff:bm-be,cj,cr};
  }).sort((a,b)=>
    b.points - a.points ||
    b.diff - a.diff ||
    b.bm - a.bm ||
    a.cr - b.cr ||
    a.cj - b.cj
  );

  // ================= BUTEURS =================
  const goalStats = {};
  matches.forEach(m=>{
    m.buteurs.forEach(name=>{
      if(name) goalStats[name]=(goalStats[name]||0)+1;
    });
  });

  const topScorers = Object.entries(goalStats)
    .map(([name, goals])=>({name, goals}))
    .sort((a,b)=>b.goals-a.goals);

  // ================= PASSES =================
  const assistStats = {};
  matches.forEach(m=>{
    m.passes.forEach(name=>{
      if(name) assistStats[name]=(assistStats[name]||0)+1;
    });
  });

  const topAssists = Object.entries(assistStats)
    .map(([name, assists])=>({name, assists}))
    .sort((a,b)=>b.assists-a.assists);

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        TOURNOI OFFICIEL – 7 ÉQUIPES
      </h1>

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

      {/* CLASSEMENT DES ÉQUIPES */}
      <div className="mb-12 shadow-xl overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">
          Classement des équipes
        </h2>
        <table className="min-w-full bg-white rounded">
          <thead className="bg-gradient-to-r from-blue-900 to-blue-600 text-white">
            <tr className="text-center">
              <th>#</th><th>Équipe</th><th>MJ</th><th>Pts</th>
              <th>BM</th><th>BE</th><th>Diff</th>
              <th>CR</th><th>CJ</th>
            </tr>
          </thead>
          <tbody>
            {classement.map((c,i)=>(
              <tr key={i} className={`text-center border-b ${i===0 ? "bg-yellow-100 font-bold" : ""}`}>
                <td>{i+1}</td>
                <td>{c.team}</td>
                <td>{c.mj}</td>
                <td>{c.points}</td>
                <td>{c.bm}</td>
                <td>{c.be}</td>
                <td>{c.diff}</td>
                <td className="text-red-600 font-bold">{c.cr}</td>
                <td className="text-yellow-600 font-bold">{c.cj}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DÉTAILS DES MATCHES */}
      <div className="overflow-x-auto mb-12 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-blue-800">
          Les détails des matches (21)
        </h2>
        <table className="min-w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th>Date</th>
              <th>Match</th>
              <th>Arbitre</th>
              <th>Terrain</th>
              <th>Buteurs</th>
              <th>Passes</th>
              <th>CJ</th>
              <th>CR</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m,i)=>(
              <tr key={i} className="text-center border-b">

                <td>
                  {isAdmin ?
                    <input type="date"
                      value={m.date}
                      onChange={e=>handleChange(i,"date",e.target.value)}
                      className="border p-1"/>
                    : m.date}
                </td>

                <td className="font-semibold">
                  {m.equipeA}
                  {isAdmin ? (
                    <>
                      <input type="number"
                        value={m.scoreA}
                        onChange={e=>handleChange(i,"scoreA",e.target.value)}
                        className="w-12 mx-1 border text-center"/>
                      -
                      <input type="number"
                        value={m.scoreB}
                        onChange={e=>handleChange(i,"scoreB",e.target.value)}
                        className="w-12 mx-1 border text-center"/>
                    </>
                  ) : ` ${m.scoreA}-${m.scoreB} `}
                  {m.equipeB}
                </td>

                <td>
                  {isAdmin ? 
                    <input type="text"
                      value={m.arbitre || ""}
                      onChange={e=>handleChange(i,"arbitre",e.target.value)}
                      className="border p-1 w-32"/>
                    : m.arbitre}
                </td>

                <td>
                  {isAdmin ? 
                    <input type="text"
                      value={m.terrain || ""}
                      onChange={e=>handleChange(i,"terrain",e.target.value)}
                      className="border p-1 w-32"/>
                    : m.terrain}
                </td>

                <td>
                  {m.buteurs.map((p,index)=>(
                    <input key={index}
                      value={p}
                      onChange={e=>updatePlayer(i,"buteurs",index,e.target.value)}
                      className="border p-1 m-1 w-24"/>
                  ))}
                  {isAdmin &&
                    <button onClick={()=>addPlayer(i,"buteurs")}
                      className="bg-green-600 text-white px-2 py-1 text-xs rounded">
                      + Joueur
                    </button>}
                </td>

                <td>
                  {m.passes.map((p,index)=>(
                    <input key={index}
                      value={p}
                      onChange={e=>updatePlayer(i,"passes",index,e.target.value)}
                      className="border p-1 m-1 w-24"/>
                  ))}
                  {isAdmin &&
                    <button onClick={()=>addPlayer(i,"passes")}
                      className="bg-green-600 text-white px-2 py-1 text-xs rounded">
                      + Joueur
                    </button>}
                </td>

                <td>
                  {isAdmin ?
                    <input type="text"
                      value={`${m.jaunesA.length} / ${m.jaunesB.length}`}
                      onChange={e=>handleCJCRInput(i, "jaunes", e.target.value)}
                      className="border p-1 w-28 text-center"/>
                    : `${m.equipeA} / ${m.jaunesA.length} \n ${m.equipeB} / ${m.jaunesB.length}`}
                </td>

                <td>
                  {isAdmin ?
                    <input type="text"
                      value={`${m.rougesA.length} / ${m.rougesB.length}`}
                      onChange={e=>handleCJCRInput(i, "rouges", e.target.value)}
                      className="border p-1 w-28 text-center"/>
                    : `${m.equipeA} / ${m.rougesA.length} \n ${m.equipeB} / ${m.rougesB.length}`}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CLASSEMENT BUTEURS */}
      <div className="mb-12 shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-blue-800">
          Classement des Buteurs
        </h2>
        <table className="w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr><th>#</th><th>Joueur</th><th>Buts</th></tr>
          </thead>
          <tbody>
            {topScorers.map((p,i)=>(
              <tr key={i} className="text-center border-b">
                <td>{i+1}</td><td>{p.name}</td><td>{p.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CLASSEMENT PASSES */}
      <div className="mb-12 shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-blue-800">
          Classement des Passes Décisives
        </h2>
        <table className="w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr><th>#</th><th>Joueur</th><th>Passes</th></tr>
          </thead>
          <tbody>
            {topAssists.map((p,i)=>(
              <tr key={i} className="text-center border-b">
                <td>{i+1}</td><td>{p.name}</td><td>{p.assists}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REGLES */}
      <div className="mt-16 p-8 rounded-xl shadow-2xl bg-gradient-to-r from-blue-900 to-blue-600 text-white">
        <h2 className="text-2xl font-bold mb-4">
          Règlement Officiel du Tournoi
        </h2>
        {isAdmin ? (
          <textarea
            value={regles}
            onChange={e=>setRegles(e.target.value)}
            className="w-full p-4 rounded text-black"
          />
        ) : (
          <p className="whitespace-pre-line text-lg">{regles}</p>
        )}
      </div>

    </div>
  );
}

export default App;