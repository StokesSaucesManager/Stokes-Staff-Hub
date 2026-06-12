# Stokes Staff Hub V8 Core Pages Fixed

Fixed build version.

## Changes
- Birthdays only shows birthdays today
- Anniversaries only shows work anniversaries today
- Training page shows Forklift and First Aid trained people
- Manager editor includes Forklift trained and First Aid trained checkboxes

## Supabase SQL needed once

alter table employees
add column if not exists forklift_trained boolean default false,
add column if not exists first_aid_trained boolean default false;
