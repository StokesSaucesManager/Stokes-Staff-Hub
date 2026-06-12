# Stokes Staff Hub V9 Manager Login

## Changes

- Manager page now requires Supabase email/password login
- Manager can sign out
- Staff can still view Home, People and News without logging in
- Existing manager tools are unchanged once logged in

## Supabase setup needed

Create a manager user in:
Supabase → Authentication → Users → Add user

Then run the security SQL provided in chat to restrict writes to authenticated users.
