SELECT u.id AS id_user, u.first_name, u.last_name,u.city, (ABS(ROUND(2.31843, 2) - ROUND(u.lng, 2)) + ABS(ROUND(48.8967, 2) - ROUND(u.lat, 2))) AS distance, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, ABS(STR_TO_DATE('23/02/1994', '%d/%m/%Y') - STR_TO_DATE(u.birth_date, '%d/%m/%Y')) AS diff_birth, u.birth_date, u.gender, u.orientation, p.photo_link
FROM users u
LEFT JOIN usersInterests ui ON ui.id_user = u.id
LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = ?) ci ON ci.id_interest = ui.id_interest
LEFT JOIN photos p ON p.id_user = u.id AND p.isProfil = 1
WHERE u.id <> 1 AND u.gender LIKE
	(CASE 'f'
     	WHEN 'm'
     	THEN
     	( CASE 'Hetero'
         		WHEN 'Hetero' THEN 'f'
         		WHEN 'Homo' THEN 'm'
         		ELSE '%%'
         END)
         WHEN 'f' THEN
         ( CASE 'Hetero'
                WHEN 'Hetero' THEN 'm'
                WHEN 'Homo' THEN 'f'
                ELSE '%%'
         END)
     END) AND u.orientation LIKE
     	(CASE 'Hetero'
         	WHEN 'Hetero' AND u.orientation = 'Hetero' THEN 'Hetero'
         	WHEN 'Hetero' AND u.orientation = 'Bi' THEN 'Bi'
         	WHEN ('Homo' AND u.orientation = 'Homo') THEN 'Homo'
            WHEN ('Homo' AND u.orientation = 'Bi') THEN 'Bi'
         	WHEN 'Bi' THEN
         		(CASE
                 	WHEN u.gender = 'f' AND u.orientation = 'Bi' THEN 'Bi'
                    WHEN u.gender = 'f' AND u.orientation = 'Homo' THEN 'Homo'
                 	WHEN u.gender <> 'f' AND u.orientation = 'Bi' THEN 'Bi'
                 	WHEN u.gender <> 'f' AND u.orientation = 'Hetero' THEN 'Hetero'
                 END)
         END)
GROUP BY u.id, ui.id_user, p.id
ORDER BY distance ASC, commonInterest DESC, diff_birth ASC