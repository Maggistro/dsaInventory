INSERT INTO inventory (name, userId, active, shared) VALUES ('private-inactive', 'user1', 0, 0);
INSERT INTO inventory (name, userId, active, shared) VALUES ('private-active', 'user1', 1, 0);
INSERT INTO inventory (name, userId, active, shared) VALUES ('shared', 'user2', 0, 1);

INSERT INTO item (name, count, weight, inventory) VALUES ('private-item-inactive-1', 1, 0.5, 1);
INSERT INTO item (name, count, weight, inventory) VALUES ('private-item-inactive-2', 1, 0.5, 1);
INSERT INTO item (name, count, weight, inventory) VALUES ('duplicate-name', 1, 0.5, 1);

INSERT INTO item (name, count, weight, inventory) VALUES ('private-item-active-1', 1, 0.5, 2);
INSERT INTO item (name, count, weight, inventory) VALUES ('private-item-active-2', 1, 0.5, 2);
INSERT INTO item (name, count, weight, inventory) VALUES ('duplicate-name', 1, 0.5, 2);

INSERT INTO item (name, count, weight, inventory) VALUES ('shared-item', 1, 0.5, 3);
