# Nawy Apartments

Take-home apartment listing app: browse projects and apartments, filter units, upload images, and create listings.

## Live demo

If you do not want to run the project locally, or you hit any issues while running it, you can fully browse and test the app here:

| What | URL |
| --- | --- |
| App | [https://nawy-apartments.up.railway.app](https://nawy-apartments.up.railway.app/) |
| API | [https://nawy-apartments-bk.up.railway.app/api](https://nawy-apartments-bk.up.railway.app/api) |
| Swagger | [https://nawy-apartments-bk.up.railway.app/api/docs](https://nawy-apartments-bk.up.railway.app/api/docs) |

| Layer | Stack | Port (local) |
| --- | --- | --- |
| Backend | NestJS 11, TypeORM, PostgreSQL | `3000` |
| Frontend | Next.js 16 (App Router), React 19, MUI 9 | `3001` |

### Local URLs (when running yourself)

API base URL: `http://localhost:3000/api`  
Swagger UI: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)  
Static images: `http://localhost:3000/uploads/...`

---

## Features

### Projects
- Create a project (unique name)
- List / search projects with pagination (`page`, `limit`, `hasNextPage`)

### Apartments
- Create apartment (optional project, images via upload)
- List with search + filters
- Details page with gallery, specs, and project info

### Uploads
- `POST /api/uploads` stores the file locally and returns `{ path, url }`
- Create apartment sends those `path` values (not raw files) in the request body

### API documentation
- **Swagger UI** (interactive): [local](http://localhost:3000/api/docs) · [production](https://nawy-apartments-bk.up.railway.app/api/docs)
- **Postman collection**: `backend/documentation/Apartments.postman_collection.json`  
  Import into Postman and set the `Domain` variable to `http://localhost:3000` (local) or `https://nawy-apartments-bk.up.railway.app` (production).

---

## Run with Docker

Requires [Docker](https://docs.docker.com/get-docker/) and Docker Compose.

From the repo root:

```bash
docker compose up --build
```

Detached mode:

```bash
docker compose up --build -d
```

Then open:

| What | URL |
| --- | --- |
| Frontend | [http://localhost:3001](http://localhost:3001) |
| Backend API | [http://localhost:3000/api](http://localhost:3000/api) |
| Swagger docs | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) |

Stop:

```bash
# foreground: Ctrl+C
docker compose down
```

Compose services:

| Service | Container | URL / port | Notes |
| --- | --- | --- | --- |
| `frontend` | `nawy-frontend` | `http://localhost:3001` | Next.js |
| `backend` | `nawy-backend` | `http://localhost:3000` | NestJS · docs at `/api/docs` |
| `db` | `nawy-db` | `localhost:5432` | Postgres (`postgres` / `postgres` / `apartments_db`) |

Uploaded images persist in the `uploads_data` volume; DB data in `postgres_data`.

Or skip local setup and use the [live Railway deployment](https://nawy-apartments.up.railway.app/).

---

## Local development (without Docker)

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL 14+ (or start only the DB with `docker compose up db -d`)

### 1. Database

```bash
createdb apartments_db
# or
docker compose up db -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# edit DB_* to match your Postgres credentials
npm install
npm run start:dev
```

Backend: [http://localhost:3000](http://localhost:3000)  
Tables are created automatically via TypeORM `synchronize` when `NODE_ENV` is not `production`, or when `DB_SYNCHRONIZE=true`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend: [http://localhost:3001](http://localhost:3001)

---

## Environment

### Backend (`backend/.env`)

| Variable | Description | Example |
| --- | --- | --- |
| `PORT` | API port | `3000` |
| `APP_URL` | Public base URL used to build image URLs | `http://localhost:3000` |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | `http://localhost:3000,http://localhost:3001` |
| `DB_HOST` | Postgres host | `localhost` |
| `DB_PORT` | Postgres port | `5432` |
| `DB_USERNAME` | Postgres user | `postgres` |
| `DB_PASSWORD` | Postgres password | `postgres` |
| `DB_NAME` | Database name | `apartments_db` |
| `DB_SYNCHRONIZE` | Auto-create/update tables (`true`/`false`) | unset (on unless `NODE_ENV=production`) |

Copy from `backend/.env.example` and adjust credentials.

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API prefix | `http://localhost:3000/api` |

---

## Project structure

```text
nawy-apartments/
├── docker-compose.yml       # One-command stack (db + backend + frontend)
├── backend/                 # NestJS API
│   ├── Dockerfile
│   ├── documentation/       # Postman collection
│   ├── src/
│   │   ├── apartment/       # Entity, DTOs, mapper, service, controller + Swagger docs
│   │   ├── project/         # Entity, DTOs, mapper, service, controller + Swagger docs
│   │   ├── upload/          # Multipart upload endpoint + Swagger docs
│   │   ├── storage/         # Multer + local disk storage
│   │   └── shared/          # DB helpers (e.g. unique violation)
│   └── uploads/images/      # Stored image files (gitignored content)
└── frontend/                # Next.js app
    ├── Dockerfile
    └── src/
        ├── app/             # Routes (App Router)
        ├── components/      # Shared UI (buttons, card, tag, navbar)
        ├── features/        # Domain UI + hooks (projects, apartments, home)
        ├── lib/api/         # Fetch clients
        └── types/           # Shared TS types / enums
```

---

## API reference

- Swagger: [local](http://localhost:3000/api/docs) · [production](https://nawy-apartments-bk.up.railway.app/api/docs)
- Postman: import `backend/documentation/Apartments.postman_collection.json` (`Domain` = host without `/api`)

Global prefix: `/api`  
Validation: `class-validator` via global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`)

### Uploads

#### `POST /api/uploads`

Multipart form field: `file`

Allowed: `jpeg`, `png`, `webp`, `gif` · max **5MB**

**Response**

```json
{
  "path": "/uploads/images/<uuid>.jpeg",
  "url": "http://localhost:3000/uploads/images/<uuid>.jpeg"
}
```

Serve the file at: `GET /uploads/images/<filename>` (outside `/api`).

---

### Projects

#### `POST /api/projects`

```json
{
  "name": "Palm Hills",
  "description": "Optional description"
}
```

- `409` if the name already exists

#### `GET /api/projects`

| Query | Type | Default | Notes |
| --- | --- | --- | --- |
| `search` | string | — | Case-insensitive name match |
| `page` | number | `1` | |
| `limit` | number | `20` | |

**Response**

```json
{
  "data": [{ "id": 1, "name": "Palm Hills", "description": null, "createdAt": "..." }],
  "page": 1,
  "limit": 20,
  "hasNextPage": false
}
```

---

### Apartments

#### `POST /api/apartments`

Typical flow:

1. Upload each image with `POST /api/uploads`
2. Create the apartment with the returned `path` values

```json
{
  "unitName": "Sky Villa A",
  "unitNumber": "A-12",
  "type": "apartment",
  "projectId": 1,
  "description": "Sea view unit",
  "price": 4500000,
  "area": 180,
  "rooms": 4,
  "bedrooms": 3,
  "bathrooms": 2,
  "floor": 8,
  "finishingStatus": "finished",
  "images": [
    { "path": "/uploads/images/....jpeg", "type": "hero" },
    { "path": "/uploads/images/....jpeg", "type": "carousel" }
  ]
}
```

**Enums**

| Field | Values |
| --- | --- |
| `type` | `studio`, `apartment`, `duplex`, `penthouse` |
| `finishingStatus` | `core_and_shell`, `semi_finished`, `finished` |
| `images[].type` | `hero`, `carousel` |

**Errors**

- `404` — `projectId` does not exist
- `409` — same `unitNumber` already exists in that project

#### `GET /api/apartments`

| Query | Type | Notes |
| --- | --- | --- |
| `search` | string | Matches **unit name** and **project name** |
| `projectId` | number | Exact |
| `type` | enum | Exact |
| `finishingStatus` | enum | Exact |
| `minPrice` / `maxPrice` | number | Range |
| `minArea` / `maxArea` | number | Range |
| `rooms` | number | Exact |
| `bedrooms` | number | Exact |
| `bathrooms` | number | Exact |
| `floor` | number | Exact |
| `page` | number | Default `1` |
| `limit` | number | Default `20`, max `50` |

List items are slim (hero `imageUrl` + core fields). Pagination shape matches projects.

#### `GET /api/apartments/:id`

Full apartment: project, all images (with `url`), specs, description.

---

## Frontend routes

| Route | Description |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/projects` | Projects list + search |
| `/projects/new` | Create project |
| `/apartments` | Apartments list + filters |
| `/apartments/new` | Create apartment (upload → create) |
| `/apartments/[id]` | Apartment details |

---

## Demo checklist

1. Start Postgres, backend, and frontend
2. Create a project at `/projects/new`
3. Upload images and create an apartment at `/apartments/new` (assign the project, mark at least one image as `hero`)
4. Confirm it appears on `/apartments` and opens on `/apartments/[id]`
5. Try filters (type, bedrooms, price range, project)
6. Create a duplicate unit number in the same project → expect `409`

---

## Scripts

### Backend

```bash
npm run start:dev   # watch mode
npm run build
npm run start:prod
npm run lint
```

### Frontend

```bash
npm run dev         # http://localhost:3001
npm run build
npm run start
npm run lint
```

---

## Notes

- Image paths are stored in the DB; full URLs are built from `APP_URL` so the host can change without rewriting rows.
- Uploads are stored under `backend/uploads/images/` and served statically at `/uploads`.
- Apartment listing loads project + hero images only (not full carousel) for performance.
- Unique constraint: `(unit_number, project_id)`. With no project (`project_id` null), Postgres treats rows as distinct, so the same unit number can repeat across “no project” units.
