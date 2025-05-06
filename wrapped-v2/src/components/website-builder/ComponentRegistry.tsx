import React from 'react';
import NavbarComponent from './NavbarComponent';
import FooterComponent from './FooterComponent';
import ContainerComponent from './ContainerComponent';
import TextComponent from './TextComponent';
import ButtonComponent from './ButtonComponent';

// Define component types
export interface ComponentType {
  type: string;
  id: string;
  props: any;
  children?: ComponentType[];
}

// Define the component registry
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  container: ContainerComponent,
  text: TextComponent,
  button: ButtonComponent,
  navbar: NavbarComponent,
  footer: FooterComponent,
};

// Define the component types for the sidebar
export const componentTypes = [
  {
    type: 'layout',
    components: [
      {
        name: 'Container',
        type: 'container',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        ),
      },
    ],
  },
  {
    type: 'content',
    components: [
      {
        name: 'Text',
        type: 'text',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        ),
      },
      {
        name: 'Button',
        type: 'button',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        ),
      },
    ],
  },
];

// Function to render a component based on its type and props
export const renderComponent = (
  component: ComponentType,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void,
  isSelected?: boolean,
  customChildren?: React.ReactNode
) => {
  const Component = componentRegistry[component.type];

  if (!Component) {
    console.error(`Component type "${component.type}" not found in registry`);
    return null;
  }

  return (
    <Component
      key={component.id}
      id={component.id}
      {...component.props}
      onEdit={onEdit}
      onDelete={onDelete}
      isSelected={isSelected}
    >
      {customChildren || (component.children?.map((child) =>
        renderComponent(child, onEdit, onDelete, child.id === component.id && isSelected)
      ))}
    </Component>
  );
};

export default componentRegistry;
