import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, Users, Newspaper, Cake, Trophy, UserPlus, CalendarDays,
  BookOpen, Phone, Lightbulb, Building2, Heart, Plus, Pencil,
  RotateCcw, UserRound, ChevronRight, Megaphone, Save, X
} from "lucide-react";
import { supabase } from "./supabaseClient";
import "./styles.css";

const departments = ["Factory", "Warehouse", "Technical", "Sales", "Marketing", "Finance", "HR", "Maintenance", "Directors"];
const departmentFilters = ["All", ...departments];
const products = ["Tomato Ketchup", "Brown Sauce", "Original BBQ Sauce", "Real Mayonnaise", "Garlic Mayonnaise", "Sweet Chilli Sauce", "Sticky Pickle", "Burger Relish"];

const fallbackEmployees = [
  { id:"demo-1", full_name:"Sophie Carter", role:"Marketing Executive", department:"Marketing", start_date:"2023-06-12", birthday_day:12, birthday_month:6, birthday_year:null, favourite_product:"Tomato Ketchup", status:"active", use_default_icon:true },
  { id:"demo-2", full_name:"Tom Richardson", role:"Warehouse Supervisor", department:"Warehouse", start_date:"2014-06-12", birthday_day:22, birthday_month:9, birthday_year:null, favourite_product:"Brown Sauce", status:"active", use_default_icon:true },
  { id:"demo-3", full_name:"Sarah Collins", role:"Technical Manager", department:"Technical", start_date:"2021-01-18", birthday_day:4, birthday_month:2, birthday_year:null, favourite_product:"Real Mayonnaise", status:"active", use_default_icon:true },
  { id:"demo-4", full_name:"James Wilson", role:"Production Operative", department:"Factory", start_date:"2026-06-05", birthday_day:19, birthday_month:6, birthday_year:null, favourite_product:"Original BBQ Sauce", status:"active", use_default_icon:true }
];

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
  if (!person?.birthday_day || !person?.birthday_month) return "Not set";
  const dayMonth = new Date(2026, person.birthday_month - 1, person.birthday_day).toLocaleDateString("en-GB", { day:"numeric", month:"long" });
  return person.birthday_year ? `${dayMonth} ${person.birthday_year}` : dayMonth;
}

function Avatar({ large = false }) {
  return <div className={large ? "avatar avatarLarge" : "avatar"}><UserRound size={large ? 82 : 42} /></div>;
}

function StokesLogo() {
  return <div className="stokesLogo"><div className="logoWord">Stokes</div><div className="logoRibbon">Sauces For Food Lovers</div></div>;
}

function EmptyState({ title, text }) {
  return <div className="empty"><strong>{title}</strong><p>{text}</p></div>;
}

function Home({ setPage, employees, news, openPerson }) {
  const active = employees.filter(e => e.status === "active");
  const newStarter = active.find(e => isNewStarter(e.start_date));
  const anniversary = active.find(e => yearsAtStokes(e.start_date) >= 5);
  const birthday = active.find(e => e.birthday_day) || active[0];
  const [quickSearch, setQuickSearch] = useState("");

  const quickResults = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return [];
    return active.filter(e => `${e.full_name} ${e.role} ${e.department} ${e.favourite_product || ""}`.toLowerCase().includes(q)).slice(0,5);
  }, [quickSearch, active]);

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
                <span><strong>{person.full_name}</strong><small>{person.role} · {person.department}</small></span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        )}
      </div>

      <section className="today">
        <div className="sectionHeader"><p className="eyebrow">Today at Stokes</p><h2>Little things that keep everyone connected.</h2></div>
        <div className="todayList">
          {birthday && <article><Cake /><div><strong>It’s {birthday.full_name.split(" ")[0]}’s birthday today!</strong><p>Favourite Stokes product: {birthday.favourite_product || "Not set yet"}</p></div></article>}
          {anniversary && <article><Trophy /><div><strong>{anniversary.full_name.split(" ")[0]} celebrates {yearsAtStokes(anniversary.start_date)} years at Stokes.</strong><p>Thank you for everything you do.</p></div></article>}
          {newStarter && <article><UserPlus /><div><strong>Welcome {newStarter.full_name.split(" ")[0]} to the team.</strong><p>Find new starters quickly in People.</p></div></article>}
          <article><Megaphone /><div><strong>{news[0]?.title || "Company news will appear here."}</strong><p>{news[0]?.body || "A clean place for important updates."}</p></div></article>
        </div>
      </section>

      <section className="browse">
        <div className="sectionHeader"><p className="eyebrow">Explore</p><h2>Everything staff need, in one place.</h2></div>
        <div className="browseGrid">
          <Feature icon={<Users />} title="People" onClick={() => setPage("people")} />
          <Feature icon={<Newspaper />} title="Company News" onClick={() => setPage("news")} />
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
      .filter(e => !q || `${e.full_name} ${e.role} ${e.department} ${e.favourite_product || ""}`.toLowerCase().includes(q))
      .sort((a,b) => a.full_name.localeCompare(b.full_name));
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
        {departmentFilters.map(d => <button key={d} className={department === d ? "active" : ""} onClick={() => setDepartment(d)}>{d}</button>)}
      </div>
      <div className="peopleGrid">
        {filtered.map(person => (
          <button className="personCard" key={person.id} onClick={() => openPerson(person)}>
            <Avatar />
            <div><h3>{person.full_name}</h3><p>{person.role}</p><span>{person.department}</span></div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && <EmptyState title="No people found" text="Try a different search or department." />}
    </section>
  );
}

