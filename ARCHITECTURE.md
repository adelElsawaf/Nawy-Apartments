# Architecture & Design Decisions

This document explains the main architectural and technical decisions behind the Nawy Apartments application.

The goal is to keep the implementation simple for the current scope while maintaining clear boundaries and allowing the system to evolve as requirements grow.

---

## 1. System Architecture

The application consists of three main components:

```text
                         ┌──────────────────────┐
                         │      Next.js         │
                         │      Frontend        │
                         │  Railway / Docker    │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / REST
                                    ▼
                         ┌──────────────────────┐
                         │       NestJS         │
                         │       Backend        │
                         │  Railway / Docker    │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
             ┌───────────────┐             ┌────────────────┐
             │  PostgreSQL   │             │ Volume / Disk  │
             │               │             │     Images     │
             └───────────────┘             └────────────────┘
```

Locally, `docker compose up --build` runs Postgres, the API, and the frontend together. In production, the same shape is deployed on Railway (app + API + Postgres + volume for uploads).

### Backend structure

The backend is organized around business domains:

```text
backend/src/
├── apartment/
│   ├── apartment.controller.ts
│   ├── apartment.service.ts
│   ├── entities/
│   ├── dto/
│   ├── mappers/
│   ├── enums/
│   └── documentation/
│
├── project/
│   ├── project.controller.ts
│   ├── project.service.ts
│   ├── project.entity.ts
│   ├── dto/
│   ├── mappers/
│   └── documentation/
│
├── upload/
├── storage/
└── shared/
```

Each domain owns its controller, service, DTOs, entities, mappers, and domain-specific documentation.

The matching frontend lives under `frontend/src` (see **§24. Frontend Architecture**).

---

# 2. Data Model

The core relationship is:

```text
projects (1)
     │
     │
     └──────────────< apartments (N)
                            │
                            │
                            └──────────────< apartment_images (N)
```

The main entities are:

- `Project`
- `Apartment`
- `ApartmentImage`

---

# 3. Project → Apartment

An apartment optionally belongs to a project.

```text
Project
   │
   └── 1:N ── Apartment
```

The `apartments` table contains an optional foreign key:

```text
project_id → projects.id
```

The relationship uses:

```ts
@ManyToOne('Project', {
  nullable: true,
  onDelete: 'SET NULL',
})
```

### Why is the project optional?

An apartment can exist before it has been assigned to a project.

This allows the API to support:

```text
Apartment without project
Apartment assigned to project
```

If a project is deleted, its apartments are not deleted. Instead, their `project_id` becomes `NULL`.

This prevents accidental cascading deletion of apartment data.

---

# 4. Apartment Unit Uniqueness

An apartment has a `unitNumber`.

The database enforces:

```text
(unit_number, project_id)
```

as a unique combination.

```ts
@Unique(['unitNumber', 'project'])
```

Therefore:

```text
Project A + A-101 → allowed
Project A + A-101 → ❌ duplicate

Project B + A-101 → allowed
```

The constraint is enforced at the database level rather than relying only on an application-level existence check.

This is important because application-level checks can still allow duplicates under concurrent requests.

The service converts a PostgreSQL unique constraint violation into:

```text
HTTP 409 Conflict
```

---

# 5. Apartment → Images

An apartment can have multiple images:

```text
Apartment (1)
     │
     └── 1:N ── ApartmentImage
```

The `apartment_images` table contains:

```text
id
apartment_id
path
type
created_at
```

The relationship uses:

```ts
@OneToMany('ApartmentImage', 'apartment', {
  cascade: ['insert'],
})
```

and:

```ts
@ManyToOne('Apartment', 'images', {
  onDelete: 'CASCADE',
})
```

Deleting an apartment therefore removes its image records.

### Why separate images into their own table?

Images have their own:

- path
- type
- creation timestamp
- lifecycle

A separate table is more appropriate than storing an array of images inside the apartment record.

It also makes future image management easier.

---

# 6. Image Types

Currently images have two types:

```ts
enum ApartmentImageType {
  Hero = 'hero',
  Carousel = 'carousel',
}
```

The distinction allows different API responses for different use cases.

### Apartment listing

The **HTTP list response** only exposes a hero `imageUrl` (plus card fields). The client does not receive the full gallery on listing.

The listing query may still load image relations server-side so the mapper can pick the hero; only that URL is returned in the DTO.

```text
Apartment card (API response)
├── core apartment information
└── imageUrl (hero only)
```

### Apartment details

The details endpoint returns the complete gallery (`path`, `url`, `type` per image).

