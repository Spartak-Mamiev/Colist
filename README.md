# Grocio – Shared Grocery List App

A real-time collaborative grocery list app built with React and Supabase. It allows couples, roommates, and families to manage household shopping together with instant updates and secure list sharing.

## Live

[grocio-beta.vercel.app](https://grocio-beta.vercel.app)

## The Problem

Managing shared grocery lists in households is often fragmented across notes apps, messaging apps, or paper lists. Grocio provides a real-time, structured, and collaborative solution.

## Stack

- **React 19** with Vite
- **React Router v7** for client-side routing
- **CSS Modules** for scoped component styling
- **react-icons** for iconography
- **Supabase** for authentication, PostgreSQL database, real-time subscriptions, and Row Level Security
- **Vercel** for hosting and deployment

## Features

- Email/password authentication (sign up, sign in, sign out, password reset)
- Create, delete, and manage multiple grocery lists
- Add, check off, and delete items within lists
- Real-time sync — changes appear instantly for all list members
- Invite collaborators to lists by email
- Collaborator avatars displayed on list pages
- Light/dark/system theme support with persistence
- Collapsible completed items section
- Password visibility toggle
- Progressive Web App — installable with homescreen icon
- First-time visitor welcome messaging

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── global.css              # Design tokens (colors, typography, radius) with light/dark themes
├── App.css                 # Global reset & base styles
├── App.jsx                 # Router, providers (Auth, Lists, Theme), route definitions
├── main.jsx                # Entry point
├── context/
│   ├── AuthContext.jsx     # Auth state, signUp/signIn/signOut, session management
│   ├── ListsContext.jsx    # Lists CRUD, real-time subscription on list_members
│   └── ThemeContext.jsx    # Theme preference (light/dark/system), localStorage persistence
├── hooks/
│   ├── useListItems.js     # Items CRUD + real-time for a specific list
│   └── useListMembers.js   # Members CRUD + real-time, invite by email
├── lib/
│   └── supabaseClient.js   # Configured Supabase client
├── components/
│   ├── ProtectedRoute.jsx  # Auth guard — redirects to /login if unauthenticated
│   ├── login/              # Login page with first-visit detection
│   ├── signUpPage/         # Sign up page with validation
│   ├── resetPassword/      # Password reset (send email + set new password)
│   ├── mainPage/           # Dashboard with list overview
│   ├── listPage/           # Individual list view with items and collaborator avatars
│   ├── members/            # Member management page with invite modal
│   ├── settings/           # Profile editing, theme selector, notifications, logout
│   └── ui/                 # Reusable UI components
│       ├── avatar/         # User avatar circle (primary, collaborator, large variants)
│       ├── button/         # Button with variants & sizes
│       ├── header/         # App header with nav icons and optional leftSlot
│       ├── input/          # Form input with optional label and password eye toggle
│       ├── item/           # Grocery list item with checkbox and delete
│       ├── list/           # List card (links to /list/:listId)
│       ├── member/         # Member row with role labels and remove action
│       └── modal/          # Dialog overlay with form submission
```

## Routes

| Path               | Page          | Access    | Description                                |
| ------------------ | ------------- | --------- | ------------------------------------------ |
| `/`                | MainPage      | Protected | Dashboard showing all user's lists         |
| `/login`           | LoginPage     | Public    | Email + password login                     |
| `/signup`          | SignUpPage    | Public    | Registration with name, email, password    |
| `/reset-password`  | ResetPassword | Public    | Send reset email / set new password        |
| `/list/:listId`    | ListPage      | Protected | Grocery list with active & completed items |
| `/members/:listId` | Members       | Protected | Member list with invite modal              |
| `/settings`        | Settings      | Protected | Profile, appearance, notifications         |

## Database Schema (Supabase)

| Table          | Purpose                                      |
| -------------- | -------------------------------------------- |
| `profiles`     | User profiles (id, name, email)              |
| `lists`        | Grocery lists (id, name, created_at)         |
| `list_members` | List membership (user_id, list_id, role)     |
| `items`        | List items (id, list_id, name, is_completed) |

Row Level Security (RLS) is enabled on all tables with SECURITY DEFINER helper functions to prevent infinite recursion.

## Design System

### Colors

Defined in `global.css` as CSS custom properties. Theme is controlled via a `data-theme` attribute on the root element, supporting light, dark, and system (auto-detect) modes.

| Token                    | Light                | Dark                 |
| ------------------------ | -------------------- | -------------------- |
| `--color-primary`        | `rgb(76, 175, 80)`   | `rgb(76, 175, 80)`   |
| `--color-background`     | `rgb(247, 248, 247)` | `#121212`            |
| `--color-surface`        | `rgb(255, 255, 255)` | `rgb(30, 30, 30)`    |
| `--color-border`         | `rgb(230, 232, 230)` | `rgb(60, 60, 60)`    |
| `--color-text-primary`   | `rgb(29, 29, 31)`    | `rgb(255, 255, 255)` |
| `--color-text-secondary` | `rgb(110, 110, 115)` | `rgb(179, 179, 179)` |
| `--color-error`          | `rgb(229, 72, 77)`   | `rgb(229, 72, 77)`   |

### Typography

| Token                     | Value |
| ------------------------- | ----- |
| `--font-size-large-title` | 34px  |
| `--font-size-title`       | 24px  |
| `--font-size-section`     | 18px  |
| `--font-size-body`        | 16px  |
| `--font-size-caption`     | 12px  |
| `--font-weight-bold`      | 700   |
| `--font-weight-semibold`  | 600   |
| `--font-weight-regular`   | 400   |

### Border Radius

| Token             | Value |
| ----------------- | ----- |
| `--radius-small`  | 12px  |
| `--radius-medium` | 14px  |
| `--radius-large`  | 16px  |
| `--radius-modal`  | 24px  |

## UI Components

### Button

```jsx
<Button
  variant="primary"
  size="large"
  fullWidth
  onClick={handleClick}
>
  Submit
</Button>
```

| Prop        | Type     | Default     | Options                                                              |
| ----------- | -------- | ----------- | -------------------------------------------------------------------- |
| `variant`   | string   | `"primary"` | `primary`, `secondary`, `ghost`, `transparent`, `logout`, `modalBtn` |
| `size`      | string   | `"medium"`  | `small`, `medium`, `large`                                           |
| `fullWidth` | boolean  | `false`     | —                                                                    |
| `disabled`  | boolean  | `false`     | —                                                                    |
| `type`      | string   | `"button"`  | `button`, `submit`                                                   |
| `onClick`   | function | —           | —                                                                    |
| `...rest`   | —        | —           | Forwarded to `<button>` (e.g. `aria-label`)                          |

### Input

```jsx
<Input
  type="email"
  label="Email"
  labelFor="email"
  id="email"
  required
/>
```

| Prop            | Type   | Default  | Description                                                       |
| --------------- | ------ | -------- | ----------------------------------------------------------------- |
| `type`          | string | `"text"` | Any HTML input type. `password` auto-adds an eye toggle button    |
| `label`         | string | —        | Label text (only renders when provided)                           |
| `labelFor`      | string | —        | Matches the input's `id`                                          |
| `...otherProps` | —      | —        | Forwarded to `<input>` (`placeholder`, `required`, `value`, etc.) |

### Header

```jsx
<Header
  showBack
  showSettings={false}
>
  Settings
</Header>
```

| Prop           | Type    | Default | Description                                           |
| -------------- | ------- | ------- | ----------------------------------------------------- |
| `showMenu`     | boolean | `true`  | Show hamburger menu link (links to `/`)               |
| `showSettings` | boolean | `true`  | Show settings gear link                               |
| `showBack`     | boolean | `false` | Show back arrow (uses `navigate(-1)`)                 |
| `leftSlot`     | node    | —       | Custom content for the left side (replaces menu/back) |

### Modal

```jsx
<Modal
  listName="Invite Member"
  cta="Enter their email"
  variant="enabled"
  type="email"
  mainBtnName="Invite"
  onClose={() => setIsOpen(false)}
  onSubmit={handleInvite}
  error={error}
/>
```

| Prop          | Type     | Description                                                 |
| ------------- | -------- | ----------------------------------------------------------- |
| `listName`    | string   | Modal title                                                 |
| `cta`         | string   | Description text below title                                |
| `variant`     | string   | `"enabled"` (visible) or `"disabled"` (hidden) for CTA text |
| `type`        | string   | Input type                                                  |
| `mainBtnName` | node     | Primary button label (string or JSX)                        |
| `onClose`     | function | Called on overlay click, close button, or cancel            |
| `onSubmit`    | function | Called with the input value when primary button is clicked  |
| `error`       | string   | Error message displayed in the modal                        |

### Avatar

```jsx
<Avatar variant="collaborator">J</Avatar>
```

| Prop      | Type   | Default     | Options                                                 |
| --------- | ------ | ----------- | ------------------------------------------------------- |
| `variant` | string | `"primary"` | `primary` (30px), `collaborator` (40px), `large` (80px) |

### Item

```jsx
<Item
  name="Milk"
  addedBy="Added by John"
  isCompleted={false}
  onToggle={handleToggle}
  onDelete={handleDelete}
/>
```

| Prop          | Type     | Description                          |
| ------------- | -------- | ------------------------------------ |
| `name`        | string   | Item name                            |
| `addedBy`     | string   | Attribution text                     |
| `isCompleted` | boolean  | Controls checkbox state              |
| `onToggle`    | function | Called when checkbox is clicked      |
| `onDelete`    | function | Called when delete button is clicked |

### List

```jsx
<List
  list={listObject}
  onDelete={handleDelete}
/>
```

| Prop       | Type     | Description                          |
| ---------- | -------- | ------------------------------------ |
| `list`     | object   | List object with `id` and `name`     |
| `onDelete` | function | Called when delete button is clicked |

### Member

```jsx
<Member
  name="John"
  email="john@email.com"
  isOwner={true}
  isCurrentUser={false}
  onRemove={handleRemove}
/>
```

| Prop            | Type     | Description                          |
| --------------- | -------- | ------------------------------------ |
| `name`          | string   | Member's display name                |
| `email`         | string   | Member's email                       |
| `isOwner`       | boolean  | Shows "Owner" label                  |
| `isCurrentUser` | boolean  | Shows "You" label                    |
| `onRemove`      | function | Called when remove button is clicked |

## Deployment

Hosted on **Vercel** with automatic deploys from the `main` branch on GitHub.

```bash
# Manual deploy via CLI
vercel --prod
```

### Vercel Configuration

- **Application Preset:** Vite
- **Root Directory:** `colist-app`
- **Environment Variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

A `vercel.json` file handles SPA routing rewrites so all paths serve `index.html`.

### Supabase Configuration

In Supabase → Authentication → URL Configuration:

- **Site URL:** `https://grocio-beta.vercel.app`
- **Redirect URLs:** `https://grocio-beta.vercel.app`, `https://grocio-beta.vercel.app/reset-password`

## Conventions

- **CSS Modules** for all component styles (`.module.css`)
- **Design tokens** via CSS custom properties in `global.css`
- Import styles as `styles` (plural) from CSS modules
- Reusable components live in `src/components/ui/`
- Page components live in `src/components/{pageName}/`
- Context providers live in `src/context/`
- Custom hooks live in `src/hooks/`
- Use `variant` props to switch visual styles
- Icon-only buttons must include `aria-label`
- Environment variables prefixed with `VITE_` for Vite compatibility
