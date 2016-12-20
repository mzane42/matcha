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

//search

SELECT u.id AS id_user, u.first_name, u.last_name,u.city, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, u.birth_date, u.gender, u.orientation, p.photo_link, GROUP_CONCAT(i.interest_name) as interests FROM users u
LEFT JOIN usersInterests ui ON ui.id_user = u.id
LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = 1) ci ON ci.id_interest = ui.id_interest
LEFT JOIN interests i ON i.id = ui.id_interest
LEFT JOIN photos p ON p.id_user = u.id AND p.isProfil = 1
WHERE u.id <> 1
GROUP BY u.id, ui.id_user, p.id
ORDER BY commonInterest DESC



SELECT u.id AS id_user, u.first_name, u.last_name,u.city, (ABS(ROUND("+db.connection.escape(user.lng)+", 2) - ROUND(u.lng, 2)) + ABS(ROUND("+db.connection.escape(user.lat)+", 2) - ROUND(u.lat, 2))) AS distance, u.zip, u.lat, u.lng, COUNT(ci.id_interest) as commonInterest, ABS(STR_TO_DATE("+db.connection.escape(user.birth_date)+", '%d/%m/%Y') - STR_TO_DATE(u.birth_date, '%d/%m/%Y')) AS diff_birth, u.birth_date, u.gender, u.orientation, p.photo_link, GROUP_CONCAT(i.interest_name) as interests, (ma.id IS NOT NULL) AS matched
FROM users u
LEFT JOIN usersInterests ui ON ui.id_user = u.id
LEFT JOIN (SELECT id_interest FROM usersInterests WHERE id_user = "+db.connection.escape(user.id)+") ci ON ci.id_interest = ui.id_interest
LEFT JOIN interests i ON i.id = ui.id_interest LEFT JOIN photos p ON p.id_user = u.id AND p.isProfil = 1
LEFT JOIN matched ma ON (ma.id_author = u.id AND ma.id_receiver = "+db.connection.escape(user.id)+") OR (ma.id_author = "+db.connection.escape(user.id)+" AND ma.id_receiver = u.id)
WHERE u.id <> "+db.connection.escape(user.id)+" AND u.gender LIKE (CASE "+db.connection.escape(user.gender)+" WHEN 'm' THEN ( CASE "+db.connection.escape(user.orientation)+" WHEN 'Hetero' THEN 'f' WHEN 'Homo' THEN 'm' ELSE '%%' END) WHEN 'f' THEN ( CASE "+db.connection.escape(user.orientation)+" WHEN 'Hetero' THEN 'm' WHEN 'Homo' THEN 'f' ELSE '%%' END) END) AND u.orientation LIKE (CASE "+db.connection.escape(user.orientation)+" WHEN ('Hetero' AND u.orientation = 'Hetero') THEN 'Hetero' WHEN ('Hetero' AND u.orientation = 'Bi') THEN 'Bi' WHEN ('Homo' AND u.orientation = 'Homo') THEN 'Homo' WHEN ('Homo' AND u.orientation = 'Bi') THEN 'Bi' WHEN 'Bi' THEN (CASE WHEN u.gender = "+db.connection.escape(user.gender)+" AND u.orientation = 'Bi' THEN 'Bi' WHEN u.gender = "+db.connection.escape(user.gender)+" AND u.orientation = 'Homo' THEN 'Homo' WHEN (u.gender <> "+db.connection.escape(user.gender)+" AND u.orientation = 'Bi') THEN 'Bi' WHEN (u.gender <> "+db.connection.escape(user.gender)+" AND u.orientation = 'Hetero') THEN 'Hetero' END) END)
GROUP BY u.id, ui.id_user, p.id, ma.id ORDER BY distance ASC, diff_birth ASC, commonInterest DESC

SELECT users.id, bio, email, last_name, first_name, login, password, birth_date, gender, orientation, GROUP_CONCAT(i.interest_name) as interests, lat, lng, city, zip, country, p.photo_link, (ma.id IS NOT NULL) AS matched
FROM `users`
LEFT JOIN usersInterests ui ON ui.id_user = users.id
LEFT JOIN interests i On i.id = ui.id_interest
LEFT JOIN photos p ON p.id_user = users.id AND p.isProfil = 1
LEFT JOIN matched ma ON (ma.id_author = users.id AND ma.id_receiver = '+db.connection.escape(me)+') OR (ma.id_author = '+db.connection.escape(me)+' AND ma.id_receiver = users.id)
WHERE users.id = ?
GROUP BY users.id, ma.id, p.id, ui.id_user


