# Stokes Staff Hub V8 Core Pages

## Changes

- Birthdays now only shows birthdays today
- Anniversaries now only shows work anniversaries today
- Training page now shows people trained in Forklift and First Aid
- Manager employee editor includes Forklift trained and First Aid trained checkboxes
- Events, Contacts and Suggestions now have real pages instead of generic placeholders

## Supabase SQL needed

Run this once:

alter table employees
add column if not exists forklift_trained boolean default false,
add column if not exists first_aid_trained boolean default false;
