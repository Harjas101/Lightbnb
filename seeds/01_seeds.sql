INSERT INTO users (name, email, password)
VALUES ('john smith','hello@hello.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u' ),
('sam smith','sam@hello.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('willow smith','willow@hello.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title , description, thumbnail_photo_url, cover_photo_url , cost_per_night , parking_spaces , number_of_bathrooms , number_of_bedrooms , country , street , city , province , post_code , active )
VALUES (1, 'new york villa' , 'perfect 3 bedroom villa getaway', 'thumbnail_photo_url', 'cover_photo_url' , 250 , 2 , 3 , 3 , 'usa' , '1097 brooks' , 'brooklyn' , 'new york' , 'post_code' , true ),
(2, 'castle' , 'perfect 1 bedroom villa getaway', 'thumbnail_photo_url', 'cover_photo_url' , 100 , 1 , 1 , 1 , 'canada' , '1097 wack st' , 'toronto' , 'ON' , 'l1x2j2' , true),
(3, 'mansion' , 'miami', 'thumbnail_photo_url', 'cover_photo_url' , 1000 , 6 , 10 , 12 , 'usa' , '1097 forest hills' , 'miami' , 'florida' , 'post_code' , true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 1),
('2019-01-04', '2019-02-01', 2, 2),
('2021-10-01', '2021-10-14', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 1, 'hello'),
        (2, 2, 2, 2, 'hello'),
        (3, 3, 3 , 3, 'hello');
