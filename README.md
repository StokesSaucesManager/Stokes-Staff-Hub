# Stokes Staff Hub V7 Today + Training

## Changes

- Birthdays page only shows people with birthdays today
- Work anniversaries page only shows people celebrating today
- Training page now works like a people page
- Training can be filtered by Forklift, First Aid, or All
- Manager employee form includes Forklift trained and First Aid trained checkboxes

## Supabase SQL needed

Run this once in Supabase before using the training checkboxes:

alter table employees
add column if not exists forklift_trained boolean default false,
add column if not exists first_aid_trained boolean default false;
