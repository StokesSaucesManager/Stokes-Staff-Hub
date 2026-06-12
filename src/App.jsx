import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  Users,
  Newspaper,
  Cake,
  Trophy,
  UserPlus,
  CalendarDays,
  BookOpen,
  Phone,
  Lightbulb,
  Building2,
  Heart,
  Plus,
  Pencil,
  RotateCcw,
  UserRound,
  ChevronRight,
  Megaphone,
  Save,
  X,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { supabase } from "./supabaseClient";
import "./styles.css";

const departments = [
  "Factory",
  "Warehouse",
  "Technical",
  "Sales",
  "Marketing",
  "Finance",
  "HR",
  "Maintenance",
  "Directors"
];

const departmentFilters = ["All", ...departments];

const products = [
  "Tomato Ketchup",
  "Brown Sauce",
  "Original BBQ Sauce",
  "Real Mayonnaise",
  "Garlic Mayonnaise",
  "Sweet Chilli Sauce",
  "Sticky Pickle",
  "Burger Relish"
];

const fallbackEmployees = [
  {
    id: "demo-1",
    full_name: "Sophie Carter",
    role: "Marketing Executive",
    department: "Marketing",
    start_date: "2023-06-12",
    birthday_day: 12,
    birthday_month: 6,
    birthday_year: null,
    favourite_product: "Tomato Ketchup",
    status: "active",
    use_default_icon: true
  },
  {
    id: "demo-2",
    full_name: "Tom Richardson",
    role: "Warehouse Supervisor",
    department: "Warehouse",
    start_date: "2014-06-12",
    birthday_day: 22,
    birthday_month: 9,
    birthday_year: null,
    favourite_product: "Brown Sauce",
    status: "active",
    use_default_icon: true
  },
  {
    id: "demo-3",
    full_name: "Sarah Collins",
    role: "Technical Manager",
    department: "Technical",
    start_date: "2021-01-18",
    birthday_day: 4,
    birthday_month: 2,
    birthday_year: null,
    favourite_product: "Real Mayonnaise",
    status: "active",
    use_default_icon: true
  }
];

