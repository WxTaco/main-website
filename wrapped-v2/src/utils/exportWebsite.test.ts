import { exportWebsite } from './exportWebsite';
import type { Component } from '../pages/WebsiteBuilderEditor';

describe('exportWebsite', () => {
  it('should generate HTML, CSS, and JS files', () => {
    // Create test components
    const components: Component[] = [
      {
        id: '1',
        type: 'navbar',
        props: {
          title: 'Test Website',
          links: [
            { text: 'Home', url: '#' },
            { text: 'About', url: '#about' },
          ],
          fixed: true,
        },
      },
      {
        id: '2',
        type: 'container',
        props: {
          backgroundColor: 'rgba(31, 41, 55, 0.7)',
          padding: '1rem',
          margin: '1rem 0',
          borderRadius: '0.5rem',
        },
        children: [
          {
            id: '3',
            type: 'text',
            props: {
              text: 'Hello World',
              variant: 'heading1',
              alignment: 'center',
              color: '#ffffff',
              fontSize: '2rem',
            },
          },
        ],
      },
      {
        id: '4',
        type: 'footer',
        props: {
          copyright: '© 2023 Test Website',
          links: [
            { text: 'Privacy', url: '#privacy' },
            { text: 'Terms', url: '#terms' },
          ],
        },
      },
    ];

    // Export the website
    const files = exportWebsite(components, 'Test Website');

    // Check that the expected files are generated
    expect(files).toHaveProperty('index.html');
    expect(files).toHaveProperty('styles.css');
    expect(files).toHaveProperty('script.js');

    // Check that the HTML contains the expected content
    expect(files['index.html']).toContain('<title>Test Website</title>');
    expect(files['index.html']).toContain('Test Website');
    expect(files['index.html']).toContain('Hello World');
    expect(files['index.html']).toContain('© 2023 Test Website');

    // Check that the CSS contains styles
    expect(files['styles.css']).toContain('.navbar');
    expect(files['styles.css']).toContain('.footer');
    expect(files['styles.css']).toContain('.container');

    // Check that the JS contains the expected content
    expect(files['script.js']).toContain('document.addEventListener');
  });
});