function News({ news }) {
  return (
    <section>
      <div className="pageIntro">
        <p className="eyebrow">Company News</p>
        <h1>Updates from around Stokes.</h1>
        <p>Company news, announcements and important staff updates will live here.</p>
      </div>
      <div className="newsGrid">
        {news.map(item => (
          <article className="newsCard" key={item.id}>
            <p className="eyebrow">News</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      {news.length === 0 && <EmptyState title="No news yet" text="Managers can add company news from the Manager Portal." />}
    </section>
  );
}

function ProfileModal({ person, onClose }) {
  if (!person) return null;
  return (
    <div className="modalBackground" onClick={onClose}>
      <div className="profileModal" onClick={e => e.stopPropagation()}>
        <Avatar large />
        <h2>{person.full_name}</h2>
        <p className="profileRole">{person.role}</p>
        <div className="profileFacts">
          <div><Building2 /><span>{person.department}</span></div>
          <div><CalendarDays /><span>Started {formatDate(person.start_date)}</span></div>
          <div><Trophy /><span>{yearsAtStokes(person.start_date)} years at Stokes</span></div>
          <div><Heart /><span>Favourite product: {person.favourite_product || "Not set"}</span></div>
          <div><Cake /><span>Birthday: {birthdayText(person)}</span></div>
        </div>
        <button className="primaryButton" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function EmployeeForm({ employee, onSave, onCancel }) {
  const [form, setForm] = useState(employee || {
    full_name:"", role:"", department:"Factory", start_date:"",
    favourite_product:"Tomato Ketchup", birthday_day:"", birthday_month:"", birthday_year:"",
    status:"active", use_default_icon:true
  });

  function update(key, value) { setForm(prev => ({ ...prev, [key]: value })); }

  function submit(e) {
    e.preventDefault();
    onSave({
      ...form,
      birthday_day: form.birthday_day ? Number(form.birthday_day) : null,
      birthday_month: form.birthday_month ? Number(form.birthday_month) : null,
      birthday_year: form.birthday_year ? Number(form.birthday_year) : null,
      use_default_icon: true
    });
  }

  return (
    <form className="editorForm" onSubmit={submit}>
      <div className="formTop"><h2>{employee ? "Edit employee" : "Add employee"}</h2><button type="button" onClick={onCancel}><X size={18}/></button></div>
      <input required placeholder="Full name" value={form.full_name || ""} onChange={e => update("full_name", e.target.value)} />
      <input required placeholder="Role" value={form.role || ""} onChange={e => update("role", e.target.value)} />
      <select value={form.department || "Factory"} onChange={e => update("department", e.target.value)}>{departments.map(d => <option key={d}>{d}</option>)}</select>
      <label>Start date<input required type="date" value={form.start_date || ""} onChange={e => update("start_date", e.target.value)} /></label>
      <select value={form.favourite_product || "Tomato Ketchup"} onChange={e => update("favourite_product", e.target.value)}>{products.map(p => <option key={p}>{p}</option>)}</select>
      <div className="threeCols">
        <input type="number" min="1" max="31" placeholder="Birthday day" value={form.birthday_day || ""} onChange={e => update("birthday_day", e.target.value)} />
        <input type="number" min="1" max="12" placeholder="Month" value={form.birthday_month || ""} onChange={e => update("birthday_month", e.target.value)} />
        <input type="number" min="1900" max="2100" placeholder="Year optional" value={form.birthday_year || ""} onChange={e => update("birthday_year", e.target.value)} />
      </div>
      <select value={form.status || "active"} onChange={e => update("status", e.target.value)}>
        <option value="active">Active</option>
        <option value="left">Left</option>
      </select>
      <button className="primaryButton"><Save size={18}/> Save employee</button>
    </form>
  );
}

function NewsForm({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  function submit(e) {
    e.preventDefault();
    onSave({ title, body, published:true });
  }
  return (
    <form className="editorForm" onSubmit={submit}>
      <div className="formTop"><h2>Add company news</h2><button type="button" onClick={onCancel}><X size={18}/></button></div>
      <input required placeholder="News title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea required placeholder="Write the update..." value={body} onChange={e => setBody(e.target.value)} />
      <button className="primaryButton"><Save size={18}/> Publish news</button>
    </form>
  );
}

function Manager({ employees, setEmployees, reloadEmployees, news, setNews, reloadNews }) {
  const [view, setView] = useState("active");
  const [editing, setEditing] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [message, setMessage] = useState("");

  const shown = employees.filter(e => view === "active" ? e.status === "active" : e.status === "left");

  async function saveEmployee(payload) {
    setMessage("");
    if (!supabase) { setMessage("Supabase is not connected."); return; }
    const { error } = payload.id && !String(payload.id).startsWith("demo-")
      ? await supabase.from("employees").update(payload).eq("id", payload.id)
      : await supabase.from("employees").insert([payload]);
    if (error) setMessage(error.message);
    else {
      setMessage("Employee saved.");
      setShowEmployeeForm(false); setEditing(null); reloadEmployees();
    }
  }

  async function changeStatus(person, status) {
    setMessage("");
    if (!supabase || String(person.id).startsWith("demo-")) {
      setEmployees(prev => prev.map(e => e.id === person.id ? {...e, status} : e));
      return;
    }
    const { error } = await supabase.from("employees").update({ status }).eq("id", person.id);
    if (error) setMessage(error.message);
    else reloadEmployees();
  }

  async function saveNews(payload) {
    setMessage("");
    if (!supabase) { setMessage("Supabase is not connected."); return; }
    const { error } = await supabase.from("company_news").insert([payload]);
    if (error) setMessage(error.message);
    else {
      setMessage("News published.");
      setShowNewsForm(false); reloadNews();
    }
  }

  return (
    <section>
      <div className="pageIntro">
        <p className="eyebrow">Manager Portal</p>
        <h1>Manage the team without clutter.</h1>
        <p>Add people, edit profiles, mark employees as left, restore former employees, and publish company news.</p>
      </div>

      <div className="managerControls">
        <button type="button" className="primaryButton" onClick={() => { setEditing(null); setShowNewsForm(false); setShowEmployeeForm(true); }}><Plus size={18}/> Add employee</button>
        <button type="button" className="primaryButton" onClick={() => { setShowEmployeeForm(false); setEditing(null); setShowNewsForm(true); }}><Newspaper size={18}/> Add news</button>
        <button className={view === "active" ? "control active" : "control"} onClick={() => setView("active")}>Active</button>
        <button className={view === "left" ? "control active" : "control"} onClick={() => setView("left")}>Former employees</button>
      </div>

      {message && <div className="notice">{message}</div>}

      {showEmployeeForm && (
        <div className="editorPanel">
          <EmployeeForm
            employee={editing}
            onSave={saveEmployee}
            onCancel={() => { setShowEmployeeForm(false); setEditing(null); }}
          />
        </div>
      )}

      {showNewsForm && (
        <div className="editorPanel">
          <NewsForm
            onSave={saveNews}
            onCancel={() => setShowNewsForm(false)}
          />
        </div>
      )}

      <div className="managerList">
        {shown.map(person => (
          <article key={person.id} className="managerRow">
            <Avatar />
            <div><strong>{person.full_name}</strong><p>{person.role} · {person.department}</p><small>{person.favourite_product || "No favourite product set"}</small></div>
            <div className="managerActions">
              <button type="button" onClick={() => { setShowNewsForm(false); setEditing(person); setShowEmployeeForm(true); }}><Pencil size={16}/> Edit</button>
              {person.status === "active"
                ? <button type="button" onClick={() => changeStatus(person, "left")}>Mark as left</button>
                : <button type="button" onClick={() => changeStatus(person, "active")}><RotateCcw size={16}/> Restore</button>}
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
  const [employees, setEmployees] = useState([]);
  const [news, setNews] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loadMessage, setLoadMessage] = useState("");

  async function loadEmployees() {
    if (!supabase) { setEmployees(fallbackEmployees); setLoadMessage("Demo mode: Supabase keys not found."); return; }
    const { data, error } = await supabase.from("employees").select("*").order("full_name", { ascending:true });
    if (error) { setEmployees(fallbackEmployees); setLoadMessage(error.message); }
    else setEmployees(data?.length ? data : fallbackEmployees);
  }

  async function loadNews() {
    if (!supabase) { setNews([]); return; }
    const { data, error } = await supabase.from("company_news").select("*").eq("published", true).order("created_at", { ascending:false });
    if (!error) setNews(data || []);
  }

  useEffect(() => { loadEmployees(); loadNews(); }, []);

  const pages = {
    home: <Home setPage={setPage} employees={employees} news={news} openPerson={setSelectedPerson} />,
    people: <People employees={employees} openPerson={setSelectedPerson} />,
    news: <News news={news} />,
    events: <PlaceholderPage title="Events" icon={<CalendarDays />} description="Upcoming BBQs, charity days, training sessions and company events." />,
    training: <PlaceholderPage title="Training" icon={<BookOpen />} description="Training documents, induction material and useful resources." />,
    contacts: <PlaceholderPage title="Useful Contacts" icon={<Phone />} description="Find HR, maintenance, first aiders, managers and key contacts quickly." />,
    suggestions: <PlaceholderPage title="Suggestions" icon={<Lightbulb />} description="A simple way for staff to share ideas to improve Stokes." />,
    manager: <Manager employees={employees} setEmployees={setEmployees} reloadEmployees={loadEmployees} news={news} setNews={setNews} reloadNews={loadNews} />
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
      {loadMessage && <div className="notice">{loadMessage}</div>}
      {pages[page]}
      <ProfileModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
