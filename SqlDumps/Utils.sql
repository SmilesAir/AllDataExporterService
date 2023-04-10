-- Winrate by Event
select
	(select count(distinct event_key) from results where player_key = 'fbf9401b-08b2-425d-9201-240038699893' and round = 1 and place = 1) /
	(select count(distinct event_key) from results where player_key = 'fbf9401b-08b2-425d-9201-240038699893');

-- Winrate by Division
select
	(select count(distinct event_key, division) from results where player_key = 'fbf9401b-08b2-425d-9201-240038699893' and round = 1 and place = 1) /
	(select count(distinct event_key, division) from results where player_key = 'fbf9401b-08b2-425d-9201-240038699893');

-- Find Player
select * from players where first_name = "Ryan";

-- All winrate by Event
select first_name, last_name,
(select count(distinct event_key) from results where player_key = players.key and round = 1 and place = 1) as wins,
(select count(distinct event_key) from results where player_key = players.key) as total,
(select wins / total) as win_percentage
from players
order by win_percentage desc
limit 100;

-- All winrate by Division
select * from
(select first_name, last_name,
(select count(distinct event_key, division) from results where player_key = players.key and round = 1 and place = 1) as wins,
(select count(distinct event_key, division) from results where player_key = players.key) as total,
(select wins / total) as win_percentage
from players
order by win_percentage desc) d
where d.total > 9
limit 20