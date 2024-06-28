create OR REPLACE view person_view as
select person.id as person_id,
       person.created_at,
         person.updated_at, 
       person.tenant,
       person.name,
       person.email,
       person.displayname,
       person.uniqueid,
       country.name as country_name
FROM public.person
LEFT join country on country.id = person.nationality_id