This keeps list payloads small for the frontend while details can render the full carousel.

---

# 7. Image Upload Flow

Images are uploaded separately from apartment creation.

```text
Client
   │
   │ POST /api/uploads
   ▼
Upload Service
   │
   ▼
Storage
   │
   └── returns image path
             │
             ▼
      POST /api/apartments
             │
             └── stores image path
```

Example:

```json
{
  "path": "/uploads/images/example.jpeg",
  "url": "http://localhost:3000/uploads/images/example.jpeg"
}
```

The apartment creation request then references the returned path.

### Why separate upload from apartment creation?

This keeps multipart file handling separate from the apartment domain.

The apartment API only deals with image references:

```json
{
  "images": [
    {
      "path": "/uploads/images/example.jpeg",
      "type": "hero"
    }
  ]
}
```

It also makes it easier to replace the storage implementation later.

---

# 8. Image Storage

The database does not store the binary image itself.

Instead:

```text
PostgreSQL
    │
    └── image metadata + path

Railway Volume
    │
    └── actual image file
```

For example:

```text
Database:
path = /uploads/images/abc.jpeg

Volume:
/app/uploads/images/abc.jpeg
```

This keeps binary files outside PostgreSQL.

---

# 9. Why Store Paths Instead of Full URLs?

The database stores:

```text
/uploads/images/abc.jpeg
```

instead of:

```text
https://nawy-apartments-bk.up.railway.app/uploads/images/abc.jpeg
```

The full URL is constructed at response time:

```text
APP_URL + path
```

For example:

```text
APP_URL:
https://nawy-apartments-bk.up.railway.app

path:
/uploads/images/abc.jpeg

result:
https://nawy-apartments-bk.up.railway.app/uploads/images/abc.jpeg
```

### Benefits

The database is independent of the deployment environment.

The same database record can work with:

- localhost
- Railway
- another domain
- a CDN
- future object storage

without rewriting stored records.

---

# 10. Railway Volume

Uploaded images are stored on a Railway Volume.

Container filesystems are ephemeral, meaning files stored only inside the container can disappear when a deployment creates a new container.

Without persistent storage:

```text
Deploy
  ↓
New container
  ↓
Old files disappear
  ↓
Database still contains image paths
  ↓
Broken image URLs
```

The Railway Volume provides persistent storage for:

```text
/app/uploads
```

This allows uploaded images to survive redeployments.

---

# 11. Future Object Storage

The current implementation uses local disk + Railway Volume because it is simple and appropriate for the current scope.

For a production-scale system, the storage implementation could be replaced with:

- Amazon S3
- Cloudflare R2
- Google Cloud Storage
- another object-storage provider

The architecture can become:

```text
Current:

Client
  │
  ▼
NestJS
  │
  ▼
Railway Volume
  │
  ▼
path stored in DB


Future:

Client
  │
  ▼
NestJS / Signed URL
  │
  ▼
S3 / R2
  │
  ▼
object key stored in DB
```

The apartment and image domain models can remain largely unchanged.

Only the storage implementation and URL generation need to change.

---

# 12. Dynamic Apartment Filtering

Apartment listing supports multiple optional filters:

- `search`
- `projectId`
- `type`
- `finishingStatus`
- `minPrice` / `maxPrice`
- `minArea` / `maxArea`
- `rooms`
- `bedrooms`
- `bathrooms`
- `floor`

Because these filters are dynamic, the backend uses TypeORM `QueryBuilder`.

The query is constructed incrementally:

```text
Base query
   │
   ├── search?
   ├── projectId?
   ├── type?
   ├── finishingStatus?
   ├── minPrice / maxPrice?
   ├── minArea / maxArea?
   ├── rooms?
   ├── bedrooms?
   ├── bathrooms?
   └── floor?
```

Only filters provided by the client are added to the query.

This keeps the query flexible without creating a separate repository method for every filter combination.

---

# 13. Search

Search currently supports:

- apartment unit name
- project name

Conceptually, the query behaves like:

```sql
WHERE
    unit_name ILIKE '%search%'
    OR
    project_name ILIKE '%search%'
```

This allows users to search for either an apartment or its project.

---

# 14. Relation Loading

The apartment listing needs project data (for cards and search) and images (to resolve the hero URL).

The query uses:

```ts
.leftJoin('apartment.project', 'project') // join for filtering / search on project.name
.setFindOptions({
  relations: { project: true, images: true },
  relationLoadStrategy: 'query',
})
```

`relationLoadStrategy: 'query'` loads relations in **separate SELECTs** after the main apartment page is resolved, instead of one large JOIN that multiplies rows.

