# Site public APSL

Site public responsive de l’Association des Pilotes du Saguenay–Lac-Saint-Jean.

## Architecture

- Cloudflare Worker + Static Assets
- Dépôt GitHub : `Pascalmou65/site_apsl_public`
- Données publiques synchronisées depuis le portail APSL / Supabase
- Navigation SPA avec routes par hash, compatible ordinateur et mobile/iPhone

## Données synchronisées

- Activités publiées (`association_activities`)
- Cotisations annuelles (`membership_types`)
- Conseil d’administration et portraits
- Photos sélectionnées du portail
- Album Simulateur

Les réunions internes ne sont pas affichées sur la page Activités.

## Développement

```bash
npm install
npm run dev
```

## Déploiement Cloudflare

```bash
npm run deploy
```
