/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: true
---
*/   


-- tomat sild

CREATE OR REPLACE PROCEDURE proc.create_auditlog(
    p_actor_name VARCHAR,
    p_params JSONB,
    OUT p_id INTEGER
)
LANGUAGE plpgsql
AS $BODY$
DECLARE
    v_tenant VARCHAR COLLATE pg_catalog."default" ;
    v_searchindex VARCHAR COLLATE pg_catalog."default" ;
    v_name VARCHAR COLLATE pg_catalog."default" ;
    v_description VARCHAR COLLATE pg_catalog."default";
    v_action VARCHAR;
    v_status VARCHAR;
    v_entity VARCHAR;
    v_entityid VARCHAR;
    v_actor VARCHAR;
    v_metadata JSONB;
        v_audit_id integer;  -- Variable to hold the OUT parameter value
    p_auditlog_params jsonb;

BEGIN
    v_tenant := p_params->>'tenant';
    v_searchindex := p_params->>'searchindex';
    v_name := p_params->>'name';
    v_description := p_params->>'description';
    v_action := p_params->>'action';
    v_status := p_params->>'status';
    v_entity := p_params->>'entity';
    v_entityid := p_params->>'entityid';
    v_actor := p_params->>'actor';
    v_metadata := p_params->>'metadata';
         

    INSERT INTO public.auditlog (
    id,
    created_at,
    updated_at,
        created_by, 
        updated_by, 
        tenant,
        searchindex,
        name,
        description,
        action,
        status,
        entity,
        entityid,
        actor,
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
        v_action,
        v_status,
        v_entity,
        v_entityid,
        v_actor,
        v_metadata
    )
    RETURNING id INTO p_id;

      
END;
$BODY$
;
