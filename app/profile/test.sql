
SELECT u.*, u.id AS id_user, u.city, 3956 * 2 * ASIN(SQRT( POWER(SIN((48.8967 - abs(u.lat)) * pi()/180 / 2),2) + COS(48.8967 * pi()/180 ) * COS(abs(u.lat) *  pi()/180) * POWER(SIN((2.31843 – u.lng) *  pi()/180 / 2), 2))) as distance, u.zip, u.lat, u.lng
    FROM users u
    WHERE u.gender  u.id <> 1
    GROUP BY u.id, distance, u.city
    ORDER BY distance DESC

    3956 * 2 * ASIN(SQRT( POWER(SIN((48.8967 - abs(u.lat)) * pi()/180 / 2),2) + COS(48.8967 * pi()/180 ) * COS(abs(u.lat) *  pi()/180) * POWER(SIN((2.31843 – u.lng) *  pi()/180 / 2), 2))) as distance
    SELECT *,

       3956 * 2 * ASIN(SQRT( POWER(SIN((48.8967 - abs(u.lat)) * pi()/180 / 2),2) + COS(48.8967 * pi()/180 ) * COS(abs(u.lat) *  pi()/180) * POWER(SIN((2.31843 – u.lng) *  pi()/180 / 2), 2))) as distance FROM hotels desthaving distance < @distORDER BY distance limit 10


       SELECT u.*, u.id AS id_user, u.city, (ABS(2.31843 - u.lng) + ABS(2.31843 - u.lat)) AS distance, u.zip, u.lat, u.lng
           FROM users u
           WHERE u.gender LIKE (CASE '$gender'
                                   WHEN 'f' THEN (
                                      CASE '$orientation'
                                         WHEN 'Hetero' THEN 'm'
                                         WHEN 'Homo' THEN 'f'
                                         ELSE '%%'
                                       END)
                                   WHEN '$gender' THEN (
                                      CASE '$orientation'
                                         WHEN 'Hetero' THEN 'f'
                                         WHEN 'Homo' THEN 'm'
                                         ELSE '%%'
                                      END)
                                 END)
           AND u.id <> 1
           GROUP BY u.id, distance, u.city
           ORDER BY distance DESC



SELECT u.*, u.id AS id_users, ul.city, img.url, (ABS($ong - ul.longitude) + ABS($lat  - ul.latitude)) AS distance,ul.latitude, ul.longitude,  COUNT(up.id_interest) as commonInterest
        FROM users u
        LEFT JOIN users_usersInterest ui ON ui.id_users = u.id
        LEFT JOIN (SELECT id_interest FROM `users_usersInterest` WHERE id_users = $id) up on up.id_interest = ui.id_interest
        LEFT JOIN usersLocation ul ON ul.id_users = u.id
        LEFT JOIN usersImage img ON img.id_users = u.id AND img.isprofil = 1
        WHERE u.gender LIKE (CASE '$gender'
                             WHEN 'f' THEN (
                                CASE '$orientation'
                                   WHEN 'hetero' THEN 'm'
                                   WHEN 'homosexuel' THEN 'f'
                                   ELSE '%%'
                                 END)
                             WHEN '$gender' THEN (
                                CASE '$orientation'
                                   WHEN 'hetero' THEN 'f'
                                   WHEN 'homosexuel' THEN 'm'
                                   ELSE '%%'
                                END)
                       END)
        AND u.id <> $id
        AND u.id NOT IN($block)
        GROUP BY u.id, ui.id_users, distance, img.id, ul.city
        ORDER BY distance ASC, commonInterest DESC, u.popularity DESC

SELECT u.*, u.id AS id_user, u.city, 3956 * 2 * ASIN(SQRT( POWER(SIN((48.8967 - abs(u.lat)) * pi()/180 / 2),2) + COS(48.8967 * pi()/180 ) * COS(abs(u.lat) * pi()/180) * POWER(SIN((2.31843 - u.lng) * pi()/180 / 2), 2))) as distance, u.zip, u.lat, u.lng
FROM users u
WHERE u.id <> 1
GROUP BY u.id, distance, u.city
ORDER BY distance ASC


SELECT u.*, u.id AS id_user, u.city, 3956 * 2 * ASIN(SQRT( POWER(SIN((48.8967 - abs(u.lat)) * pi()/180 / 2),2) + COS(48.8967 * pi()/180 ) * COS(abs(u.lat) *  pi()/180) * POWER(SIN((2.31843 - u.lng) *  pi()/180 / 2), 2))) as distance, u.zip, u.lat, u.lng
    FROM users u
    WHERE u.id <> 1
    GROUP BY u.id, distance, u.city
    ORDER BY distance ASC
