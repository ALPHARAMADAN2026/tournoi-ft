import { useState } from "react";

function App() {
  // Admin
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    if (adminPassword === "admin123") setIsAdmin(true);
    else alert("Mot de passe incorrect !");
  };

  // Équipes
  const [teams] = useState(["BCAS","3DIR","3ESC","2ESC","2DIR","1BIE","DCS"]);

  // Matchs pré-remplis
  const [matches, setMatches] = useState([
    { date:"", equipeA:"BCAS", equipeB:"3DIR", scoreA:"", scoreB:"", terrain:"", arbitre:"",
      jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[] },
    { date:"", equipeA:"2ESC", equipeB:"3ESC", scoreA:"", scoreB:"", terrain:"", arbitre:"",
      jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[] },
    { date:"", equipeA:"2DIR", equipeB:"1BIE", scoreA:"", scoreB:"", terrain:"", arbitre:"",
      jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[] },
    { date:"", equipeA:"DCS", equipeB:"3DIR", scoreA:"", scoreB:"", terrain:"", arbitre:"",
      jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[] },
    { date:"", equipeA:"BCAS", equipeB:"3ESC", scoreA:"", scoreB:"", terrain:"", arbitre:"",
      jaunesA:[], jaunesB:[], rougesA:[], rougesB:[], buteurs:[], passes:[] },
  ]);

  // Règles
  const [regles, setRegles] = useState("Victoire = 3 pts, Égalité = 1 pt, Défaite = 0 pts. Demi-finale : tirs au but si égalité.");

  // Modifier un champ simple
  const handleMatchChange = (i, field, value) => {
    const newMatches = [...matches];
    newMatches[i][field] = value;
    setMatches(newMatches);
  };

  // Modifier une liste (buteurs, passes, cartons)
  const handleListChange = (i, field, value) => {
    const newMatches = [...matches];
    newMatches[i][field] = value.split(","); // séparer par virgule
    setMatches(newMatches);
  };

  // Calcul points
  const calcPoints = (m) => {
    const a=parseInt(m.scoreA)||0; const b=parseInt(m.scoreB)||0;
    if(a>b) return [3,0]; if(a<b) return [0,3]; return [1,1];
  };

  // Classement des équipes avec nombre de matchs joués
  const classement = teams.map(team=>{
    let points=0, butsMarques=0, butsEncaisse=0, matchsJoues=0;
    matches.forEach(m=>{
      const a=parseInt(m.scoreA); const b=parseInt(m.scoreB);
      if((m.equipeA===team || m.equipeB===team) && (!isNaN(a) || !isNaN(b))) matchsJoues++;
      if(m.equipeA===team){ points+=calcPoints(m)[0]; butsMarques+=a||0; butsEncaisse+=b||0; }
      else if(m.equipeB===team){ points+=calcPoints(m)[1]; butsMarques+=b||0; butsEncaisse+=a||0; }
    });
    return {team, points, butsMarques, butsEncaisse, diff:butsMarques-butsEncaisse, matchsJoues};
  }).sort((a,b)=>b.points - a.points || b.diff - a.diff || b.butsMarques - a.butsMarques);

  // Classement des buteurs
  const buteursClassement = (() => {
    const tally = {};
    matches.forEach(m => {
      m.buteurs.forEach(player => {
        if (player.trim() !== "") tally[player] = (tally[player] || 0) + 1;
      });
    });
    return Object.entries(tally).map(([player,buts]) => ({player,buts}))
      .sort((a,b)=>b.buts - a.buts);
  })();

  // Classement des passeurs
  const passesClassement = (() => {
    const tally = {};
    matches.forEach(m => {
      m.passes.forEach(player => {
        if (player.trim() !== "") tally[player] = (tally[player] || 0) + 1;
      });
    });
    return Object.entries(tally).map(([player,passes]) => ({player,passes}))
      .sort((a,b)=>b.passes - a.passes);
  })();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Tournoi Football 7 Équipes</h1>

      {!isAdmin && (
        <div className="mb-6 text-center">
          <input type="password" placeholder="Mot de passe admin" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} className="border p-2 rounded mr-2"/>
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Se connecter</button>
        </div>
      )}

      {/* Page règles */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Règles du tournoi</h2>
        {isAdmin ? (
          <textarea value={regles} onChange={e=>setRegles(e.target.value)} className="w-full h-32 p-2 border rounded"/>
        ) : (
          <p className="p-2 border rounded bg-white">{regles}</p>
        )}
      </div>

      {/* Calendrier des matchs */}
      <div className="mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-2">Calendrier des matchs</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-300 text-center">
              <th>Date</th><th>Équipe A</th><th>Score A</th><th>Score B</th><th>Équipe B</th>
              <th>Terrain</th><th>Arbitre</th><th>Jaunes A</th><th>Jaunes B</th>
              <th>Rouges A</th><th>Rouges B</th><th>Buteurs</th><th>Passes Décisives</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m,i)=>(
              <tr key={i} className="text-center border">
                <td>{isAdmin?<input type="date" value={m.date} onChange={e=>handleMatchChange(i,"date",e.target.value)} className="p-1 border rounded"/>:m.date}</td>
                <td>{m.equipeA}</td>
                <td>{isAdmin?<input type="number" value={m.scoreA} onChange={e=>handleMatchChange(i,"scoreA",e.target.value)} className="w-16 p-1 border rounded"/>:m.scoreA}</td>
                <td>{isAdmin?<input type="number" value={m.scoreB} onChange={e=>handleMatchChange(i,"scoreB",e.target.value)} className="w-16 p-1 border rounded"/>:m.scoreB}</td>
                <td>{m.equipeB}</td>
                <td>{isAdmin?<input type="text" value={m.terrain} onChange={e=>handleMatchChange(i,"terrain",e.target.value)} className="w-32 p-1 border rounded"/>:m.terrain}</td>
                <td>{isAdmin?<input type="text" value={m.arbitre} onChange={e=>handleMatchChange(i,"arbitre",e.target.value)} className="w-32 p-1 border rounded"/>:m.arbitre}</td>
                <td>{isAdmin?<input type="text" value={m.jaunesA.join(",")} onChange={e=>handleListChange(i,"jaunesA",e.target.value)} className="w-32 p-1 border rounded"/>:m.jaunesA.join(",")}</td>
                <td>{isAdmin?<input type="text" value={m.jaunesB.join(",")} onChange={e=>handleListChange(i,"jaunesB",e.target.value)} className="w-32 p-1 border rounded"/>:m.jaunesB.join(",")}</td>
                <td>{isAdmin?<input type="text" value={m.rougesA.join(",")} onChange={e=>handleListChange(i,"rougesA",e.target.value)} className="w-32 p-1 border rounded"/>:m.rougesA.join(",")}</td>
                <td>{isAdmin?<input type="text" value={m.rougesB.join(",")} onChange={e=>handleListChange(i,"rougesB",e.target.value)} className="w-32 p-1 border rounded"/>:m.rougesB.join(",")}</td>

                {/* Buteurs multiples */}
                <td className="p-1">
                  {isAdmin ? (
                    <div className="flex flex-col items-start">
                      {m.buteurs.map((player, idx) => (
                        <input key={idx} type="text" value={player} placeholder={`Buteur ${idx+1}`} onChange={e=>{
                          const newMatches=[...matches];
                          newMatches[i].buteurs[idx]=e.target.value;
                          setMatches(newMatches);
                        }} className="w-32 p-1 border rounded mb-1"/>
                      ))}
                      <button onClick={()=>{
                        const newMatches=[...matches];
                        newMatches[i].buteurs.push("");
                        setMatches(newMatches);
                      }} className="bg-green-500 text-white px-2 py-1 rounded text-sm">Ajouter un buteur</button>
                    </div>
                  ) : <div>{m.buteurs.join(", ")}</div>}
                </td>

                {/* Passes multiples */}
                <td className="p-1">
                  {isAdmin ? (
                    <div className="flex flex-col items-start">
                      {m.passes.map((player, idx) => (
                        <input key={idx} type="text" value={player} placeholder={`Passe ${idx+1}`} onChange={e=>{
                          const newMatches=[...matches];
                          newMatches[i].passes[idx]=e.target.value;
                          setMatches(newMatches);
                        }} className="w-32 p-1 border rounded mb-1"/>
                      ))}
                      <button onClick={()=>{
                        const newMatches=[...matches];
                        newMatches[i].passes.push("");
                        setMatches(newMatches);
                      }} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Ajouter une passe</button>
                    </div>
                  ) : <div>{m.passes.join(", ")}</div>}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Classement équipes */}
      <div className="mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-2">Classement des équipes</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-300 text-center">
              <th>Position</th>
              <th>Équipe</th>
              <th>MJ</th>
              <th>Points</th>
              <th>Buts Marqués</th>
              <th>Buts Encaissés</th>
              <th>Différence</th>
            </tr>
          </thead>
          <tbody>
            {classement.map((c,i)=>(
              <tr key={i} className="text-center border">
                <td>{i+1}</td>
                <td>{c.team}</td>
                <td>{c.matchsJoues}</td>
                <td>{c.points}</td>
                <td>{c.butsMarques}</td>
                <td>{c.butsEncaisse}</td>
                <td>{c.diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Classement buteurs */}
      <div className="mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-2">Classement des Buteurs</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-yellow-200 text-center">
              <th>Position</th><th>Joueur</th><th>Buts</th>
            </tr>
          </thead>
          <tbody>
            {buteursClassement.map((b,i)=>(
              <tr key={i} className="text-center border">
                <td>{i+1}</td><td>{b.player}</td><td>{b.buts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Classement passeurs */}
      <div className="mb-8 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-2">Classement des Passeurs</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-green-200 text-center">
              <th>Position</th><th>Joueur</th><th>Passes Décisives</th>
            </tr>
          </thead>
          <tbody>
            {passesClassement.map((p,i)=>(
              <tr key={i} className="text-center border">
                <td>{i+1}</td><td>{p.player}</td><td>{p.passes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
