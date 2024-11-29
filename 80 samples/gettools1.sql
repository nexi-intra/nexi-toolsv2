  SELECT 
    t.*,
       (get_m2m_left_json(t.id, 'tool', 'country')) AS countries,
       (get_m2m_left_json(t.id, 'tool', 'purpose')) AS purposes,
        (get_m2m_left_json(t.id, 'tool', 'language')) AS languages,
       
    t.name || ' ' || t.description AS calculatedsearchindex,
    c.name AS category_name,
    c.sortorder AS category_order,
    c.color AS category_color
 
FROM tool AS t

LEFT JOIN category AS c ON c.id = t.category_id
where t.id = 697
ORDER BY t.name