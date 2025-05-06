import type { Component } from '../pages/WebsiteBuilderEditor';

/**
 * Exports a website to static HTML/CSS/JS files
 * @param components The components from the website builder
 * @param websiteName The name of the website
 * @returns An object containing the generated files
 */
export const exportWebsite = (components: Component[], websiteName: string): Record<string, string> => {
  // Create an object to store the generated files
  const files: Record<string, string> = {};

  // Generate the main HTML file
  const htmlContent = generateHtml(components, websiteName);
  files['index.html'] = htmlContent;

  // Generate the CSS file
  const cssContent = generateCss(components);
  files['styles.css'] = cssContent;

  // Generate the JS file
  const jsContent = generateJs(components);
  files['script.js'] = jsContent;

  return files;
};

/**
 * Generates the HTML content for the website
 * @param components The components from the website builder
 * @param websiteName The name of the website
 * @returns The HTML content as a string
 */
const generateHtml = (components: Component[], websiteName: string): string => {
  // Find navbar and footer components
  const navbarComponent = components.find(comp => comp.type === 'navbar');
  const footerComponent = components.find(comp => comp.type === 'footer');

  // Filter content components (not navbar or footer)
  const contentComponents = components.filter(
    comp => comp.type !== 'navbar' && comp.type !== 'footer'
  );

  // Generate HTML for each component
  const navbarHtml = navbarComponent ? generateComponentHtml(navbarComponent) : '';
  const contentHtml = contentComponents.map(generateComponentHtml).join('\n');
  const footerHtml = footerComponent ? generateComponentHtml(footerComponent) : '';

  // Create the full HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${websiteName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="website-container">
    ${navbarHtml}
    <main class="content-container">
      ${contentHtml}
    </main>
    ${footerHtml}
  </div>
  <script src="script.js"></script>
</body>
</html>`;
};

/**
 * Generates HTML for a specific component
 * @param component The component to generate HTML for
 * @returns The HTML for the component
 */
const generateComponentHtml = (component: Component): string => {
  switch (component.type) {
    case 'navbar':
      return generateNavbarHtml(component);
    case 'footer':
      return generateFooterHtml(component);
    case 'container':
      return generateContainerHtml(component);
    case 'text':
      return generateTextHtml(component);
    case 'button':
      return generateButtonHtml(component);
    default:
      return '';
  }
};

/**
 * Generates HTML for a navbar component
 * @param component The navbar component
 * @returns The HTML for the navbar
 */
const generateNavbarHtml = (component: Component): string => {
  const { title, links, fixed } = component.props || {};

  const linksHtml = links?.map((link: { text: string; url: string }) =>
    `<a href="${link.url}" class="navbar-link">${link.text}</a>`
  ).join('') || '';

  return `<nav class="navbar ${fixed ? 'navbar-fixed' : ''}" id="${component.id}">
  <div class="navbar-container">
    <div class="navbar-title">${title || 'My Website'}</div>
    <div class="navbar-links">
      ${linksHtml}
    </div>
  </div>
</nav>`;
};

/**
 * Generates HTML for a footer component
 * @param component The footer component
 * @returns The HTML for the footer
 */
const generateFooterHtml = (component: Component): string => {
  const { copyright, links, socialLinks } = component.props || {};

  const linksHtml = links?.map((link: { text: string; url: string }) =>
    `<a href="${link.url}" class="footer-link">${link.text}</a>`
  ).join('') || '';

  const socialLinksHtml = socialLinks?.map((link: { platform: string; url: string }) =>
    `<a href="${link.url}" class="social-link ${link.platform}">${link.platform}</a>`
  ).join('') || '';

  return `<footer class="footer" id="${component.id}">
  <div class="footer-container">
    <div class="footer-links">
      ${linksHtml}
    </div>
    <div class="social-links">
      ${socialLinksHtml}
    </div>
    <div class="copyright">${copyright || `© ${new Date().getFullYear()} My Website`}</div>
  </div>
</footer>`;
};

/**
 * Generates HTML for a container component
 * @param component The container component
 * @returns The HTML for the container
 */
const generateContainerHtml = (component: Component): string => {
  const { backgroundColor, padding, borderRadius } = component.props || {};
  const childrenHtml = component.children?.map(generateComponentHtml).join('\n') || '';

  return `<div class="container" id="${component.id}" style="background-color: ${backgroundColor}; padding: ${padding}; border-radius: ${borderRadius};">
  ${childrenHtml}
</div>`;
};

/**
 * Generates HTML for a text component
 * @param component The text component
 * @returns The HTML for the text component
 */
const generateTextHtml = (component: Component): string => {
  const { text, variant, alignment, color, fontSize } = component.props || {};

  let tag = 'p';
  if (variant === 'heading1') tag = 'h1';
  else if (variant === 'heading2') tag = 'h2';
  else if (variant === 'heading3') tag = 'h3';

  return `<${tag} class="text-component ${variant}" id="${component.id}" style="text-align: ${alignment}; color: ${color}; font-size: ${fontSize};">
  ${text || 'Text content'}
</${tag}>`;
};

/**
 * Generates HTML for a button component
 * @param component The button component
 * @returns The HTML for the button component
 */
const generateButtonHtml = (component: Component): string => {
  const { text, url, variant, size } = component.props || {};

  return `<a href="${url || '#'}" class="button ${variant} ${size}" id="${component.id}">
  ${text || 'Button'}
</a>`;
};

/**
 * Generates the CSS content for the website
 * @param components The components from the website builder
 * @returns The CSS content as a string
 */
const generateCss = (components: Component[]): string => {
  return `/* Generated CSS for ${components.length} components */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  background-color: #f5f5f5;
}

.website-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Navbar styles */
.navbar {
  background-color: #333;
  color: white;
  padding: 1rem;
}

.navbar-fixed {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-links {
  display: flex;
  gap: 1rem;
}

.navbar-link {
  color: white;
  text-decoration: none;
}

.navbar-link:hover {
  text-decoration: underline;
}

/* Footer styles */
.footer {
  background-color: #333;
  color: white;
  padding: 2rem 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-link {
  color: white;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: white;
  text-decoration: none;
}

.copyright {
  margin-top: 1rem;
  font-size: 0.875rem;
}

/* Container styles */
.container {
  margin: 1rem 0;
  border-radius: 0.5rem;
}

/* Text component styles */
.text-component {
  margin: 0.5rem 0;
}

h1.text-component {
  font-size: 2rem;
}

h2.text-component {
  font-size: 1.5rem;
}

h3.text-component {
  font-size: 1.25rem;
}

/* Button styles */
.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
}

.button.primary {
  background-color: #0070f3;
  color: white;
}

.button.secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.button.small {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

.button.large {
  font-size: 1.125rem;
  padding: 0.75rem 1.5rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
  }

  .navbar-links {
    flex-direction: column;
    align-items: center;
  }
}`;
};

/**
 * Generates the JavaScript content for the website
 * @param components The components from the website builder
 * @returns The JavaScript content as a string
 */
const generateJs = (components: Component[]): string => {
  return `// Generated JavaScript for ${components.length} components
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded successfully!');
});`;
};
