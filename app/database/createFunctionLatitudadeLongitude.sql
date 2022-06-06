CREATE OR REPLACE FUNCTION public.haversine(latitude1 numeric, longitude1 numeric, latitude2 numeric, longitude2 numeric)
	RETURNS double precision
    LANGUAGE sql
AS $function$
	SELECT 6371 * acos( cos( radians(latitude1) ) * cos( radians( latitude2 ) ) * cos( radians( longitude1 ) - radians(longitude2) ) + sin( radians(latitude1) ) * sin( radians( latitude2 ) ) ) 
    AS distance
$function$