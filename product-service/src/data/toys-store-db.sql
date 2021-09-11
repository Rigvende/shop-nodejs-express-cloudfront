create extension if not exists "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
    description text,
    price integer,
    url text
);

create table if not exists stocks (
	count integer,
	product_id uuid,
	foreign key ("product_id") references "products" ("id")	
);

insert into products (title, description, price, url) values
('Lego: Fools Village', 'It is a lego toy', 16, '/product-images/village.jpg'),
('Unicorn', 'It is an unicorn toy', 6, '/product-images/unicorn.jpg'),
('Race Track', 'It is a race track toy', 17, '/product-images/race.jpg'),
('Pop It', 'It is a pop-it toy', 7, '/product-images/popit.png'),
('Chii the Cat', 'It is a Chii toy', 6, '/product-images/chii.jpg'),
('Build Car', 'It is a build car toy', 15, '/product-images/build.jpg'),
('Bakugan', 'It is a bakugan toy', 7, '/product-images/bakugan.jpg'),
('Avocado', 'It is an avocado toy', 9, '/product-images/avocado.jpg');

insert into stocks (product_id, count) values
('a4395672-a928-4d58-9b52-d829a75fefcd', 4),
('663cd284-6001-42ec-a3df-4c43a3f2a1e5', 5),
('824031f7-471d-4dd9-9a16-0af9bea7630b', 6),
('4b59c6b8-cc4b-4737-b3e0-80639a98aa44', 4),
('b83df0c1-5c2f-4bcc-88e0-3dc99b4ba406', 5),
('e3ab3b05-c282-499c-8872-35b1b5c4a484', 5),
('ddc42536-ba4e-4ba8-986a-6de5b30547db', 7),
('c91d9ef2-77cf-41e7-9951-eb29f3010383', 5);

