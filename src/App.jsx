import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, Users, Newspaper, Cake, Trophy, UserPlus, CalendarDays,
  BookOpen, Phone, Lightbulb, Building2, Heart, Plus, Pencil,
  RotateCcw, UserRound, ChevronRight, Megaphone
} from "lucide-react";
import "./styles.css";

const employeesSeed = [
  { id:"1", fullName:"Sophie Carter", role:"Marketing Executive", department:"Marketing", startDate:"2023-06-12", birthdayDay:12, birthdayMonth:6, favouriteProduct:"Tomato Ketchup", status:"active" },
  { id:"2", fullName:"Tom Richardson", role:"Warehouse Supervisor", department:"Warehouse", startDate:"2014-06-12", birthdayDay:22, birthdayMonth:9, favouriteProduct:"Brown Sauce", status:"active" },
  { id:"3", fullName:"Sarah Collins", role:"Technical Manager", department:"Technical", startDate:"2021-01-18", birthdayDay:4, birthdayMonth:2, favouriteProduct:"Real Mayonnaise", status:"active" },
  { id:"4", fullName:"James Wilson", role:"Production Operative", department:"Factory", startDate:"2026-06-05", birthdayDay:19, birthdayMonth:6, favouriteProduct:"Original BBQ Sauce", status:"active" },
  { id:"5", fullName:"Amelia Brown", role:"Finance Assistant", department:"Finance", startDate:"2022-11-01", birthdayDay:12, birthdayMonth:12, favouriteProduct:"Garlic Mayonnaise", status:"active" },
  { id:"6", fullName:"Harry Clarke", role:"Maintenance Engineer", department:"Maintenance", startDate:"2019-04-03", birthdayDay:2, birthdayMonth:8, favouriteProduct:"Sweet Chilli Sauce", status:"active" }
];

const departments = ["All", "Factory", "Warehouse", "Technical", "Sales", "Marketing", "Finance", "HR", "Maintenance", "Directors"];

function formatDate(date) {
  if (!date) return "";
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
}

function yearsAtStokes(date) {
  if (!date) return 0;
  const start = new Date(date + "T00:00:00");
  const today = new Date();
  let years = today.getFullYear() - start.getFullYear();
  const before = today.getMonth() < start.getMonth() || (today.getMonth() === start.getMonth() && today.getDate() < start.getDate());
  if (before) years--;
  return Math.max(0, years);
}

function isNewStarter(date) {
  if (!date) return false;
  const days = (new Date() - new Date(date + "T00:00:00")) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 90;
}

function birthdayText(person) {
  if (!person.birthdayDay || !person.birthdayMonth) return "";
  return new Date(2026, person.birthdayMonth - 1, person.birthdayDay).toLocaleDateString("en-GB", { day:"numeric", month:"long" });
}

function Avatar({ large = false }) {
  return <div className={large ? "avatar avatarLarge" : "avatar"}><UserRound size={large ? 82 : 42} /></div>;
}

function StokesLogo() {
  return <div className="stokesLogo"><div className="logoWord">Stokes</div><div className="logoRibbon">Sauces For Food Lovers</div></div>;
}

