 /* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
*/   

 
 -- tuna fish
 
 CREATE OR REPLACE FUNCTION proc.patch_country(
     p_actor_name VARCHAR,
      p_id integer,
    p_fields jsonb,

     p_koksmat_sync JSONB DEFAULT NULL
    
 )
 RETURNS JSONB LANGUAGE plpgsql 
 AS $$
 DECLARE
    v_rows_updated INTEGER;
    v_query TEXT;
    v_param_name TEXT;
    v_param_value TEXT;
    v_set_clause TEXT := '';
          v_audit_id integer;  -- Variable to hold the OUT parameter value
    p_auditlog_params jsonb;

BEGIN
    -- Raise a notice with actor and input
    RAISE NOTICE 'Actor: % Input: %', p_actor_name, p_fields;
    
    -- Loop through the fields to build the dynamic SET clause
    FOR v_param_name, v_param_value IN
        SELECT key, value::text
        FROM jsonb_each(p_fields)
    LOOP
        -- Dynamically build the SET clause
        v_set_clause := v_set_clause || format('%I = %L,', v_param_name, v_param_value);
    END LOOP;
    
    -- Remove the trailing comma from the SET clause
    v_set_clause := rtrim(v_set_clause, ',');

    -- Build the final query
    v_query := format('UPDATE public.country SET %s, updated_by = %L, updated_at = CURRENT_TIMESTAMP WHERE id = %L',
                      v_set_clause, p_actor_name, p_id);
    
    -- Execute the dynamic query
    EXECUTE v_query;
    
    -- Get the number of rows updated
    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    -- If no rows were updated, raise an exception
    IF v_rows_updated < 1 THEN
        RAISE EXCEPTION 'No records updated.  ID % not found in table country', p_id;
    END IF;
       p_auditlog_params := jsonb_build_object(
        'tenant', '',
        'searchindex', '',
        'name', 'patch_country',
        'status', 'success',
        'description', '',
        'action', 'patch_country',
        'entity', 'country',
        'entityid', -1,
        'actor', p_actor_name,
        'metadata', p_fields
    );

        -- Call the create_auditlog procedure
    CALL proc.create_auditlog(p_actor_name, p_auditlog_params, v_audit_id);

    -- Return success
    RETURN jsonb_build_object(
        'comment', 'patched',
        'id', p_id
    );
END;
 $$ 
 ;
 
 
