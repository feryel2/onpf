# Documentation fonctionnelle et technique — ONPF

## 1. Objet du projet

L'application ONPF est une interface de gestion et de suivi des dossiers fonciers. Elle permet de se connecter, consulter les dossiers, créer un nouveau dossier, suivre son état, consulter les documents juridiques et tracer les opérations réalisées.

L'interface est en arabe et utilise une disposition de droite à gauche (RTL).

## 2. Technologies utilisées

| Partie | Technologies |
| --- | --- |
| Frontend | Angular 16, TypeScript, SCSS, Bootstrap 5 et Bootstrap Icons |
| Backend prévu | Java, Spring Boot, Spring Data JPA, Spring Security et JWT |
| Base de données | MySQL |
| API | REST / JSON sur `http://localhost:8080/api` |

## 3. Démarrage du projet

### Frontend

```powershell
cd frontend
npm install
npm start
```

Le front est généralement servi sur `http://localhost:4200`.

Pour construire le projet :

```powershell
npm run build -- --configuration development
```

### Backend et base de données

1. Créer les tables MySQL avec le fichier `database/schema.sql`.
2. Démarrer MySQL.
3. Depuis le dossier `backend`, exécuter `mvn spring-boot:run`.

Le backend est prévu sur `http://localhost:8080/api`.

## 4. Écrans et navigation

Après authentification, l'utilisateur accède à une mise en page comprenant une barre latérale, un en-tête et le contenu de la page sélectionnée.

| Route | Écran | Fonction principale |
| --- | --- | --- |
| `/login` | Connexion | Authentification de l'utilisateur |
| `/dashboard` | Tableau de bord | Affiche les statistiques des dossiers |
| `/files` | Dossiers fonciers | Liste des dossiers et création d'un dossier |
| `/files/:id` | Détail d’un dossier | Consultation d’un dossier précis |
| `/study/:id` | Étude | Traitement du dossier par l’éditeur |
| `/verification/:id` | Vérification | Vérification du dossier et des documents |
| `/final-verification/:id` | Vérification finale | Validation finale du dossier |
| `/operations-log` | Journal des opérations | Historique des actions effectuées |
| `/search` | Recherche | Recherche de dossiers |
| `/users` | Utilisateurs | Gestion des utilisateurs et droits |
| `/settings` | Paramètres | Configuration de l’application |
| `/debug` | Diagnostic | Vérification de l’API et test de connexion |

Les routes protégées nécessitent une authentification. Sans jeton de connexion, l'utilisateur est redirigé vers la page de connexion.

## 5. Formulaires du site

### 5.1 Formulaire de connexion

Accessible par `/login`.

| Champ | Type | Règle de validation | Donnée envoyée |
| --- | --- | --- | --- |
| Nom d’utilisateur | Texte | Obligatoire | `username` |
| Mot de passe | Mot de passe | Obligatoire | `password` |

À l’envoi, le formulaire exécute `POST /auth/login`. Si la réponse contient un jeton, celui-ci est sauvegardé dans le navigateur sous la clé `auth_token`. Les informations de l’utilisateur sont sauvegardées sous la clé `user`.

Exemple de corps envoyé :

```json
{
  "username": "editor_user",
  "password": "password"
}
```

Réponse attendue :

```json
{
  "token": "jwt-token",
  "user": {
    "id": "1",
    "username": "editor_user",
    "email": "editor@onpf.tn",
    "fullName": "Nom complet",
    "role": "EDITOR"
  }
}
```

### 5.2 Formulaire « Ajouter un nouveau dossier »

Accessible depuis la page `/files` avec le bouton arabe « إضافة ملف جديد ».

| Champ | Type | Règle de validation | Donnée envoyée |
| --- | --- | --- | --- |
| Numéro du dossier | Texte | Obligatoire | `fileNumber` |
| Numéro du titre foncier | Texte | Obligatoire | `lotNumber` |
| Objet | Zone de texte | Obligatoire | `subject` |
| Date de dépôt | Date | Obligatoire | `filingDate` |
| Source | Liste | Obligatoire | `source` |

Valeurs proposées pour `source` :

- `CITIZEN_REQUEST` : demande d’un citoyen
- `REGISTRY_REQUEST` : demande du registre
- `COURT_REQUEST` : demande du tribunal
- `OTHER` : autre source

Le formulaire est bloqué tant que les champs obligatoires sont vides. À la validation, il appelle `POST /files`, ferme la fenêtre puis recharge la liste.

Exemple de corps envoyé :

```json
{
  "fileNumber": "FILE-2026-001",
  "lotNumber": "LOT-101",
  "subject": "Objet du dossier",
  "filingDate": "2026-09-07",
  "source": "CITIZEN_REQUEST"
}
```

## 6. Gestion de l’authentification et des rôles

Le frontend ajoute automatiquement l’en-tête suivant aux requêtes lorsque l’utilisateur est connecté :

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Les rôles prévus dans la base de données sont :

| Rôle | Signification |
| --- | --- |
| `EDITOR` | Éditeur / responsable de l’étude |
| `VERIFIER` | Vérificateur |
| `SENIOR_VERIFIER` | Vérificateur senior / validation finale |

La barre latérale affiche certaines sections selon le rôle connecté.

