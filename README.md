## Getting Started

First, set up the `.env` file:
```bash
cp .env.example .env
# Then update environment variables
```

Run the docker services
```bash
docker compose --profile prod up -d
# OR
docker compose --profile dev up -d
```

## Rebuild
```bash
docker compose --profile prod up --build api app -d
```