function Home({ setPage, employees, openPerson }) {
  const active = employees.filter(e => e.status === "active");
  const newStarter = active.find(e => isNewStarter(e.startDate));
  const anniversary = active.find(e => yearsAtStokes(e.startDate) >= 5);
  const birthday = active[0];
  const [quickSearch, setQuickSearch] = useState("");

  const quickResults = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return [];
    return active.filter(e => `${e.fullName} ${e.role} ${e.department} ${e.favouriteProduct}`.toLowerCase().includes(q)).slice(0,5);
  }, [quickSearch, employees]);

  return (
    <section className="home">
      <div className="hero">
        <div className="heroTop"><StokesLogo /><span className="taste">Taste without compromise</span></div>
        <h1>Good morning 👋</h1>
        <p>Welcome to the Stokes Staff Hub.</p>
        <div className="heroSearch">
          <Search size={22} />
          <input value={quickSearch} onChange={e => setQuickSearch(e.target.value)} placeholder="Search a colleague, role or department..." />
        </div>
        {quickResults.length > 0 && (
          <div className="quickResults">
            {quickResults.map(person => (
              <button key={person.id} onClick={() => openPerson(person)}>
                <Avatar />
                <span><strong>{person.fullName}</strong><small>{person.role} · {person.department}</small></span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="today">
        <div className="sectionHeader">
          <p className="eyebrow">Today at Stokes</p>
          <h2>Little things that keep everyone connected.</h2>
        </div>
        <div className="todayList">
          <article><Cake /><div><strong>It’s {birthday.fullName.split(" ")[0]}’s birthday today!</strong><p>Favourite Stokes product: {birthday.favouriteProduct}</p></div></article>
          <article><Trophy /><div><strong>{anniversary.fullName.split(" ")[0]} celebrates {yearsAtStokes(anniversary.startDate)} years at Stokes.</strong><p>Thank you for everything you do.</p></div></article>
          <article><UserPlus /><div><strong>Welcome {newStarter?.fullName.split(" ")[0] || "James"} to the team.</strong><p>Find new starters quickly in People.</p></div></article>
          <article><Megaphone /><div><strong>Company news will appear here.</strong><p>A clean place for important updates.</p></div></article>
        </div>
      </section>

      <section className="browse">
        <div className="sectionHeader">
          <p className="eyebrow">Explore</p>
          <h2>Everything staff need, in one place.</h2>
        </div>
        <div className="browseGrid">
          <Feature icon={<Users />} title="People" onClick={() => setPage("people")} />
          <Feature icon={<Newspaper />} title="Company News" />
          <Feature icon={<Cake />} title="Birthdays" />
          <Feature icon={<Trophy />} title="Work Anniversaries" />
          <Feature icon={<UserPlus />} title="New Starters" />
          <Feature icon={<CalendarDays />} title="Events" />
          <Feature icon={<BookOpen />} title="Training" />
          <Feature icon={<Phone />} title="Useful Contacts" />
          <Feature icon={<Lightbulb />} title="Suggestions" />
        </div>
      </section>
    </section>
  );
}

function Feature({ icon, title, onClick }) {
  return <button className="feature" onClick={onClick}>{icon}<strong>{title}</strong><span>Open</span></button>;
}

function People({ employees, openPerson }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees
      .filter(e => e.status === "active")
      .filter(e => department === "All" || e.department === department)
      .filter(e => !q || `${e.fullName} ${e.role} ${e.department} ${e.favouriteProduct}`.toLowerCase().includes(q))
      .sort((a,b) => a.fullName.localeCompare(b.fullName));
  }, [query, department, employees]);

  return (
    <section>
      <div className="pageIntro">
        <p className="eyebrow">People</p>
        <h1>Find anyone in under three seconds.</h1>
        <p>If you pass someone in the car park, search their name, role or department and put a face to the name.</p>
      </div>
      <label className="searchBar"><Search size={21}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, role, department or favourite product..." /></label>
      <div className="departmentRail">
        {departments.map(d => <button key={d} className={department === d ? "active" : ""} onClick={() => setDepartment(d)}>{d}</button>)}
      </div>
      <div className="peopleGrid">
        {filtered.map(person => (
          <button className="personCard" key={person.id} onClick={() => openPerson(person)}>
            <Avatar />
            <div><h3>{person.fullName}</h3><p>{person.role}</p><span>{person.department}</span></div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProfileModal({ person, onClose }) {
  if (!person) return null;
  return (
    <div className="modalBackground" onClick={onClose}>
      <div className="profileModal" onClick={e => e.stopPropagation()}>
        <Avatar large />
        <h2>{person.fullName}</h2>
        <p className="profileRole">{person.role}</p>
        <div className="profileFacts">
          <div><Building2 /><span>{person.department}</span></div>
          <div><CalendarDays /><span>Started {formatDate(person.startDate)}</span></div>
          <div><Trophy /><span>{yearsAtStokes(person.startDate)} years at Stokes</span></div>
          <div><Heart /><span>Favourite product: {person.favouriteProduct}</span></div>
          <div><Cake /><span>Birthday: {birthdayText(person)}</span></div>
        </div>
        <button className="primaryButton" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function Manager({ employees, setEmployees }) {
  const [view, setView] = useState("active");
  const shown = employees.filter(e => view === "active" ? e.status === "active" : e.status === "left");
  const markLeft = id => setEmployees(prev => prev.map(e => e.id === id ? {...e, status:"left"} : e));
  const restore = id => setEmployees(prev => prev.map(e => e.id === id ? {...e, status:"active"} : e));

  return (
    <section>
      <div className="pageIntro">
        <p className="eyebrow">Manager Portal</p>
        <h1>Manage the team without clutter.</h1>
        <p>Add people, edit profiles, mark employees as left, and restore former employees if they return.</p>
      </div>
      <div className="managerControls">
        <button className="primaryButton"><Plus size={18}/> Add employee</button>
        <button className={view === "active" ? "control active" : "control"} onClick={() => setView("active")}>Active</button>
        <button className={view === "left" ? "control active" : "control"} onClick={() => setView("left")}>Former employees</button>
      </div>
      <div className="managerList">
        {shown.map(person => (
          <article key={person.id} className="managerRow">
            <Avatar />
            <div><strong>{person.fullName}</strong><p>{person.role} · {person.department}</p><small>{person.favouriteProduct}</small></div>
            <div className="managerActions">
              <button><Pencil size={16}/> Edit</button>
              {person.status === "active"
                ? <button onClick={() => markLeft(person.id)}>Mark as left</button>
                : <button onClick={() => restore(person.id)}><RotateCcw size={16}/> Restore</button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaceholderPage({ title, icon, description }) {
  return <section className="placeholder"><div className="placeholderIcon">{icon}</div><p className="eyebrow">Coming soon</p><h1>{title}</h1><p>{description}</p></section>;
}

function App() {
  const [page, setPage] = useState("home");
  const [employees, setEmployees] = useState(employeesSeed);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const pages = {
    home: <Home setPage={setPage} employees={employees} openPerson={setSelectedPerson} />,
    people: <People employees={employees} openPerson={setSelectedPerson} />,
    news: <PlaceholderPage title="Company News" icon={<Newspaper />} description="A premium place for important Stokes updates, announcements and achievements." />,
    manager: <Manager employees={employees} setEmployees={setEmployees} />
  };

  return (
    <main>
      <nav className="nav">
        <button className="brandButton" onClick={() => setPage("home")}><StokesLogo /></button>
        <div className="navPill">
          <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Home</button>
          <button className={page === "people" ? "active" : ""} onClick={() => setPage("people")}>People</button>
          <button className={page === "news" ? "active" : ""} onClick={() => setPage("news")}>News</button>
          <button className={page === "manager" ? "active" : ""} onClick={() => setPage("manager")}>Manager</button>
        </div>
      </nav>
      {pages[page]}
      <ProfileModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