## 7. API REST utilisées par le frontend

Les appels suivants sont définis dans les services Angular. Tous les chemins sont relatifs à `http://localhost:8080/api`.

### Authentification

| Méthode | URL | Description |
| --- | --- | --- |
| `POST` | `/auth/login` | Connexion et récupération du JWT |
| `POST` | `/auth/change-password` | Changement du mot de passe du compte connecté |

### Dossiers

| Méthode | URL | Description |
| --- | --- | --- |
| `GET` | `/files?page=0&size=10` | Liste paginée des dossiers |
| `GET` | `/files?status=...&fileNumber=...&lotNumber=...` | Liste filtrée des dossiers |
| `GET` | `/files?q=...&status=...` | Recherche paginée dans le numéro, le titre foncier, l'objet, les notes et les données cadastrales |
| `GET` | `/files/{id}` | Détail d’un dossier |
| `POST` | `/files` | Création d’un dossier |
| `POST` | `/files/{fileId}/documents` | Ajout d'un document pendant l'étude |
| `DELETE` | `/files/{fileId}/documents/{documentId}` | Suppression d'un document pendant l'étude |
| `PUT` | `/files/{id}` | Modification d’un dossier |
| `GET` | `/files/statistics` | Statistiques du tableau de bord |
| `POST` | `/files/{id}/assign-to-verification` | Envoi à la vérification |
| `POST` | `/files/{id}/approve` | Approbation d’un dossier |
| `POST` | `/files/{id}/return-for-correction` | Retour du dossier pour correction |
| `POST` | `/files/{fileId}/documents/{documentId}/verify` | Vérification d’un document |

### Utilisateurs

| Méthode | URL | Description |
| --- | --- | --- |
| `GET` | `/users` | Liste des comptes, réservée à `SENIOR_VERIFIER` |
| `POST` | `/users` | Création d'un compte avec mot de passe initial, réservée à `SENIOR_VERIFIER` |
| `PUT` | `/users/{id}` | Modification du profil, du rôle ou de l'activation, réservée à `SENIOR_VERIFIER` |

### Journal et diagnostic

| Méthode | URL | Description |
| --- | --- | --- |
| `GET` | `/operations` | Liste du journal des opérations |
| `GET` | `/operations/file/{fileId}` | Opérations d’un dossier |
| `GET` | `/health` | État de santé de l’API |

### Exemple de réponse de liste paginée

```json
{
  "content": [
    {
      "id": "1",
      "fileNumber": "FILE-2026-001",
      "lotNumber": "LOT-101",
      "subject": "Objet du dossier",
      "filingDate": "2026-09-07",
      "status": "NEW",
      "source": "CITIZEN_REQUEST"
    }
  ]
}
```

## 8. Données et relations de la base de données

| Table | Rôle | Relations principales |
| --- | --- | --- |
| `users` | Comptes et rôles utilisateurs | Responsable d’étude, assignation et opérations |
| `real_estate_files` | Dossiers fonciers | Lié à deux utilisateurs, documents et opérations |
| `legal_documents` | Documents juridiques | Lié à un dossier via `file_id` |
| `operations` | Historique des opérations | Lié à un dossier et à l’utilisateur auteur |

Les documents et opérations sont supprimés automatiquement lorsqu’un dossier est supprimé, grâce à la contrainte `ON DELETE CASCADE`.
Les champs cadastraux et les informations de l'enregistrement final sont conservés au format JSON dans `real_estate_files`. Pour une base existante, exécuter une seule fois `database/migration_add_cadastral_data.sql`; les nouvelles installations récupèrent ces colonnes depuis `database/schema.sql`.

### États possibles d’un dossier

- `NEW`
- `UNDER_STUDY`
- `AWAITING_VERIFICATION`
- `UNDER_VERIFICATION`
- `RETURNED_FOR_CORRECTION`
- `AWAITING_FINAL_VERIFICATION`
- `UNDER_FINAL_VERIFICATION`
- `APPROVED`
- `CLOSED`

## 9. Backend et sécurité

Le backend contient les entités JPA (`User`, `RealEstateFile`, `LegalDocument`, `Operation`), les repositories, les contrôleurs REST, le service de workflow et le journal des opérations.

Spring Security est configuré en mode sans session. Seuls `POST /api/auth/login` et `GET /api/health` sont publics. Les autres routes exigent un JWT valide. Les opérations d’étude sont réservées à `EDITOR`, celles de vérification à `VERIFIER` et celles de validation finale à `SENIOR_VERIFIER`; le contrôle est effectué côté backend avec `@PreAuthorize`.

Au démarrage, le backend crée les trois utilisateurs de démonstration s’ils n’existent pas encore, avec des mots de passe BCrypt. La base doit néanmoins être initialisée avec `database/schema.sql` et MySQL doit être disponible.

## 10. Comptes de démonstration prévus

Le script SQL prévoit ces comptes de test :

| Utilisateur | Mot de passe indiqué | Rôle |
| --- | --- | --- |
| `editor_user` | `password` | `EDITOR` |
| `verifier_user` | `password` | `VERIFIER` |
| `senior_verifier` | `password` | `SENIOR_VERIFIER` |

Ces identifiants sont à utiliser uniquement en développement et doivent être modifiés avant une mise en production.
