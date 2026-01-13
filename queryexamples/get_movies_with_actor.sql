-- query that represents the result of the /get_movies_with_actor enpoint
-- the commented where clauses simulate the filters of the endpoint
select 
mo.id,
mo.name,
mo.date,
mo.tagline,
mo.description,
mo.minute,
mo.rating,
coalesce(
  json_agg(
    DISTINCT jsonb_build_object('genre_name', ge.genre)
  ) filter (
    where ge.genre_id is not null), '[]'
) as genres,
po.link as poster
from 
movies mo 
join posters po on mo.id = po.id 
join movie_has_genres mhg on mo.id = mhg.movie_id
join genres ge on mhg.genre_id = ge.genre_id
join movies_have_actors mha on mo.id = mha.movie_id
join actors ac on mha.actor_id = ac.id
where
--lower(mo.name) like lower('%con air%') and
--ge.genre in ('Action', 'Drama') and
--mo.date >= 1999 and
--mo.date <= 2010 and
--mo.rating >= 3 and
--mo.rating <= 5 and
--mo.minute >= 31 and
--mo.minute <= 100 and
ac.id = 20664
group by mo.id, po.link
;--order by rating DESC;