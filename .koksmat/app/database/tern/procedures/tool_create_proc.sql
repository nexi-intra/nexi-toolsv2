/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/   


-- tomat sild
-- TODO: Figure out why i had this in the public schmea and not in the proc schema 
CREATE OR REPLACE FUNCTION proc.create_tool(
    p_actor_name VARCHAR,
    p_params JSONB,
    p_koksmat_sync JSONB DEFAULT NULL
   
)
RETURNS JSONB LANGUAGE plpgsql 
AS $$
DECLARE
       v_rows_updated INTEGER;
v_tenant VARCHAR COLLATE pg_catalog."default" ;
    v_searchindex VARCHAR COLLATE pg_catalog."default" ;
    v_name VARCHAR COLLATE pg_catalog."default" ;
    v_description VARCHAR COLLATE pg_catalog."default";
    v_category_id INTEGER;
    v_url VARCHAR;
    v_status VARCHAR;
    v_Documents JSONB;
    v_metadata JSONB;
    v_id INTEGER;
        v_audit_id integer;  -- Variable to hold the OUT parameter value
    p_auditlog_params jsonb;

BEGIN
    RAISE NOTICE 'Actor % Input % ', p_actor_name,p_params;
    v_tenant := p_params->>'tenant';
    v_searchindex := p_params->>'searchindex';
    v_name := p_params->>'name';
    v_description := p_params->>'description';
    v_category_id := p_params->>'category_id';
    v_url := p_params->>'url';
    v_status := p_params->>'status';
    v_Documents := p_params->>'Documents';
    v_metadata := p_params->>'metadata';
         
    
    INSERT INTO public.tool (
    id,
    created_at,
    updated_at,
        created_by, 
        updated_by, 
        tenant,
        searchindex,
        name,
        description,
        category_id,
        url,
        status,
        Documents,
        metadata
    )
    VALUES (
        DEFAULT,
        DEFAULT,
        DEFAULT,
        p_actor_name, 
        p_actor_name,  -- Use the same value for updated_by
        v_tenant,
        v_searchindex,
        v_name,
        v_description,
        v_category_id,
        v_url,
        v_status,
        v_Documents,
        v_metadata
    )
    RETURNING id INTO v_id;

    

       p_auditlog_params := jsonb_build_object(
        'tenant', '',
        'searchindex', '',
        'name', 'create_tool',
        'status', 'success',
        'description', '',
        'action', 'create_tool',
        'entity', 'tool',
        'entityid', -1,
        'actor', p_actor_name,
        'metadata', p_params
    );
/*###MAGICAPP-START##
{
   "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://booking.services.koksmat.com/.schema.json",
   
  "type": "object",

  "title": "Create Tool",
  "description": "Create operation",

  "properties": {
  
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
    "category_id": { 
    "type": "number",
    "description":"" },
    "url": { 
    "type": "string",
    "description":"" },
    "status": { 
    "type": "string",
    "description":"" },
    "Documents": { 
    "type": "object",
    "description":"" },
    "metadata": { 
    "type": "object",
    "description":"" }

    }
}

##MAGICAPP-END##*/

    -- Call the create_auditlog procedure
    CALL proc.create_auditlog(p_actor_name, p_auditlog_params, v_audit_id);

    return jsonb_build_object(
    'comment','created',
    'id',v_id);

END;
$$ 
;




