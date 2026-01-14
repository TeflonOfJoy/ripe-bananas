-- query that represents the result of the /get_movie_details endpoint
SELECT 
    m.id,
    m.name,
    m.date,
    m.tagline,
    m.description,
    m.minute,
    m.rating,
    p.link as poster_link,
    COALESCE(json_agg(DISTINCT jsonb_build_object(
        'genre_id', g.genre_id,
        'genre_name', g.genre
    )) FILTER (WHERE g.genre_id IS NOT NULL), '[]') as genres,   
    COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', a.id,
        'name', a.name,
        'role', mha.role
    )) FILTER (WHERE a.id IS NOT NULL), '[]') as actors,    
    COALESCE(json_agg(DISTINCT jsonb_build_object(
        'role', c.role,
        'name', c.name
    )) FILTER (WHERE c.id IS NOT NULL), '[]') as crew,
    COALESCE(json_agg(DISTINCT t.theme) FILTER (WHERE t.theme IS NOT NULL), '[]') as themes, 
    COALESCE(json_agg(DISTINCT s.name) FILTER (WHERE s.id IS NOT NULL), '[]') as studios,    
    COALESCE(json_agg(DISTINCT jsonb_build_object(
        'type', l.type,
        'language', l.language
    )) FILTER (WHERE l.id IS NOT NULL), '[]') as languages,
    COALESCE(json_agg(DISTINCT co.name) FILTER (WHERE co.id IS NOT NULL), '[]') as countries,
    COALESCE(json_agg(DISTINCT jsonb_build_object(
        'date', r.date,
        'type', r.type,
        'rating', r.rating,
        'country', co2.name
    )) FILTER (WHERE r.id IS NOT NULL), '[]') as releases
FROM movies m
LEFT JOIN posters p ON m.id = p.id
LEFT JOIN movie_has_genres mhg ON m.id = mhg.movie_id
LEFT JOIN genres g ON mhg.genre_id = g.genre_id
LEFT JOIN movies_have_actors mha ON m.id = mha.movie_id
LEFT JOIN actors a ON mha.actor_id = a.id
LEFT JOIN crew c ON m.id = c.id
LEFT JOIN themes t ON m.id = t.id
LEFT JOIN movie_have_studios mhs ON m.id = mhs.movie_id
LEFT JOIN studio s ON mhs.studio_id = s.id
LEFT JOIN languages l ON m.id = l.id
LEFT JOIN movie_have_countries mhc ON m.id = mhc.movie_id
LEFT JOIN country co ON mhc.country_id = co.id
LEFT JOIN releases r ON m.id = r.id
LEFT JOIN country co2 ON r.country = co2.id
WHERE m.id = 1000531
GROUP BY m.id, m.name, m.date, m.tagline, m.description, m.minute, m.rating, p.link;