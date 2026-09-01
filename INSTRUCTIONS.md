# UNDP - Initiatives

We will create a new page that will be used to showcase the initiatives for the UN UNDP programme. For now, the project is called FAROL.

We will use:

- Sanity CMS
- NextJS
- Tailwind
- Shadcn for primitives

We will have five pages, I will create a md document for each of those pages as we go along.

- Home
- Initiatives
- Results
- Collaborate

Common components.

- Hero
- Navbar
- Footer
- LinkCard

The site should be highly customizable, and whole pages can be built from the CMS. Frontend will be basically a renderer of the CMS, and page should be rendered at build time by next.

The site will have components, some of them more generic and some very specialized, and the front end should be able to render them all server-side, unless theres a specific need to read data client-side.

I should be able to support multiple languages: first will be english only.