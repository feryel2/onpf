# Prompt pour générer le rapport de stage avec Claude

Ce fichier contient un prompt autonome et un dossier de contexte vérifié. Tu peux le copier-coller directement dans Claude pour obtenir une première version du rapport. Pour une analyse détaillée du code, joins l'archive `rapport-stage-contexte.zip` créée à la racine de ce projet, ou les fichiers indiqués dans la section « Fichiers à joindre pour une analyse complète ».

Important : Claude ne peut pas lire automatiquement les fichiers présents dans un dossier local comme `c:\xampp\htdocs\onpf`. Les chemins locaux ne constituent donc pas des pièces jointes. Le contexte ci-dessous est intégré dans ce fichier afin que le rapport puisse commencer sans dépendre d'un accès à ton ordinateur.

---

## Prompt

Tu es un expert en rédaction de rapports de stage universitaires et en analyse de projets informatiques. Je vais te fournir la documentation et le code source d'un projet réalisé pendant mon stage. Ta mission est de rédiger un rapport de stage complet, professionnel, cohérent et prêt à être relu puis adapté par l'étudiant.

### Contexte du projet

Le projet concerne la conception et le développement d'une application web administrative destinée à la gestion et au suivi des dossiers fonciers et des documents juridiques au sein de l'Office National de la Propriété Foncière en Tunisie (ONPF).

L'application permet notamment :

- l'authentification des utilisateurs ;
- la gestion des rôles et des droits d'accès ;
- la consultation et la création de dossiers fonciers ;
- le suivi de l'étude, de la vérification et de la validation finale des dossiers ;
- la consultation des documents juridiques ;
- la recherche de dossiers ;
- l'affichage de statistiques dans un tableau de bord ;
- la traçabilité des opérations effectuées.

### Technologies identifiées

- Frontend : Angular 16, TypeScript, SCSS, Bootstrap 5 et Bootstrap Icons ;
- Backend : Java, Spring Boot, Spring Data JPA et Spring Security ;
- Authentification : JWT ;
- Base de données : MySQL ;
- Communication : API REST et données JSON ;
- Interface : interface arabe avec prise en charge de l'affichage RTL.

### Consignes importantes

1. Analyse attentivement tous les fichiers fournis avant de rédiger le rapport.
2. Ne crée aucune information non présente dans les documents ou le code. Lorsqu'une information manque, écris `[À COMPLÉTER]` et indique précisément ce qui est attendu.
3. Distingue clairement :
   - les fonctionnalités réellement implémentées ;
   - les fonctionnalités partiellement implémentées ;
   - les fonctionnalités prévues mais non encore réalisées.
