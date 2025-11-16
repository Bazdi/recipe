-- Seed data for nutrition_database
-- Common German ingredients with nutrition information

INSERT INTO nutrition_database (food_name, aliases, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, vitamins, minerals)
VALUES
  -- Gemüse
  ('Tomaten', '["Tomate", "Rispentomaten"]', 18, 0.9, 3.9, 0.2, 1.2, '{"A": 833, "C": 14, "K": 7.9}', '{"Kalium": 237, "Calcium": 10}'),
  ('Karotten', '["Möhren", "Karotte", "Möhre"]', 41, 0.9, 9.6, 0.2, 2.8, '{"A": 16706, "C": 5.9, "K": 13.2}', '{"Kalium": 320, "Calcium": 33}'),
  ('Zwiebeln', '["Zwiebel", "Speisezwiebel"]', 40, 1.1, 9.3, 0.1, 1.7, '{"C": 7.4, "B6": 0.1}', '{"Kalium": 146, "Calcium": 23}'),
  ('Kartoffeln', '["Kartoffel"]', 77, 2.0, 17.5, 0.1, 2.1, '{"C": 19.7, "B6": 0.3}', '{"Kalium": 421, "Magnesium": 23}'),
  ('Paprika', '["Paprikaschote", "Paprikas"]', 31, 1.0, 6.0, 0.3, 2.1, '{"A": 3131, "C": 127.7}', '{"Kalium": 211, "Calcium": 7}'),
  ('Gurken', '["Gurke", "Salatgurke"]', 15, 0.7, 3.6, 0.1, 0.5, '{"C": 2.8, "K": 16.4}', '{"Kalium": 147, "Magnesium": 13}'),
  ('Spinat', '["Blattspinat"]', 23, 2.9, 3.6, 0.4, 2.2, '{"A": 9377, "C": 28.1, "K": 482.9}', '{"Eisen": 2.7, "Calcium": 99}'),
  ('Brokkoli', '[]', 34, 2.8, 7.0, 0.4, 2.6, '{"C": 89.2, "K": 101.6}', '{"Kalium": 316, "Calcium": 47}'),

  -- Obst
  ('Äpfel', '["Apfel"]', 52, 0.3, 14.0, 0.2, 2.4, '{"C": 4.6}', '{"Kalium": 107}'),
  ('Bananen', '["Banane"]', 89, 1.1, 22.8, 0.3, 2.6, '{"C": 8.7, "B6": 0.4}', '{"Kalium": 358, "Magnesium": 27}'),
  ('Orangen', '["Orange", "Apfelsine"]', 47, 0.9, 11.8, 0.1, 2.4, '{"C": 53.2}', '{"Kalium": 181, "Calcium": 40}'),
  ('Erdbeeren', '["Erdbeere"]', 32, 0.7, 7.7, 0.3, 2.0, '{"C": 58.8, "K": 2.2}', '{"Kalium": 153, "Calcium": 16}'),

  -- Fleisch & Fisch
  ('Hähnchenbrust', '["Hühnerbrust", "Geflügelbrust"]', 165, 31.0, 0.0, 3.6, 0.0, '{"B6": 0.5, "B12": 0.3}', '{"Phosphor": 220, "Selen": 27.6}'),
  ('Rinderhackfleisch', '["Hackfleisch Rind"]', 250, 26.0, 0.0, 15.0, 0.0, '{"B12": 2.6}', '{"Eisen": 2.7, "Zink": 5.3}'),
  ('Lachs', '["Lachsfilet"]', 208, 20.0, 0.0, 13.0, 0.0, '{"D": 11.0, "B12": 3.2}', '{"Selen": 41.4}'),

  -- Milchprodukte
  ('Milch 3,5%', '["Vollmilch", "Frischmilch"]', 64, 3.3, 4.8, 3.5, 0.0, '{"A": 146, "D": 0.1, "B12": 0.4}', '{"Calcium": 120, "Phosphor": 93}'),
  ('Joghurt natur', '["Naturjoghurt"]', 61, 3.5, 4.7, 3.3, 0.0, '{"B12": 0.5}', '{"Calcium": 120}'),
  ('Käse Gouda', '["Gouda"]', 356, 24.9, 0.0, 27.4, 0.0, '{"A": 270, "B12": 1.5}', '{"Calcium": 820, "Phosphor": 546}'),
  ('Butter', '[]', 717, 0.9, 0.7, 81.1, 0.0, '{"A": 684, "D": 1.5}', '{"Calcium": 24}'),
  ('Eier', '["Ei", "Hühnerei"]', 155, 13.0, 1.1, 11.0, 0.0, '{"A": 520, "D": 2.0, "B12": 1.1}', '{"Eisen": 1.8, "Selen": 30.8}'),

  -- Getreide & Backwaren
  ('Weizenmehl Type 405', '["Mehl", "Weizenmehl"]', 348, 10.0, 72.0, 1.0, 3.4, '{"B1": 0.1}', '{"Eisen": 1.2}'),
  ('Haferflocken', '["Hafer"]', 368, 13.5, 58.7, 7.0, 10.0, '{"B1": 0.6}', '{"Eisen": 4.7, "Magnesium": 137}'),
  ('Reis', '["Basmatireis", "Langkornreis"]', 130, 2.7, 28.2, 0.3, 0.4, '{"B1": 0.1}', '{"Magnesium": 12}'),
  ('Nudeln', '["Pasta", "Spaghetti"]', 371, 13.0, 71.5, 1.5, 3.2, '{"B1": 0.1}', '{"Eisen": 1.3}'),
  ('Brot Vollkorn', '["Vollkornbrot"]', 247, 9.0, 45.0, 3.0, 7.0, '{"B1": 0.3}', '{"Eisen": 2.5, "Magnesium": 90}'),

  -- Hülsenfrüchte
  ('Linsen', '["Rote Linsen", "Grüne Linsen"]', 116, 9.0, 20.1, 0.4, 7.9, '{"B6": 0.2}', '{"Eisen": 3.3, "Magnesium": 36}'),
  ('Kichererbsen', '["Kirchererbse"]', 164, 8.9, 27.4, 2.6, 7.6, '{"B6": 0.1}', '{"Eisen": 2.9, "Magnesium": 48}'),
  ('Kidneybohnen', '["Bohnen rot"]', 127, 8.7, 22.8, 0.5, 7.4, '{"B1": 0.2}', '{"Eisen": 2.9, "Magnesium": 45}'),

  -- Fette & Öle
  ('Olivenöl', '["Öl", "Natives Olivenöl"]', 884, 0.0, 0.0, 100.0, 0.0, '{"E": 14.4, "K": 60.2}', '{}'),
  ('Rapsöl', '["Öl"]', 884, 0.0, 0.0, 100.0, 0.0, '{"E": 18.9}', '{}'),

  -- Gewürze & Kräuter
  ('Salz', '["Speisesalz", "Kochsalz"]', 0, 0.0, 0.0, 0.0, 0.0, '{}', '{"Natrium": 38758}'),
  ('Pfeffer', '["Schwarzer Pfeffer"]', 251, 10.4, 63.9, 3.3, 25.3, '{"C": 0}', '{"Eisen": 9.7}'),
  ('Knoblauch', '[]', 149, 6.4, 33.1, 0.5, 2.1, '{"C": 31.2, "B6": 1.2}', '{"Selen": 14.2}'),

  -- Zucker & Süßes
  ('Zucker', '["Kristallzucker", "Haushaltszucker"]', 387, 0.0, 99.8, 0.0, 0.0, '{}', '{}'),
  ('Honig', '[]', 304, 0.3, 82.4, 0.0, 0.2, '{"C": 0.5}', '{"Kalium": 52}');

-- Add comment
COMMENT ON TABLE nutrition_database IS 'Populated with common German ingredients and their nutritional values per 100g';
