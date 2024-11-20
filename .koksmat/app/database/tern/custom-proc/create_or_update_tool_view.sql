CREATE OR REPLACE FUNCTION proc.create_or_update_tool_view(
    p_actor_name character varying,
    p_params jsonb,
    p_koksmat_sync jsonb DEFAULT NULL::jsonb)
    RETURNS jsonb
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_tool_id INTEGER;
    v_category_id INTEGER;
    v_purpose JSONB;
    v_purpose_id INTEGER;
    v_country JSONB;
    v_country_id INTEGER;
    v_document JSONB;
    v_metadata JSONB;
    v_affected_records JSONB := '[]'::JSONB;
    v_trace_data JSONB := '[]'::JSONB;
    v_result JSONB;
    v_purpose_count INTEGER := 0;
    v_country_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting create_or_update_tool_view for actor: %', p_actor_name;

    -- Extract tool ID from params
    v_tool_id := (p_params->>'id')::INTEGER;

    -- Handle category
    v_category_id := (p_params->'category'->>'id')::INTEGER;
    IF v_category_id < 0 THEN
        -- Create new category
        INSERT INTO public.category (name, created_by, updated_by, tenant, searchindex)
        VALUES (p_params->'category'->>'name', p_actor_name, p_actor_name, '', '')
        RETURNING id INTO v_category_id;

        RAISE NOTICE 'New category created with ID: %', v_category_id;
        v_affected_records := v_affected_records || jsonb_build_object('id', v_category_id, 'name', p_params->'category'->>'name', 'type', 'insert', 'table', 'category');
        v_trace_data := v_trace_data || jsonb_build_object('timestamp', now(), 'text', 'Category created', 'details', format('Category ID: %s', v_category_id));
    END IF;

    -- Prepare metadata
    v_metadata := jsonb_build_object(
        'version', p_params->>'version',
        'icon', p_params->>'icon',
        'documentationUrl', p_params->>'documentationUrl',
        'supportContact', p_params->'supportContact',
        'license', p_params->'license',
        'compatiblePlatforms', p_params->'compatiblePlatforms',
        'systemRequirements', p_params->>'systemRequirements',
        'relatedToolIds', p_params->'relatedToolIds',
        'repositoryUrl', p_params->>'repositoryUrl',
        'collaborationType', p_params->'collaborationType',
        'teamSize', p_params->>'teamSize',
        'primaryFocus', p_params->'primaryFocus'
    );

    RAISE NOTICE 'Metadata prepared: %', v_metadata;

    -- Create or update tool
    IF v_tool_id IS NULL THEN
        -- Create new tool
        INSERT INTO public.tool (
            created_by, updated_by, tenant, searchindex, name, description, url, status, documents, metadata, category_id
        ) VALUES (
            p_actor_name, p_actor_name, 
            '', '', -- Set tenant and searchindex to empty strings
            p_params->>'name', p_params->>'description', p_params->>'url', 
            p_params->>'status', p_params->'documents', v_metadata, v_category_id
        ) RETURNING id INTO v_tool_id;

        RAISE NOTICE 'New tool created with ID: %', v_tool_id;
        v_affected_records := v_affected_records || jsonb_build_object('id', v_tool_id, 'name', p_params->>'name', 'type', 'insert', 'table', 'tool');
        v_trace_data := v_trace_data || jsonb_build_object('timestamp', now(), 'text', 'Tool created', 'details', format('Tool ID: %s', v_tool_id));
    ELSE
        -- Update existing tool
        UPDATE public.tool SET
            updated_by = p_actor_name,
            updated_at = now(),
            name = p_params->>'name',
            description = p_params->>'description',
            url = p_params->>'url',
            status = p_params->>'status',
            documents = p_params->'documents',
            metadata = v_metadata,
            category_id = v_category_id
        WHERE id = v_tool_id;

        RAISE NOTICE 'Tool updated with ID: %', v_tool_id;
        v_affected_records := v_affected_records || jsonb_build_object('id', v_tool_id, 'name', p_params->>'name', 'type', 'update', 'table', 'tool');
        v_trace_data := v_trace_data || jsonb_build_object('timestamp', now(), 'text', 'Tool updated', 'details', format('Tool ID: %s', v_tool_id));
    END IF;

    -- Handle purposes
    DELETE FROM public.tool_m2m_purpose WHERE tool_id = v_tool_id;
    RAISE NOTICE 'Deleted existing tool_m2m_purpose relations for tool ID: %', v_tool_id;

    FOR v_purpose IN SELECT * FROM jsonb_array_elements(p_params->'purposes')
    LOOP
        IF (v_purpose->>'id')::INTEGER < 0 THEN
            -- Create new purpose
            INSERT INTO public.purpose (name, sortorder, created_by, updated_by, tenant, searchindex)
            VALUES (v_purpose->>'value', v_purpose->>'order', p_actor_name, p_actor_name, '', '')
            RETURNING id INTO v_purpose_id;

            RAISE NOTICE 'New purpose created with ID: %', v_purpose_id;
            v_affected_records := v_affected_records || jsonb_build_object('id', v_purpose_id, 'name', v_purpose->>'value', 'type', 'insert', 'table', 'purpose');
            v_trace_data := v_trace_data || jsonb_build_object('timestamp', now(), 'text', 'Purpose created', 'details', format('Purpose ID: %s', v_purpose_id));
        ELSE
            v_purpose_id := (v_purpose->>'id')::INTEGER;
        END IF;

        INSERT INTO public.tool_m2m_purpose (tool_id, purpose_id, created_by, updated_by)
        VALUES (v_tool_id, v_purpose_id, p_actor_name, p_actor_name);

        v_purpose_count := v_purpose_count + 1;
        RAISE NOTICE 'Created tool_m2m_purpose relation for tool ID: % and purpose ID: %', v_tool_id, v_purpose_id;
        v_trace_data := v_trace_data || jsonb_build_object('timestamp', now(), 'text', 'Tool-Purpose relation created', 'details', format('Tool ID: %s, Purpose ID: %s', v_tool_id, v_purpose_id));
    END LOOP;

    -- Handle countries
    DELETE FROM public.tool_m2m_country WHERE tool_id = v_tool_id;
    RAISE NOTICE 'Deleted existing tool_m2m_country relations for tool ID: %', v_tool_id;

    FOR v_country IN SELECT * FROM jsonb_array_elements(p_params->'countries')
    LOOP
        IF (v_country->>'id')::INTEGER < 0 THEN
            -- Create new country
            INSERT INTO public.country (name, sortorder, created_by, updated_by, tenant, searchindex)
            VALUES (v_country->>'value', v_country->>'order', p_actor_name, p_actor_name, '', '')
            RETURNING id INTO v_country_id;

            RAISE NOTICE 'New country created with ID: %', v_country_id;
            v_affected_records := v_affected_records || jsonb_build_object('id', v_country_id, 'name', v_country->>'value', 'type', 'insert', 'table', 'country');
            v_trace_data := v_trace_data || jsonb_build_object('timestamp', now(), 'text', 'Country created', 'details', format('Country ID: %s', v_country_id));
        ELSE
            v_country_id := (v_country->>'id')::INTEGER;
        END IF;

        INSERT INTO public.tool_m2m_country (tool_id, country_id, created_by, updated_by)
        VALUES (v_tool_id, v_country_id, p_actor_name, p_actor_name);

        v_country_count := v_country_count + 1;
        RAISE NOTICE 'Created tool_m2m_country relation for tool ID: % and country ID: %', v_tool_id, v_country_id;
        v_trace_data := v_trace_data || jsonb_build_object('timestamp', now(), 'text', 'Tool-Country relation created', 'details', format('Tool ID: %s, Country ID: %s', v_tool_id, v_country_id));
    END LOOP;

    -- Add m2m operation summaries to affected_records
    v_affected_records := v_affected_records || jsonb_build_object('name', 'tool_m2m_purpose', 'type', 'update', 'count', v_purpose_count, 'table', 'tool_m2m_purpose');
    v_affected_records := v_affected_records || jsonb_build_object('name', 'tool_m2m_country', 'type', 'update', 'count', v_country_count, 'table', 'tool_m2m_country');

    -- Prepare result
    v_result := jsonb_build_object(
        'affected_records', v_affected_records,
        'trace_data', v_trace_data
    );

    RAISE NOTICE 'Function completed. Returning result: %', v_result;
    RETURN v_result;
END;
$BODY$;

ALTER FUNCTION proc.create_or_update_tool_view(character varying, jsonb)
    OWNER TO pgadmin;