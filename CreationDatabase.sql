CREATE TABLE Utilisateur(
   Id_utilisateur INT,
   Nom VARCHAR(200),
   Prénom VARCHAR(200),
   Email VARCHAR(200),
   motdepasse VARCHAR(200),
   PRIMARY KEY(Id_utilisateur)
);

CREATE TABLE Quête(
   Id_quête INT,
   Nom VARCHAR(200),
   description VARCHAR(200),
   points INT,
   date_debut DATE,
   date_fin DATE,
   PRIMARY KEY(Id_quête)
);

CREATE TABLE Personnage(
   Id_personnage INT,
   Nom VARCHAR(200),
   coût INT,
   matrice JSON, -- Colonne pour stocker la matrice au format JSON
   PRIMARY KEY(Id_personnage)
);

CREATE TABLE Animation(
   Id_animation INT,
   name VARCHAR(200),
   matrice JSON, -- Colonne pour stocker la matrice au format JSON
   Id_personnage INT, -- Clé étrangère pour lier à un personnage
   PRIMARY KEY(Id_animation),
   FOREIGN KEY(Id_personnage) REFERENCES Personnage(Id_personnage) ON DELETE CASCADE
);

CREATE TABLE Avoir(
   Id_utilisateur INT,
   Id_quête INT,
   PRIMARY KEY(Id_utilisateur, Id_quête),
   FOREIGN KEY(Id_utilisateur) REFERENCES Utilisateur(Id_utilisateur),
   FOREIGN KEY(Id_quête) REFERENCES Quête(Id_quête)
);

CREATE TABLE Possede(
   Id_utilisateur INT,
   Id_personnage INT,
   PRIMARY KEY(Id_utilisateur, Id_personnage),
   FOREIGN KEY(Id_utilisateur) REFERENCES Utilisateur(Id_utilisateur),
   FOREIGN KEY(Id_personnage) REFERENCES Personnage(Id_personnage)
);
