## Getting Started

First, set up the `.env` file:
```bash
cp .env.example .env
```

Run the docker services
```bash
PROFILE=prod docker compose --profile $PROFILE up -d
```

## Rebuild
```bash
PROFILE=prod SERVICES="api app" docker compose --profile $PROFILE up --build $SERVICES -d
```