4. Ne présente pas une fonctionnalité comme terminée uniquement parce qu'elle apparaît dans une route, un composant ou la documentation.
5. Utilise un style académique, professionnel, clair et naturel, adapté à un rapport de stage en informatique.
6. Rédige le rapport en français. Conserve les noms des technologies, classes, routes API, rôles et variables dans leur forme technique originale.
7. Explique les choix techniques avec des phrases accessibles, sans exagérer la complexité du projet.
8. Évite les répétitions et les formulations vagues telles que « cette technologie est très importante » sans justification.
9. Ajoute des emplacements pour les captures d'écran sous la forme `[Insérer ici une capture d'écran : description]` lorsque cela est pertinent.
10. Ajoute des tableaux lorsque cela améliore la compréhension, notamment pour les technologies, les rôles, les fonctionnalités, les routes et les endpoints.
11. Ne fournis pas de fausses métriques, de faux résultats de tests, de faux noms de personnes ou de fausses dates.
12. Si le code révèle une incohérence avec la documentation, signale-la dans une section « Limites et écarts constatés ».

### Structure demandée

Rédige le rapport selon la structure suivante :

1. Page de garde
   - titre du rapport ;
   - nom de l'étudiant : `[À COMPLÉTER]` ;
   - établissement : `[À COMPLÉTER]` ;
   - entreprise ou organisme d'accueil : ONPF ;
   - encadrant professionnel : `[À COMPLÉTER]` ;
   - encadrant académique : `[À COMPLÉTER]` ;
   - période du stage : `[À COMPLÉTER]` ;
   - année universitaire : `[À COMPLÉTER]`.

2. Remerciements

3. Résumé en français
   - contexte ;
   - problématique ;
   - solution proposée ;
   - technologies utilisées ;
   - résultats obtenus.

4. Abstract en anglais
   - traduction fidèle du résumé ;
   - proposer aussi 4 à 6 mots-clés en anglais.

5. Introduction générale
   - contexte du stage ;
   - présentation du besoin ;
   - problématique ;
   - objectifs du projet ;
   - méthodologie de travail ;
   - présentation de la structure du rapport.

6. Présentation de l'organisme d'accueil
   - présentation de l'ONPF à partir des informations disponibles ;
   - rôle général de l'organisme dans le domaine foncier ;
   - service ou environnement concerné par le projet.
   - Si les informations institutionnelles ne sont pas fournies, utiliser `[À COMPLÉTER]` plutôt que d'inventer.

7. Étude de l'existant et analyse des besoins
   - situation existante ;
   - difficultés ou limites identifiées ;
   - solution proposée ;
   - acteurs du système ;
   - besoins fonctionnels ;
   - besoins non fonctionnels ;
   - contraintes techniques, organisationnelles et de sécurité.

8. Analyse et conception
   - architecture générale de l'application ;
   - séparation frontend/backend ;
   - architecture logique du backend ;
   - organisation du frontend Angular ;
   - modèle de données et principales entités ;
   - rôles et permissions ;
   - workflow d'étude, de vérification et de validation ;
   - principales routes de navigation ;
   - principales API REST.
   - Proposer des diagrammes UML pertinents en utilisant Mermaid lorsque les informations disponibles le permettent : cas d'utilisation, séquence, classes ou architecture.

9. Réalisation
   Décrire avec précision les parties effectivement présentes dans le code :
   - interface de connexion ;
   - tableau de bord ;
   - gestion des dossiers ;
   - détail d'un dossier ;
   - étude et vérification ;
   - recherche ;
   - journal des opérations ;
   - gestion des utilisateurs et paramètres ;
   - services Angular ;
   - guards et interceptors ;
   - modèles, DTO, repositories et sécurité backend ;
   - base de données ;
   - support de l'arabe et du RTL ;
   - responsive design.

   Pour chaque partie, préciser :
   - son objectif ;
   - son fonctionnement ;
   - les fichiers ou composants concernés ;
   - les technologies utilisées ;
   - son état réel : terminé, partiel ou prévu.

10. Sécurité
    - authentification JWT ;
    - stockage et transmission du jeton ;
    - protection des routes ;
    - contrôle d'accès selon les rôles ;
    - protection des API ;
    - bonnes pratiques et améliorations possibles.
    Signaler honnêtement les éléments absents ou non vérifiables.

11. Tests et validation
    - stratégie de test déductible du projet ;
    - scénarios fonctionnels pertinents ;
    - validation de la connexion ;
    - validation de la création et de la consultation d'un dossier ;
    - validation des rôles ;
    - validation des appels API ;
    - tests responsive et RTL.
    Ne présente aucun test comme exécuté si une preuve n'est pas fournie. Séparer « tests réalisés », « tests à réaliser » et « résultats non documentés ».

12. Difficultés rencontrées et solutions apportées
    - difficultés techniques ;
    - difficultés liées à l'intégration frontend/backend ;
    - difficultés liées à la sécurité ;
    - difficultés liées à l'interface arabe et RTL ;
    - solutions appliquées ou proposées.

13. Limites et perspectives
    - fonctionnalités restantes ;
    - limites techniques ;
    - dette technique éventuelle ;
    - améliorations de sécurité ;
    - ajout de tests automatisés ;
    - déploiement et maintenance ;
    - évolutions fonctionnelles possibles.

14. Conclusion générale
    - bilan du travail ;
    - objectifs atteints ;
    - compétences techniques et professionnelles acquises ;
    - apport du stage.

15. Bibliographie et webographie
    - uniquement les sources effectivement identifiables ou fournies ;
    - utiliser des références génériques clairement signalées si les liens exacts sont absents.

16. Annexes proposées
    - structure du projet ;
    - schéma de base de données ;
    - exemples de requêtes API ;
    - captures d'écran ;
    - extraits de code courts et utiles ;
    - guide d'installation.

### Format de sortie attendu

1. Commence par une courte liste des documents analysés et des informations manquantes.
2. Fournis ensuite le rapport complet avec des titres numérotés.
3. Utilise Markdown propre, compatible avec une conversion vers Word ou PDF.
4. Ajoute une table des matières proposée.
5. À la fin, ajoute une section « Informations à fournir par l'étudiant » regroupant tous les champs `[À COMPLÉTER]`.
6. À la fin, ajoute une section « Vérifications avant dépôt » contenant une checklist concise : exactitude technique, cohérence des dates, captures d'écran, tests, bibliographie, orthographe et mise en page.
7. Si le rapport est trop long pour une seule réponse, découpe-le en parties cohérentes et attends ma confirmation avant de poursuivre.

### Dossier de contexte intégré au prompt

Utilise les informations vérifiées ci-dessous comme base de rédaction. Ne les complète pas par des suppositions. Lorsque le contexte indique « prévu », « partiel » ou « à vérifier », conserve cette nuance dans le rapport.

#### Documents disponibles dans le projet

- `README.md` : présentation générale, installation, architecture, fonctionnalités et rôles.
- `DOCUMENTATION_FONCTIONNELLE.md` : routes Angular, formulaires, API REST, authentification et rôles.
- `DEVELOPER_GUIDE.md` : démarrage rapide, structure, états des dossiers, endpoints prévus et conseils de développement.
- `SETUP.md` : prérequis et procédure d'installation.
- `database/schema.sql` : schéma MySQL et utilisateurs de démonstration.
- `backend/pom.xml` et `frontend/package.json` : dépendances et technologies du projet.

#### Architecture vérifiée

- Le frontend est une application Angular 16 en TypeScript avec SCSS, Bootstrap 5 et Bootstrap Icons.
- Le backend est une application Java Spring Boot avec Spring Data JPA, Spring Security et JWT.
- La base de données est MySQL et contient les tables `users`, `real_estate_files`, `legal_documents` et `operations`.
- L'API est prévue sous `http://localhost:8080/api` et le frontend sous `http://localhost:4200`.
- L'interface est principalement en arabe et utilise une disposition RTL (`lang="ar"`, `dir="rtl"`).

