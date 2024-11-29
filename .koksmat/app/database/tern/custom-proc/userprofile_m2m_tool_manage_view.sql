CREATE OR REPLACE FUNCTION proc.userprofile_m2m_tool_manage_view(
  p_actor_name VARCHAR,
  p_params JSONB,
  p_koksmat_sync jsonb DEFAULT NULL::jsonb
) RETURNS JSONB AS $$
DECLARE
  v_tool_id INTEGER;
  v_email VARCHAR;
  v_is_favorite BOOLEAN;
  v_userprofile_id INTEGER;
  v_affected_id INTEGER;
  v_action TEXT;
  v_result JSONB;
  v_existing_record BOOLEAN;
  v_trace_array JSONB := '[]'::JSONB;
BEGIN
  RAISE NOTICE 'Starting execution of userprofile_m2m_tool_manage_view';
  RAISE NOTICE 'Input parameters: p_actor_name: %, p_params: %', p_actor_name, p_params;

  -- Extract parameters from JSONB
  v_tool_id := (p_params->>'tool_id')::INTEGER;
  v_email := p_params->>'email';
  v_is_favorite := (p_params->>'is_favorite')::BOOLEAN;

  RAISE NOTICE 'Extracted parameters: v_tool_id: %, v_email: %, v_is_favorite: %', v_tool_id, v_email, v_is_favorite;

  -- Validate input
  IF v_tool_id IS NULL OR v_email IS NULL OR v_is_favorite IS NULL THEN
    RAISE NOTICE 'Invalid input parameters detected';
    RAISE EXCEPTION 'Invalid input parameters';
  END IF;

  -- Check if userprofile exists, create if not
  RAISE NOTICE 'Checking if userprofile exists for email: %', v_email;
  SELECT id INTO v_userprofile_id FROM public.userprofile WHERE email = v_email;
  
  IF v_userprofile_id IS NULL THEN
    RAISE NOTICE 'Userprofile not found. Creating new userprofile for email: %', v_email;
    INSERT INTO public.userprofile (
      email, 
	  name,
      created_at, 
      updated_at, 
      created_by, 
      updated_by, 
      tenant, 
      searchindex, 
      koksmat_state, 
      koksmat_bucket
    )
    VALUES (
      v_email, 
	v_email, 
      CURRENT_TIMESTAMP, 
      CURRENT_TIMESTAMP, 
      p_actor_name, 
      p_actor_name, 
      '', 
      '', 
      'active', 
      '{}'::JSONB
    )
    RETURNING id INTO v_userprofile_id;

    RAISE NOTICE 'New userprofile created with ID: %', v_userprofile_id;

    v_trace_array := v_trace_array || jsonb_build_object(
      'timestamp', CURRENT_TIMESTAMP,
      'text', 'New userprofile created',
      'details', format('Email: %s, UserProfile ID: %s', v_email, v_userprofile_id)
    );
  ELSE
    RAISE NOTICE 'Existing userprofile found with ID: %', v_userprofile_id;
  END IF;

  -- Check if the record already exists
  RAISE NOTICE 'Checking if userprofile_m2m_tool record exists for tool_id: % and userprofile_id: %', v_tool_id, v_userprofile_id;
  SELECT EXISTS (
    SELECT 1 
    FROM public.userprofile_m2m_tool 
    WHERE tool_id = v_tool_id AND userprofile_id = v_userprofile_id
  ) INTO v_existing_record;

  RAISE NOTICE 'Existing record found: %', v_existing_record;

  -- Perform the requested action
  IF v_is_favorite THEN
    IF v_existing_record THEN
      RAISE NOTICE 'Existing userprofile_m2m_tool record found. Not updating.';
      SELECT id INTO v_affected_id 
      FROM public.userprofile_m2m_tool 
      WHERE tool_id = v_tool_id AND userprofile_id = v_userprofile_id;

      v_action := 'existing';
    ELSE
      RAISE NOTICE 'Inserting new userprofile_m2m_tool record';
      INSERT INTO public.userprofile_m2m_tool (
        tool_id, 
        userprofile_id, 
        created_at, 
        updated_at, 
        created_by, 
        updated_by, 
        koksmat_state, 
        koksmat_bucket
      )
      VALUES (
        v_tool_id, 
        v_userprofile_id, 
        CURRENT_TIMESTAMP, 
        CURRENT_TIMESTAMP, 
        p_actor_name, 
        p_actor_name, 
        'active', 
        '{}'::JSONB
      )
      RETURNING id INTO v_affected_id;

      v_action := 'insert';
    END IF;
  ELSE
    RAISE NOTICE 'Deleting userprofile_m2m_tool record';
    DELETE FROM public.userprofile_m2m_tool
    WHERE tool_id = v_tool_id AND userprofile_id = v_userprofile_id
    RETURNING id INTO v_affected_id;

    v_action := 'delete';
  END IF;

  RAISE NOTICE 'Action performed: %, Affected ID: %', v_action, v_affected_id;

  -- Add the main action to trace array
  v_trace_array := v_trace_array || jsonb_build_object(
    'timestamp', CURRENT_TIMESTAMP,
    'text', 'Operation completed',
    'details', format('Action: %s, Tool ID: %s, UserProfile ID: %s', v_action, v_tool_id, v_userprofile_id)
  );

  -- Prepare the result JSONB
  v_result := jsonb_build_object(
    'affected', jsonb_build_array(
      jsonb_build_object(
        'id', v_affected_id,
        'name', 'userprofile_m2m_tool',
        'type', v_action
      )
    ),
    'trace', v_trace_array
  );

  RAISE NOTICE 'Function execution completed. Returning result: %', v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;