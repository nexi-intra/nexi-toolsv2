CREATE OR REPLACE FUNCTION proc.userprofile_m2m_tool_manage_view(
  p_actor_name VARCHAR,
  p_params JSONB
) RETURNS JSONB AS $$
DECLARE
  v_tool_id INTEGER;
  v_userprofile_id INTEGER;
  v_create BOOLEAN;
  v_affected_id INTEGER;
  v_action TEXT;
  v_result JSONB;
  v_existing_record BOOLEAN;
BEGIN
  -- Extract parameters from JSONB
  v_tool_id := (p_params->>'tool_id')::INTEGER;
  v_userprofile_id := (p_params->>'userprofile_id')::INTEGER;
  v_create := (p_params->>'create')::BOOLEAN;

  -- Validate input
  IF v_tool_id IS NULL OR v_userprofile_id IS NULL OR v_create IS NULL THEN
    RAISE EXCEPTION 'Invalid input parameters';
  END IF;

  -- Check if the record already exists
  SELECT EXISTS (
    SELECT 1 
    FROM public.userprofile_m2m_tool 
    WHERE tool_id = v_tool_id AND userprofile_id = v_userprofile_id
  ) INTO v_existing_record;

  -- Perform the requested action
  IF v_create THEN
    IF v_existing_record THEN
      -- Update existing record
      UPDATE public.userprofile_m2m_tool
      SET updated_at = CURRENT_TIMESTAMP,
          updated_by = p_actor_name,
          deleted_at = NULL  -- In case it was soft-deleted before
      WHERE tool_id = v_tool_id AND userprofile_id = v_userprofile_id
      RETURNING id INTO v_affected_id;

      v_action := 'update';
    ELSE
      -- Insert new record
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
    -- Delete existing record
    DELETE FROM public.userprofile_m2m_tool
    WHERE tool_id = v_tool_id AND userprofile_id = v_userprofile_id
    RETURNING id INTO v_affected_id;

    v_action := 'delete';
  END IF;

  -- Prepare the result JSONB
  v_result := jsonb_build_object(
    'affected', jsonb_build_array(
      jsonb_build_object(
        'id', v_affected_id,
        'name', 'userprofile_m2m_tool',
        'type', v_action
      )
    ),
    'trace', jsonb_build_array(
      jsonb_build_object(
        'timestamp', CURRENT_TIMESTAMP,
        'text', 'Operation completed',
        'details', format('Action: %s, Tool ID: %s, UserProfile ID: %s', v_action, v_tool_id, v_userprofile_id)
      )
    )
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;