#### Fonctionnalités et navigation vérifiées

Le routage Angular contient les écrans suivants : `/login`, `/dashboard`, `/files`, `/files/:id`, `/study/:id`, `/verification/:id`, `/final-verification/:id`, `/operations-log`, `/search`, `/users`, `/settings` et `/debug`.

Les routes protégées utilisent `AuthGuard`. Les écrans d'étude, de vérification, de vérification finale et de gestion des utilisateurs utilisent également `RoleGuard` avec les rôles `EDITOR`, `VERIFIER`, `SENIOR_VERIFIER` et, dans le routage, `ADMIN` pour certaines autorisations.

Le service Angular `AuthService` :

- appelle `POST /auth/login` ;
- stocke le JWT sous la clé `auth_token` ;
- stocke l'utilisateur sous la clé `user` ;
- expose l'utilisateur courant via un `BehaviorSubject` ;
- fournit des méthodes de contrôle des rôles.

L'intercepteur `AuthInterceptor` ajoute `Authorization: Bearer <jwt-token>` et `Content-Type: application/json` aux requêtes authentifiées.

La configuration Spring Security vérifiée :

- désactive CSRF pour l'API ;
- utilise une session stateless ;
- autorise `POST /auth/login` et `GET /health` sans authentification ;
- exige l'authentification pour les autres requêtes ;
- utilise `BCryptPasswordEncoder` ;
- installe un filtre JWT avant `UsernamePasswordAuthenticationFilter` ;
- renvoie les erreurs HTTP 401 et 403 correspondantes.

#### Modèle de données vérifié

