# Friendlu AI workspace upgrade

## Goal
Make the desktop build workspace easier to manage and preview while preserving the existing single-view mobile experience.

## Changes

### 1. Project title and actions
- Replace the static header label with a project title button showing **Nairobi Electronics Shop** and a chevron.
- Open an accessible action menu containing **Rename project**, **Tools & Integrations**, **Duplicate**, and a destructive **Delete project** action.
- Let **Rename project** switch the header into an inline text field with save and cancel controls.
- Keep the remaining actions as clear mocked frontend interactions; no persistence or backend work.

### 2. Desktop navigation and chat sizing
- Automatically collapse the main left navigation to an icon rail when build mode starts.
- Add a top-left control to expand or collapse that navigation manually.
- Keep the mobile navigation drawer unchanged.
- Add a desktop chat-width control that switches between **320px compact** and **500px expanded** widths.
- Use stable widths and transitions so neither the conversation nor preview is covered.

### 3. Desktop preview device modes
- Add Desktop, Tablet, and Mobile icon controls to the preview toolbar.
- Desktop uses all available preview space.
- Tablet centers a 768px viewport inside a tablet-style frame.
- Mobile centers a 390px viewport inside a phone frame with a notch and status bar.
- Preserve template switching and reload behavior.

### 4. Mobile preservation
- Keep the Chat/Preview segmented switch at the top.
- Keep the full-height single-panel preview and bottom Reload, Edit, Pointer, and Publish controls.
- Ensure desktop-only sidebar, chat-width, and device controls do not crowd the phone layout.

## Technical details
- Limit implementation to `src/components/chat-shell.tsx` unless a small shared style adjustment is required.
- Reuse the existing Button component and semantic theme tokens.
- Use local React state only; project actions remain mock interactions.
- Verify project rename, menus, navigation collapse, chat resizing, all three device previews, and the existing mobile build flow with desktop and 393px-wide browser checks.
