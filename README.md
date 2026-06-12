# Stokes Staff Hub V10 Manager Tools

## Adds
- Manager tabs: Employees, News, Events, Contacts, Suggestions
- Edit employees and mark as left/restore
- Manage company news: add, edit, hide/show, delete
- Add/delete events
- Add/delete useful contacts
- Review suggestions
- Existing manager login retained

## Supabase SQL recommended

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date timestamp with time zone,
  location text,
  description text,
  published boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists useful_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  phone text,
  email text,
  created_at timestamp with time zone default now()
);

alter table employees
add column if not exists forklift_trained boolean default false,
add column if not exists first_aid_trained boolean default false;
