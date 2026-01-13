-- query that represents the result of the /get_actors enpoint
select
ac.id,
ac.name
from
actors ac
where
lower(ac.name) like lower('%Jake%')
order by ac.name DESC;