- `users` : identifiant, nom d'utilisateur, mot de passe BCrypt, email, nom complet, rôle et dates.
- `real_estate_files` : numéro du dossier, numéro du titre foncier, objet, date de dépôt, source, état, responsables, notes et dates.
- `legal_documents` : type, numéro, date, état, résultat de vérification, notes et relation avec un dossier.
- `operations` : dossier, utilisateur, type d'opération, ancien état, nouvel état, notes et horodatage.

Les états de dossier déclarés sont `NEW`, `UNDER_STUDY`, `AWAITING_VERIFICATION`, `UNDER_VERIFICATION`, `RETURNED_FOR_CORRECTION`, `AWAITING_FINAL_VERIFICATION`, `UNDER_FINAL_VERIFICATION`, `APPROVED` et `CLOSED`.

Les rôles déclarés dans la base sont `EDITOR`, `VERIFIER` et `SENIOR_VERIFIER`. Le routage mentionne également `ADMIN` dans certaines règles, mais ce rôle n'est pas déclaré dans l'énumération SQL fournie : signale cet écart dans les limites techniques au lieu de le corriger ou de l'ignorer.

#### État d'avancement à respecter

- Présents dans le projet : structure Angular, pages principales, routing, support RTL, services d'authentification et de fichiers, guards, interceptor, modèles backend, repositories, sécurité JWT, configuration et schéma SQL.
- À vérifier dans le code joint : implémentation exacte des contrôleurs, endpoints effectivement opérationnels, intégration complète frontend/backend, résultats des tests et état réel des pages affichées comme placeholders.
- Mentionnés comme restant à faire dans la documentation : tests unitaires, gestion complète des erreurs, services et contrôleurs de workflow, recherche complète, journal des opérations complet, gestion complète des documents et statistiques selon l'état réel du code.

#### Règle de preuve

Le dossier intégré est une synthèse de contexte, pas une preuve que tous les écrans ou endpoints sont terminés. Pour chaque fonctionnalité, indique « implémentée », « partiellement implémentée », « prévue » ou « non vérifiable » selon les fichiers fournis.

### Fichiers à joindre pour une analyse complète du code

Une archive prête à joindre, nommée `rapport-stage-contexte.zip`, est disponible à la racine du projet. Elle contient les fichiers principaux déjà sélectionnés. Si tu préfères joindre les fichiers séparément, utilise la liste suivante :

- Documentation : `README.md`, `DOCUMENTATION_FONCTIONNELLE.md`, `DEVELOPER_GUIDE.md`, `SETUP.md`.
- Frontend : `frontend/src/app/app-routing.module.ts`, `frontend/src/app/guards/`, `frontend/src/app/interceptors/`, `frontend/src/app/services/`, ainsi que les composants des pages `login`, `dashboard`, `files`, `file-details`, `study`, `verification`, `final-verification`, `search` et `operations-log`.
- Backend : `backend/src/main/java/tn/gov/onpf/security/`, `controller/`, `service/`, `model/`, `dto/` et `repository/`.
- Base de données et configuration : `database/schema.sql`, `backend/pom.xml`, `backend/src/main/resources/application.yml` et `frontend/package.json`.

Si tu ne joins pas ces fichiers, rédige quand même le rapport à partir du dossier de contexte intégré, mais marque comme « non vérifiable » toute affirmation qui nécessiterait une lecture du code absent.

---

## Informations personnelles à ajouter avant l'envoi à Claude

- Nom et prénom : `[À COMPLÉTER]`
- Formation et niveau : `[À COMPLÉTER]`
- Établissement universitaire : `[À COMPLÉTER]`
- Organisme d'accueil : ONPF
- Service d'accueil : `[À COMPLÉTER]`
- Encadrant professionnel : `[À COMPLÉTER]`
- Encadrant académique : `[À COMPLÉTER]`
- Date de début du stage : `[À COMPLÉTER]`
- Date de fin du stage : `[À COMPLÉTER]`
- Ville : `[À COMPLÉTER]`
- Méthodologie de gestion du projet : `[À COMPLÉTER : Agile, Scrum, cycle en V, etc.]`
- Outils utilisés pendant le stage : `[À COMPLÉTER]`
- Travaux réellement effectués par l'étudiant : `[À COMPLÉTER]`
