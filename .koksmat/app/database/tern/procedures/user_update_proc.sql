/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/   


-- sherry sild

CREATE OR REPLACE FUNCTION proc.update_user(
    p_actor_name VARCHAR,
    p_params JSONB,
    p_koksmat_sync JSONB DEFAULT NULL
   
)
RETURNS JSONB LANGUAGE plpgsql 
AS $$
DECLARE
    v_id INTEGER;
       v_rows_updated INTEGER;
v_tenant VARCHAR COLLATE pg_catalog."default" ;
    v_searchindex VARCHAR COLLATE pg_catalog."default" ;
    v_name VARCHAR COLLATE pg_catalog."default" ;
    v_description VARCHAR COLLATE pg_catalog."default";
    v_email VARCHAR;
    v_firstname VARCHAR;
    v_lastname VARCHAR;
    v_language_id INTEGER;
    v_country_id INTEGER;
    v_region_id INTEGER;
    v_status VARCHAR;
        v_audit_id integer;  -- Variable to hold the OUT parameter value
    p_auditlog_params jsonb;

    
BEGIN
    RAISE NOTICE 'Actor % Input % ', p_actor_name,p_params;
    v_id := p_params->>'id';
    v_tenant := p_params->>'tenant';
    v_searchindex := p_params->>'searchindex';
    v_name := p_params->>'name';
    v_description := p_params->>'description';
    v_email := p_params->>'email';
    v_firstname := p_params->>'firstname';
    v_lastname := p_params->>'lastname';
    v_language_id := p_params->>'language_id';
    v_country_id := p_params->>'country_id';
    v_region_id := p_params->>'region_id';
    v_status := p_params->>'status';
         
    

        
    UPDATE public.user
    SET updated_by = p_actor_name,
        updated_at = CURRENT_TIMESTAMP,
        tenant = v_tenant,
        searchindex = v_searchindex,
        name = v_name,
        description = v_description,
        email = v_email,
        firstname = v_firstname,
        lastname = v_lastname,
        language_id = v_language_id,
        country_id = v_country_id,
        region_id = v_region_id,
        status = v_status
    WHERE id = v_id;

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    
    IF v_rows_updated < 1 THEN
        RAISE EXCEPTION 'No records updated. user ID % not found', v_id ;
    END IF;


           p_auditlog_params := jsonb_build_object(
        'tenant', '',
        'searchindex', '',
        'name', 'update_user',
        'status', 'success',
        'description', '',
        'action', 'update_user',
        'entity', 'user',
        'entityid', -1,
        'actor', p_actor_name,
        'metadata', p_params
    );
/*###MAGICAPP-START##
{
   "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://booking.services.koksmat.com/.schema.json",
   
  "type": "object",

  "properties": {
    "title": "Update User",
  "description": "Update operation",
  
    "tenant": { 
    "type": "string",
    "description":"" },
    "searchindex": { 
    "type": "string",
    "description":"Search Index is used for concatenating all searchable fields in a single field making in easier to search\n" },
    "name": { 
    "type": "string",
    "description":"" },
    "description": { 
    "type": "string",
    "description":"" },
    "email": { 
    "type": "string",
    "description":"" },
    "firstname": { 
    "type": "string",
    "description":"" },
    "lastname": { 
    "type": "string",
    "description":"" },
    "language_id": { 
    "type": "number",
    "description":"" },
    "country_id": { 
    "type": "number",
    "description":"" },
    "region_id": { 
    "type": "number",
    "description":"" },
    "status": { 
    "type": "string",
    "description":"" }

    }
}
##MAGICAPP-END##*/
    -- Call the create_auditlog procedure
    CALL proc.create_auditlog(p_actor_name, p_auditlog_params, v_audit_id);

    return jsonb_build_object(
    'comment','updated',
    'id',v_id
    );
END;
$$ 
;