This matters because an apartment can have multiple images:

```text
Apartment A
├── Image 1
├── Image 2
└── Image 3
```

Using `leftJoinAndSelect` on `images` together with `skip` / `take` would apply `LIMIT`/`OFFSET` to joined rows, which can break pagination. Query-based relation loading avoids that.

`leftJoin` (without select) on `project` is still used so `WHERE` clauses can reference `project.name` / `project.id`.

---

# 15. List vs Details

The API intentionally uses different response shapes for listing and details.

### List

The apartment list returns only information needed for apartment cards (`GetAllItemResponseDto`):

```text
id
unitName
unitNumber
type
price
area
bedrooms
bathrooms
project
imageUrl   // hero public URL, or null
```

### Details

The details endpoint returns (`ApartmentResponseDto`):

```text
id
unitName
unitNumber
type
project
description
price
area
rooms
bedrooms
bathrooms
floor
finishingStatus
images[]   // full gallery with path, url, type
createdAt
```

This avoids transferring the complete image gallery for every apartment in a list.

---

# 16. Pagination

The API currently uses offset pagination:

```text
page
limit
hasNextPage
```

The query uses:

```ts
.skip((page - 1) * limit)
.take(limit + 1)
```

One extra record is requested to determine whether another page exists.

For example:

```text
limit = 20

Database returns:
21 records

Response:
20 records

hasNextPage:
true
```

If only 20 or fewer records are returned:

```text
hasNextPage = false
```

### Why offset pagination?

Offset pagination is simple and appropriate for the current application:

- easy for the frontend to consume
- supports page-based navigation
- predictable API contract
- sufficient for the current expected data volume

### Future improvement

If the dataset becomes significantly larger, cursor/keyset pagination can be introduced.

For example:

```sql
WHERE (created_at, id) < (:createdAt, :id)
ORDER BY created_at DESC, id DESC
LIMIT 20
```

This avoids the increasing cost of very deep offsets.

---

# 17. Database Constraints vs DTO Validation

The application uses both API validation and database constraints.

They solve different problems.

### DTO validation

DTO validation protects the API boundary:

```text
IsString
IsNotEmpty
IsEnum
IsNumber
Min
MaxLength
```

It prevents invalid requests from reaching the business logic.

### Database constraints

The database protects data integrity:

```text
NOT NULL
UNIQUE
FOREIGN KEY
```

For example, apartment uniqueness is enforced by PostgreSQL rather than only checking in the service.

This ensures correctness even when multiple requests arrive concurrently.

---

# 18. Project Validation During Apartment Creation

When an apartment specifies a project:

```json
{
  "projectId": 10
}
```

the service verifies that the project exists before creating the apartment.

If it does not exist:

```text
Project lookup
      ↓
Project not found
      ↓
404 Not Found
```

The foreign key remains the database-level integrity boundary.

The service-level lookup allows the API to return a clear domain-level error instead of exposing a raw database constraint error.

---

# 19. Decimal Values

Price and area are stored as PostgreSQL `decimal` values.

For example:

```ts
@Column({
  type: 'decimal',
  precision: 14,
  scale: 2,
})
price: string;
```

and:

```ts
@Column({
  type: 'decimal',
  precision: 8,
  scale: 2,
})
area: string;
```

TypeORM/PostgreSQL commonly returns decimal values as strings.

This avoids JavaScript floating-point precision issues for decimal database values.

The request DTO accepts numeric input, while the entity stores the database representation as a string.

---

# 20. Data Normalization

The relational model is normalized around the main business entities:

```text
Project
   │
   └── Apartment
           │
           └── ApartmentImage
```

Project information is stored once in `projects`.

Apartment-specific information is stored in `apartments`.

Image-specific information is stored in `apartment_images`.

This avoids duplicating shared project information across apartments.

The current model intentionally avoids introducing additional entities that are not required by the current business scope.

---

# 21. Error Handling

Database-specific errors are converted into meaningful HTTP exceptions.

For example:

```text
PostgreSQL unique violation
        ↓
isUniqueViolation()
        ↓
ConflictException
        ↓
HTTP 409
```

This keeps database-specific implementation details out of the API contract.

Unexpected database errors are allowed to propagate to the application's global exception handling layer.

---

# 22. Known Limitations & Future Improvements

Potential future improvements include:

- Move image storage from Railway Volume to S3/R2
- Add image deletion and replacement
- Add orphaned-upload cleanup
- Add authentication and authorization
- Add automated unit and integration tests
- Add production database migrations
- Replace offset pagination with cursor pagination at larger scale
- Add structured logging and distributed tracing
- Add image resizing/optimization
- Add CDN delivery for images
- Extend search to include `unitNumber`

