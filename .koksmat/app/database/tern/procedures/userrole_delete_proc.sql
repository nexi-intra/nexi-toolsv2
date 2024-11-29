/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/   


-- krydder sild

CREATE OR REPLACE FUNCTION proc.delete_userrole(
    p_actor_name VARCHAR,
    p_params JSONB,
    p_koksmat_sync JSONB DEFAULT NULL
   
)
RETURNS JSONB LANGUAGE plpgsql 
AS $$
DECLARE
    v_id INTEGER;
    v_hard BOOLEAN;
     v_rows_updated INTEGER;
        v_audit_id integer;  -- Variable to hold the OUT parameter value
    p_auditlog_params jsonb;


BEGIN
    RAISE NOTICE 'Actor % Input % ', p_actor_name,p_params;
    v_id := p_params->>'id';
    v_hard := p_params->>'hard';
  
    IF v_hard THEN
     DELETE FROM public.userrole
        WHERE id = v_id;
       
    ELSE
        UPDATE public.userrole
        SET deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = p_actor_name
        WHERE id = v_id;
        
        GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
    
        IF v_rows_updated < 1 THEN
            RAISE EXCEPTION 'No records updated. userrole ID % not found', v_id ;
        END IF;
    END IF;

     

           p_auditlog_params := jsonb_build_object(
        'tenant', '',
        'searchindex', '',
        'name', 'delete_userrole',
        'status', 'success',
        'description', '',
        'action', 'delete_userrole',
        'entity', 'userrole',
        'entityid', -1,
        'actor', p_actor_name,
        'metadata', p_params
    );
/*###MAGICAPP-START##
{
     "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://booking.services.koksmat.com/.schema.json",
   
  "type": "object",

  "title": "Delete User Role",
  "description": "Delete operation",
  "properties": {
   "id": { "type": "number" },
    "hard": { "type": "boolean" }

    }
}
##MAGICAPP-END##*/
    -- Call the create_auditlog procedure
    CALL proc.create_auditlog(p_actor_name, p_auditlog_params, v_audit_id);


  return jsonb_build_object(
    'comment','deleted',
    'id',v_id
    
    );
END;
$$ 
;