function formatDate(date) {
  if (!date) return "Not set";
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function yearsAtStokes(date) {
  if (!date) return 0;
  const start = new Date(date + "T00:00:00");
  const today = new Date();
  let years = today.getFullYear() - start.getFullYear();
  const before =
    today.getMonth() < start.getMonth() ||
    (today.getMonth() === start.getMonth() && today.getDate() < start.getDate());
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
  const dayMonth = new Date(2026, person.birthday_month - 1, person.birthday_day)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return person.birthday_year ? `${dayMonth} ${person.birthday_year}` : dayMonth;
}

function Avatar({ large = false }) {
  return (
    <div className={large ? "avatar avatarLarge" : "avatar"}>
      <UserRound size={large ? 82 : 42} />
    </div>
  );
}

function StokesLogo({ hero = false }) {
  return (
    <div className={hero ? "stokesLogo heroLogo" : "stokesLogo"}>
      <img
        src={hero ? "/stokes-logo-white.png" : "/stokes-logo-transparent.png"}
        alt="Stokes Sauces For Food Lovers"
      />
      <span>Staff Hub</span>
    </div>
  );
}

function Notice({ type = "info", children }) {
  return (
    <div className={`notice ${type}`}>
      {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span>{children}</span>
    </div>
  );
}

function Feature({ icon, title, onClick }) {
  return (
    <button className="feature" type="button" onClick={onClick}>
      {icon}
      <strong>{title}</strong>
      <span>Open</span>
    </button>
  );
}

function Home({ setPage, employees, news, openPerson }) {
  const active = employees.filter((e) => e.status === "active");
  const newStarter = active.find((e) => isNewStarter(e.start_date));
  const anniversary = active.find((e) => yearsAtStokes(e.start_date) >= 5);
  const birthday = active.find((e) => e.birthday_day) || active[0];
  const [quickSearch, setQuickSearch] = useState("");

  const quickResults = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return [];
    return active
      .filter((e) =>
        `${e.full_name} ${e.role} ${e.department} ${e.favourite_product || ""}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 5);
  }, [quickSearch, active]);

  return (
    <section className="home">
      <div className="hero">
        <div className="heroTop">
          <StokesLogo hero />
          <span className="taste">Taste without compromise</span>
        </div>

        <h1>Good morning,</h1>
        <p>Welcome to the Stokes Staff Hub.</p>

        <div className="heroSearch">
          <Search size={22} />
          <input
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="Search a colleague, role or department..."
          />
        </div>

        {quickResults.length > 0 && (
          <div className="quickResults">
            {quickResults.map((person) => (
              <button type="button" key={person.id} onClick={() => openPerson(person)}>
                <Avatar />
                <span>
                  <strong>{person.full_name}</strong>
                  <small>{person.role} · {person.department}</small>
                </span>
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
          {birthday && (
            <article>
              <Cake />
              <div>
                <strong>It’s {birthday.full_name.split(" ")[0]}’s birthday today!</strong>
                <p>Favourite Stokes product: {birthday.favourite_product || "Not set yet"}</p>
              </div>
            </article>
          )}

          {anniversary && (
            <article>
              <Trophy />
              <div>
                <strong>
                  {anniversary.full_name.split(" ")[0]} celebrates {yearsAtStokes(anniversary.start_date)} years at Stokes.
                </strong>
                <p>Thank you for everything you do.</p>
              </div>
            </article>
          )}

          {newStarter && (
            <article>
              <UserPlus />
              <div>
                <strong>Welcome {newStarter.full_name.split(" ")[0]} to the team.</strong>
                <p>Find new starters quickly in People.</p>
              </div>
            </article>
          )}

          <article>
            <Megaphone />
            <div>
              <strong>{news[0]?.title || "Company news will appear here."}</strong>
              <p>{news[0]?.body || "A clean place for important updates."}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="browse">
        <div className="sectionHeader">
          <p className="eyebrow">Explore</p>
          <h2>Everything staff need, in one place.</h2>
        </div>

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

function People({ employees, openPerson }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees
      .filter((e) => e.status === "active")
      .filter((e) => department === "All" || e.department === department)
      .filter((e) =>
        !q ||
        `${e.full_name} ${e.role} ${e.department} ${e.favourite_product || ""}`
          .toLowerCase()
          .includes(q)
      )
      .sort((a, b) => a.full_name.localeCompare(b.full_name));
  }, [query, department, employees]);

  return (
    <section>
      <div className="pageIntro">
        <p className="eyebrow">People</p>
        <h1>Find anyone in under three seconds.</h1>
        <p>Search by name, role, department or favourite Stokes product.</p>
      </div>

      <label className="searchBar">
        <Search size={21} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, role, department or favourite product..."
        />
      </label>

      <div className="departmentRail">
        {departmentFilters.map((d) => (
          <button
            type="button"
            key={d}
            className={department === d ? "active" : ""}
            onClick={() => setDepartment(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="peopleGrid">
        {filtered.map((person) => (
          <button className="personCard" type="button" key={person.id} onClick={() => openPerson(person)}>
            <Avatar />
            <div>
              <h3>{person.full_name}</h3>
              <p>{person.role}</p>
              <span>{person.department}</span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <strong>No people found</strong>
          <p>Try another search or department.</p>
        </div>
      )}
    </section>
  );
}

function News({ news }) {
  return (
    <section>
      <div className="pageIntro">
        <p className="eyebrow">Company News</p>
        <h1>Updates from around Stokes.</h1>
        <p>Company news, announcements and important staff updates.</p>
      </div>

      <div className="newsGrid">
        {news.map((item) => (
          <article className="newsCard" key={item.id}>
            <p className="eyebrow">News</p>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </div>

      {news.length === 0 && (
        <div className="empty">
          <strong>No news yet</strong>
          <p>Managers can add company news from the Manager Portal.</p>
        </div>
      )}
    </section>
  );
}

function ProfileModal({ person, onClose }) {
  if (!person) return null;

  return (
    <div className="modalBackground" onClick={onClose}>
      <div className="profileModal" onClick={(e) => e.stopPropagation()}>
        <Avatar large />
        <h2>{person.full_name}</h2>
        <p className="profileRole">{person.role}</p>

        <div className="profileFacts">
          <div><Building2 /><span>{person.department || "Department not set"}</span></div>
          <div><CalendarDays /><span>Started {formatDate(person.start_date)}</span></div>
          <div><Trophy /><span>{yearsAtStokes(person.start_date)} years at Stokes</span></div>
          <div><Heart /><span>Favourite product: {person.favourite_product || "Not set"}</span></div>
          <div><Cake /><span>Birthday: {birthdayText(person)}</span></div>
        </div>

        <button type="button" className="primaryButton" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function defaultEmployee() {
  return {
    full_name: "",
    role: "",
    department: "Factory",
    start_date: "",
    favourite_product: "Tomato Ketchup",
    birthday_day: "",
    birthday_month: "",
    birthday_year: "",
    status: "active",
    use_default_icon: true,
    photo_url: ""
  };
}

function cleanEmployeeForSave(form) {
  const payload = {
    full_name: form.full_name.trim(),
    role: form.role.trim(),
    department: form.department,
    start_date: form.start_date || null,
    favourite_product: form.favourite_product || null,
    birthday_day: form.birthday_day ? Number(form.birthday_day) : null,
    birthday_month: form.birthday_month ? Number(form.birthday_month) : null,
    birthday_year: form.birthday_year ? Number(form.birthday_year) : null,
    status: form.status || "active",
    use_default_icon: true,
    photo_url: form.photo_url || null
  };

  if (form.id && !String(form.id).startsWith("demo-")) payload.id = form.id;

  return payload;
}

function EmployeeEditor({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(defaultEmployee());

  useEffect(() => {
    if (editing) {
      setForm({
        ...defaultEmployee(),
        ...editing,
        birthday_day: editing.birthday_day || "",
        birthday_month: editing.birthday_month || "",
        birthday_year: editing.birthday_year || ""
      });
    } else {
      setForm(defaultEmployee());
    }
  }, [editing]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSave(cleanEmployeeForSave(form));
  }

  return (
    <form className="editorForm" onSubmit={submit}>
      <div className="formTop">
        <h2>{editing ? "Edit employee" : "Add employee"}</h2>
        {editing && (
          <button type="button" onClick={onCancel} aria-label="Cancel edit">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="formGrid">
        <input
          required
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
        />

        <input
          required
          placeholder="Role"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
        />

        <select value={form.department} onChange={(e) => update("department", e.target.value)}>
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>

        <label>
          Start date
          <input
            required
            type="date"
            value={form.start_date || ""}
            onChange={(e) => update("start_date", e.target.value)}
          />
        </label>

        <select
          value={form.favourite_product || "Tomato Ketchup"}
          onChange={(e) => update("favourite_product", e.target.value)}
        >
          {products.map((p) => <option key={p}>{p}</option>)}
        </select>

        <select value={form.status || "active"} onChange={(e) => update("status", e.target.value)}>
          <option value="active">Active</option>
          <option value="left">Left</option>
        </select>
      </div>

      <div className="threeCols">
        <input
          type="number"
          min="1"
          max="31"
          placeholder="Birthday day"
          value={form.birthday_day}
          onChange={(e) => update("birthday_day", e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="12"
          placeholder="Month"
          value={form.birthday_month}
          onChange={(e) => update("birthday_month", e.target.value)}
        />
        <input
          type="number"
          min="1900"
          max="2100"
          placeholder="Year optional"
          value={form.birthday_year}
          onChange={(e) => update("birthday_year", e.target.value)}
        />
      </div>

      <button type="submit" className="primaryButton">
        <Save size={18} />
        {editing ? "Save changes" : "Add employee"}
      </button>
    </form>
  );
}

function NewsEditor({ onSave }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function submit(e) {
    e.preventDefault();
    onSave({ title: title.trim(), body: body.trim(), published: true });
    setTitle("");
    setBody("");
  }

  return (
    <form className="editorForm compact" onSubmit={submit}>
      <div className="formTop">
        <h2>Add company news</h2>
      </div>
      <input required placeholder="News title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea required placeholder="Write the update..." value={body} onChange={(e) => setBody(e.target.value)} />
      <button type="submit" className="primaryButton">
        <Save size={18} />
        Publish news
      </button>
    </form>
  );
}

function Manager({ employees, setEmployees, reloadEmployees, news, reloadNews }) {
  const [view, setView] = useState("active");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);

  const shown = employees.filter((e) => view === "active" ? e.status === "active" : e.status === "left");

  function localUpsertEmployee(payload) {
    setEmployees((prev) => {
      if (payload.id) {
        return prev.map((e) => e.id === payload.id ? { ...e, ...payload } : e);
      }
      return [{ ...payload, id: crypto.randomUUID() }, ...prev];
    });
  }

  async function saveEmployee(payload) {
    setNotice(null);

    if (!supabase) {
      localUpsertEmployee(payload);
      setEditing(null);
      setNotice({ type: "success", text: "Employee saved locally. Supabase is not connected." });
      return;
    }

    if (payload.id) {
      const { id, ...updates } = payload;
      const { error } = await supabase.from("employees").update(updates).eq("id", id);
      if (error) {
        setNotice({ type: "error", text: error.message });
        return;
      }
    } else {
      const { error } = await supabase.from("employees").insert([payload]);
      if (error) {
        setNotice({ type: "error", text: error.message });
        return;
      }
    }

    setEditing(null);
    setNotice({ type: "success", text: "Employee saved." });
    await reloadEmployees();
  }

  async function changeStatus(person, status) {
    setNotice(null);

    if (!supabase || String(person.id).startsWith("demo-")) {
      setEmployees((prev) => prev.map((e) => e.id === person.id ? { ...e, status } : e));
      setNotice({ type: "success", text: status === "left" ? "Employee marked as left." : "Employee restored." });
      return;
    }

    const { error } = await supabase.from("employees").update({ status }).eq("id", person.id);
    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    setNotice({ type: "success", text: status === "left" ? "Employee marked as left." : "Employee restored." });
    await reloadEmployees();
  }

  async function saveNews(payload) {
    setNotice(null);

    if (!supabase) {
      setNotice({ type: "error", text: "Supabase is not connected." });
      return;
    }

    const { error } = await supabase.from("company_news").insert([payload]);
    if (error) {
      setNotice({ type: "error", text: error.message });
      return;
    }

    setNotice({ type: "success", text: "Company news published." });
    await reloadNews();
  }

  return (
    <section>
      <div className="pageIntro">
        <p className="eyebrow">Manager Portal</p>
        <h1>Manage the team without clutter.</h1>
        <p>Add people, edit profiles, mark employees as left, restore former employees, and publish company news.</p>
      </div>

      {notice && <Notice type={notice.type}>{notice.text}</Notice>}

      <div className="managerStack">
        <EmployeeEditor
          editing={editing}
          onSave={saveEmployee}
          onCancel={() => setEditing(null)}
        />

        <NewsEditor onSave={saveNews} />
      </div>

      <div className="managerControls">
        <button
          type="button"
          className={view === "active" ? "control active" : "control"}
          onClick={() => setView("active")}
        >
          Active
        </button>
        <button
          type="button"
          className={view === "left" ? "control active" : "control"}
          onClick={() => setView("left")}
        >
          Former employees
        </button>
      </div>

      <div className="managerList">
        {shown.map((person) => (
          <article key={person.id} className="managerRow">
            <Avatar />
            <div>
              <strong>{person.full_name}</strong>
              <p>{person.role} · {person.department}</p>
              <small>{person.favourite_product || "No favourite product set"}</small>
            </div>

            <div className="managerActions">
              <button type="button" onClick={() => {
                setEditing(person);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}>
                <Pencil size={16} />
                Edit
              </button>

              {person.status === "active" ? (
                <button type="button" onClick={() => changeStatus(person, "left")}>Mark as left</button>
              ) : (
                <button type="button" onClick={() => changeStatus(person, "active")}>
                  <RotateCcw size={16} />
                  Restore
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaceholderPage({ title, icon, description }) {
  return (
    <section className="placeholder">
      <div className="placeholderIcon">{icon}</div>
      <p className="eyebrow">Coming soon</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [employees, setEmployees] = useState([]);
  const [news, setNews] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loadNotice, setLoadNotice] = useState(null);

  async function loadEmployees() {
    if (!supabase) {
      setEmployees(fallbackEmployees);
      setLoadNotice("Demo mode: Supabase keys not found.");
      return;
    }

    const { data, error } = await supabase.from("employees").select("*").order("full_name", { ascending: true });

    if (error) {
      setEmployees(fallbackEmployees);
      setLoadNotice(error.message);
      return;
    }

    setLoadNotice(null);
    setEmployees(data?.length ? data : fallbackEmployees);
  }

  async function loadNews() {
    if (!supabase) {
      setNews([]);
      return;
    }

    const { data, error } = await supabase
      .from("company_news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (!error) setNews(data || []);
  }

  useEffect(() => {
    loadEmployees();
    loadNews();
  }, []);

  const pages = {
    home: <Home setPage={setPage} employees={employees} news={news} openPerson={setSelectedPerson} />,
    people: <People employees={employees} openPerson={setSelectedPerson} />,
    news: <News news={news} />,
    events: <PlaceholderPage title="Events" icon={<CalendarDays />} description="Upcoming BBQs, charity days, training sessions and company events." />,
    training: <PlaceholderPage title="Training" icon={<BookOpen />} description="Training documents, induction material and useful resources." />,
    contacts: <PlaceholderPage title="Useful Contacts" icon={<Phone />} description="Find HR, maintenance, first aiders, managers and key contacts quickly." />,
    suggestions: <PlaceholderPage title="Suggestions" icon={<Lightbulb />} description="A simple way for staff to share ideas to improve Stokes." />,
    manager: (
      <Manager
        employees={employees}
        setEmployees={setEmployees}
        reloadEmployees={loadEmployees}
        news={news}
        reloadNews={loadNews}
      />
    )
  };

  return (
    <main>
      <nav className="nav">
        <button className="brandButton" type="button" onClick={() => setPage("home")}>
          <StokesLogo />
        </button>

        <div className="navPill">
          <button className={page === "home" ? "active" : ""} type="button" onClick={() => setPage("home")}>Home</button>
          <button className={page === "people" ? "active" : ""} type="button" onClick={() => setPage("people")}>People</button>
          <button className={page === "news" ? "active" : ""} type="button" onClick={() => setPage("news")}>News</button>
          <button className={page === "manager" ? "active" : ""} type="button" onClick={() => setPage("manager")}>Manager</button>
        </div>
      </nav>

      {loadNotice && <Notice>{loadNotice}</Notice>}

      {pages[page]}

      <ProfileModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