---

# 23. Image Upload Failure Case

There is one known edge case in the current upload flow:

```text
POST /api/uploads
      ↓
File saved successfully
      ↓
POST /api/apartments
      ↓
Apartment creation fails
      ↓
Uploaded file is no longer referenced
```

This can result in an orphaned file.

For a larger production system, this could be solved using:

- temporary upload records
- upload expiration
- scheduled cleanup jobs
- object-storage lifecycle policies
- explicit file ownership states

The current implementation keeps the workflow simple; upload lifecycle cleanup can be added later without changing the apartment domain model.

---

# 24. Frontend Architecture

The frontend is a **Next.js App Router** application that talks to the NestJS API over REST.

### Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + MUI 9 |
| Styling | Emotion (via MUI) + theme tokens |
| Forms | `react-hook-form` (create flows) |
| Icons | `@mui/icons-material` |
| API access | `fetch` wrappers in `lib/api` |

Base API URL comes from `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:3000/api` or the Railway API).

### Structure

```text
frontend/src/
├── app/                 # Routes (App Router pages)
├── components/          # Shared UI (navbar, buttons, card, tag, icons)
├── features/            # Domain UI + hooks
│   ├── apartments/
│   ├── projects/
│   ├── home/
│   └── about/
├── lib/api/             # Thin REST clients
├── types/               # Shared TypeScript types / enums
└── theme.ts             # MUI theme
```

Pages stay thin; feature modules own screens, forms, and data hooks.

### Routes

| Route | Purpose |
|---|---|
| `/` | Home (hero + highlights) |
| `/about` | About |
| `/projects` | Project list + search |
| `/projects/new` | Create project |
| `/apartments` | Apartment list + filters |
| `/apartments/new` | Create apartment (upload → create) |
| `/apartments/[id]` | Apartment details + gallery |

### API clients

```text
lib/api/
├── apartments.ts   # list, getById, create
├── projects.ts     # list, create
└── uploads.ts      # multipart file upload
```

Hooks such as `useApartments`, `useApartment`, `useCreateApartment`, and `useProjects` call these clients and hold UI state (loading, errors, pagination).

### Apartment listing & filters

Listing uses **draft vs applied** filter state:

1. User edits filters in the form (draft)
2. **Apply filters** sends the draft to the API
3. Results and “Load more” use the applied params

Filters mirror the backend query contract (`search`, `projectId`, `type`, ranges, rooms, etc.).

UI pattern:

- Always-visible: search, project, type
- Compact dropdowns: Price, Rooms & baths, Area
- “Show more”: finishing, floor
- Actions at the bottom: Clear / Apply filters

Pagination uses the same offset model as the API (`page`, `limit`, `hasNextPage`) with a **Load more** control.

### Create apartment flow

```text
Pick images locally
      ↓
POST /api/uploads (per file)
      ↓
Collect { path, type }
      ↓
POST /api/apartments
      ↓
Redirect to /apartments/:id
```

This matches the backend’s separate upload-then-create design.

### Details & presentation

- List cards show amenities with icons (price, area, beds, baths) and `imageUrl`
- Details page shows price/area, specs with icons, project block, and a hero + carousel gallery
- Shared `Card`, `Tag`, and button components keep list/project UIs consistent

### Responsiveness

Layouts use MUI breakpoints (`xs` / `sm` / `md`) for grids, stacks, and the mobile navbar drawer so listing, filters, and details work on phone and desktop.

---

# 25. Summary

| Concern | Decision |
|---|---|
| Backend | NestJS |
| Frontend | Next.js App Router + MUI |
| ORM | TypeORM |
| Database | PostgreSQL |
| Project → Apartment | Optional `ManyToOne` |
| Apartment → Images | `OneToMany` |
| Unit uniqueness | `(unit_number, project_id)` |
| Image storage | Disk + Railway / Docker volume |
| Image database value | Relative path |
| Image URLs | Generated from `APP_URL` |
| Filtering | TypeORM QueryBuilder |
| Search | Unit name + project name |
| Pagination | Offset pagination |
| Next-page detection | `limit + 1` |
| List response | Slim DTO + `imageUrl` (hero) |
| Details response | Full gallery |
| Frontend filters | Draft / apply + load more |
| Data integrity | Foreign keys + unique constraints |
| API validation | `class-validator` |
| API documentation | Swagger + Postman |
| Future image storage | S3 / R2 / object storage |