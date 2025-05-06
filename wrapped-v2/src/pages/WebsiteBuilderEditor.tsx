import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { componentTypes, renderComponent } from '../components/website-builder/ComponentRegistry';
import type { ComponentType } from '../components/website-builder/ComponentRegistry';
import { AlertDialog, ConfirmDialog } from '../components/CustomDialog';
import PropertyEditor from '../components/website-builder/PropertyEditor';
import GridContainer from '../components/website-builder/GridContainer';
import DraggableGridItem from '../components/website-builder/DraggableGridItem';
import DeploymentDialog from '../components/website-builder/DeploymentDialog';
import DeploymentHistoryDialog from '../components/website-builder/DeploymentHistoryDialog';

// Declare global window interface
declare global {
  interface Window {
    updateComponentProps?: (id: string, props: any) => void;
  }
}

// Define the component item for drag and drop
interface ComponentItem {
  type: string;
  name: string;
}

// Define the component data structure
export interface Component {
  id: string;
  type: string;
  props: any;
  children?: Component[];
}

// Helper function to find a component by ID in a nested structure
const findComponentById = (components: Component[], id: string): Component | null => {
  // First check in the main components array
  const component = components.find(comp => comp.id === id);
  if (component) return component;

  // If not found, recursively check in children
  for (const comp of components) {
    if (comp.children && comp.children.length > 0) {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }

  return null;
};

// Get default props based on component type
const getDefaultProps = (type: string) => {
  switch (type) {
    case 'container':
      return {
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        padding: '1rem',
        margin: '0',
        width: '100%',
        height: 'auto',
        columns: 1,
        gap: '1rem',
        borderRadius: '0.5rem',
        borderWidth: '0',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderStyle: 'solid',
        boxShadow: 'none',
        gridColumnSpan: 12, // Default to full width
        gridRowSpan: 1,
      };
    case 'text':
      return {
        text: 'This is a text component. Click to edit.',
        variant: 'paragraph',
        alignment: 'left',
        fontFamily: 'default',
        fontSize: 'medium',
        customFontSize: '',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        color: 'inherit',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        verticalAlign: 'top',
        horizontalAlign: 'left',
        margin: '0',
        padding: '0',
      };
    case 'button':
      return {
        text: 'Click Me',
        url: '#',
        variant: 'primary',
        size: 'medium',
        action: 'link',
        target: '_self',
        scrollTarget: '',
        modalContent: '',
        formAction: '',
        downloadUrl: '',
        downloadFilename: '',
        iconPosition: 'none',
        icon: '',
        borderRadius: '',
        backgroundColor: '',
        textColor: '',
        borderColor: '',
        verticalAlign: 'top',
        horizontalAlign: 'left',
        margin: '0',
        padding: '',
        width: 'auto',
      };
    default:
      return {};
  }
};

// Draggable component for the sidebar
const DraggableComponent = ({ type, name, icon }: { type: string; name: string; icon: React.ReactNode }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type, name } as ComponentItem,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded-md cursor-move transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="mr-2 text-theme-primary">{icon}</div>
      <span className="text-white">{name}</span>
    </div>
  );
};

// Droppable component for containers
interface DroppableContainerProps {
  id: string;
  children: React.ReactNode;
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  selectedComponent: string | null;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string | null>>;
}

const DroppableContainer = ({
  id,
  children,
  components,
  setComponents,
  selectedComponent,
  setSelectedComponent,
}: DroppableContainerProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: ComponentItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }

      // Add the new component to this container
      const newComponent: Component = {
        id: uuidv4(),
        type: item.type,
        props: getDefaultProps(item.type),
      };

      // Update the components tree by adding the new component to the container
      setComponents((prev) => {
        return prev.map((component) => {
          if (component.id === id) {
            return {
              ...component,
              children: [...(component.children || []), newComponent],
            };
          }
          return component;
        });
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[100px] w-full ${isOver ? 'border-2 border-dashed border-theme-primary bg-theme-primary/10' : ''}`}
    >
      {children}
    </div>
  );
};

// Droppable area for the preview
interface DroppablePreviewProps {
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  selectedComponent: string | null;
  setSelectedComponent: React.Dispatch<React.SetStateAction<string | null>>;
  onAddChildToContainer: (containerId: string, component: Component) => void;
}

const DroppablePreview = ({
  components,
  setComponents,
  selectedComponent,
  setSelectedComponent,
  onAddChildToContainer,
}: DroppablePreviewProps) => {
  // Set up drop functionality for the main content area
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    drop: (item: ComponentItem, monitor) => {
      // Prevent drop if already handled by a child
      if (monitor.didDrop()) {
        return;
      }

      // Add the new component to the main content area
      const newComponent: Component = {
        id: uuidv4(),
        type: item.type,
        props: getDefaultProps(item.type),
      };

      // Add the new component to the components array
      setComponents(prev => [...prev, newComponent]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop(),
    }),
  });

  // Helper function to recursively find a component by ID
  const findComponentById = (components: Component[], id: string): Component | null => {
    for (const component of components) {
      if (component.id === id) {
        return component;
      }

      if (component.children && component.children.length > 0) {
        const found = findComponentById(component.children, id);
        if (found) {
          return found;
        }
      }
    }

    return null;
  };

  // Helper function to recursively delete a component by ID
  const deleteComponentById = (components: Component[], id: string): Component[] => {
    // First check if the component is at this level
    const filteredComponents = components.filter(comp => comp.id !== id);

    // If we removed something, return the filtered array
    if (filteredComponents.length < components.length) {
      return filteredComponents;
    }

    // Otherwise, check children
    return filteredComponents.map(comp => {
      if (comp.children && comp.children.length > 0) {
        return {
          ...comp,
          children: deleteComponentById(comp.children, id)
        };
      }
      return comp;
    });
  };

  // Handle component selection
  const handleSelectComponent = (id: string) => {
    setSelectedComponent(id);
  };

  // Handle component deletion
  const handleDeleteComponent = (id: string) => {
    // Check if the component is a navbar or footer (which shouldn't be deleted)
    const component = findComponentById(components, id);
    if (component && (component.type === 'navbar' || component.type === 'footer')) {
      alert('The navbar and footer cannot be removed from the website.');
      return;
    }

    // Update the components state
    setComponents(prev => deleteComponentById(prev, id));

    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  // Render a component and its children recursively
  const renderComponentWithChildren = (component: Component) => {
    // Special handling for container components with children
    if (component.type === 'container') {
      // Ensure container props include gridColumnSpan and gridRowSpan
      const containerProps = {
        ...component.props,
        childComponents: component.children || [],
        onAddChild: onAddChildToContainer,
        // Ensure these properties exist with default values if not set
        gridColumnSpan: component.props?.gridColumnSpan || 12,
        gridRowSpan: component.props?.gridRowSpan || 1,
        width: '100%',
      };

      console.log('Container props:', containerProps);

      return renderComponent(
        {
          ...component,
          props: containerProps
        },
        handleSelectComponent,
        handleDeleteComponent,
        selectedComponent === component.id
      );
    }

    // For other components
    return renderComponent(
      component,
      handleSelectComponent,
      handleDeleteComponent,
      selectedComponent === component.id
    );
  };

  // Separate navbar, content, and footer components
  const navbarComponent = components.find(comp => comp.type === 'navbar');
  const footerComponent = components.find(comp => comp.type === 'footer');
  const contentComponents = components.filter(
    comp => comp.type !== 'navbar' && comp.type !== 'footer'
  );

  return (
    <div className="flex-1 bg-gray-900/70 rounded-lg overflow-auto p-4 min-h-[600px] border border-gray-700">
      <div className="space-y-4">
        {/* Render Navbar */}
        {navbarComponent && (
          <div className="sticky top-0 z-50">
            {renderComponent(
              navbarComponent,
              handleSelectComponent,
              handleDeleteComponent,
              selectedComponent === navbarComponent.id
            )}
          </div>
        )}

        {/* Content Area */}
        <div
          ref={drop}
          className={`min-h-[300px] ${isOver && canDrop ? 'border-2 border-dashed border-theme-primary bg-theme-primary/10' : ''}`}
        >
          {contentComponents.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p className="mb-2">Drag and drop components here</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 w-full">
              {contentComponents.map(component => {
                // Determine the grid column span for containers
                const colSpanClass = component.type === 'container' && component.props && component.props.gridColumnSpan
                  ? `col-span-${Math.max(1, Math.min(component.props.gridColumnSpan, 12))}`
                  : "col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3";

                // Determine the grid row span for containers
                const rowSpanClass = component.type === 'container' && component.props && component.props.gridRowSpan
                  ? `row-span-${Math.max(1, Math.min(component.props.gridRowSpan, 6))}`
                  : "";

                // For containers, ensure they take up the full width of their grid cells
                const widthClass = component.type === 'container' ? 'w-full' : '';

                return (
                  <div
                    key={component.id}
                    className={`${colSpanClass} ${rowSpanClass} ${widthClass}`}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: component.type === 'container' ? '0' : undefined
                    }}
                  >
                    {renderComponentWithChildren(component)}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Render Footer */}
        {footerComponent && (
          <div className="mt-auto">
            {renderComponent(
              footerComponent,
              handleSelectComponent,
              handleDeleteComponent,
              selectedComponent === footerComponent.id
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main editor component
const WebsiteBuilderEditor = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedComponentData, setSelectedComponentData] = useState<Component | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [websiteName, setWebsiteName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [showDeploymentHistoryDialog, setShowDeploymentHistoryDialog] = useState(false);

  // Initialize with default navbar and footer
  useEffect(() => {
    if (components.length === 0) {
      const defaultNavbar: Component = {
        id: uuidv4(),
        type: 'navbar',
        props: {
          title: 'My Website',
          links: [
            { text: 'Home', url: '#' },
            { text: 'About', url: '#about' },
            { text: 'Services', url: '#services' },
            { text: 'Contact', url: '#contact' },
          ],
          fixed: true,
          backgroundColor: 'rgb(17, 24, 39)', // bg-gray-900
          textColor: 'rgb(229, 231, 235)', // text-gray-200
          accentColor: 'var(--theme-primary)', // theme-primary
        },
      };

      const defaultFooter: Component = {
        id: uuidv4(),
        type: 'footer',
        props: {
          copyright: `© ${new Date().getFullYear()} My Website. All rights reserved.`,
          links: [
            { text: 'Privacy Policy', url: '#' },
            { text: 'Terms of Service', url: '#' },
            { text: 'Contact', url: '#contact' },
          ],
          socialLinks: [
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' },
          ],
          backgroundColor: 'rgb(17, 24, 39)', // bg-gray-900
          textColor: 'rgb(229, 231, 235)', // text-gray-200
          accentColor: 'var(--theme-primary)', // theme-primary
        },
      };

      setComponents([defaultNavbar, defaultFooter]);
    }
  }, []);

  // Update selectedComponentData when selectedComponent changes
  useEffect(() => {
    if (selectedComponent) {
      const component = findComponentById(components, selectedComponent);
      if (component) {
        setSelectedComponentData(component);
      }
    } else {
      setSelectedComponentData(null);
    }
  }, [selectedComponent, components]);

  // Handle updating component properties
  const handleUpdateComponent = useCallback((id: string, props: any) => {
    // Helper function to update a component in a nested structure
    const updateComponentProps = (components: Component[], id: string, props: any): Component[] => {
      return components.map(component => {
        if (component.id === id) {
          return { ...component, props };
        }

        // If this component has children, recursively update them
        if (component.children && component.children.length > 0) {
          return {
            ...component,
            children: updateComponentProps(component.children, id, props)
          };
        }

        return component;
      });
    };

    setComponents(prevComponents => updateComponentProps(prevComponents, id, props));
  }, []);

  // Add updateComponentProps to window for container resizing
  useEffect(() => {
    // Add the updateComponentProps function to the window object
    window.updateComponentProps = (id: string, props: any) => {
      console.log('Window updateComponentProps called:', id, props);
      handleUpdateComponent(id, props);
    };

    // Log to confirm the function is attached
    console.log('Added updateComponentProps to window');

    // Clean up when component unmounts
    return () => {
      delete window.updateComponentProps;
      console.log('Removed updateComponentProps from window');
    };
  }, [handleUpdateComponent]);

  // Handle saving the website
  const handleSave = useCallback(() => {
    if (!websiteName.trim()) {
      return;
    }

    // Save the website to localStorage
    const savedWebsites = JSON.parse(localStorage.getItem('savedWebsites') || '{}');
    savedWebsites[websiteName] = {
      components,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('savedWebsites', JSON.stringify(savedWebsites));

    // Close the dialog and show success message
    setShowSaveDialog(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, [websiteName, components]);

  // Handle adding a child component to a container
  const handleAddChildToContainer = useCallback((containerId: string, childComponent: Component) => {
    // Helper function to add a child to a container in a nested structure
    const addChildToContainer = (components: Component[], containerId: string, childComponent: Component): Component[] => {
      return components.map(component => {
        if (component.id === containerId) {
          return {
            ...component,
            children: [...(component.children || []), childComponent]
          };
        }

        // If this component has children, recursively check them
        if (component.children && component.children.length > 0) {
          return {
            ...component,
            children: addChildToContainer(component.children, containerId, childComponent)
          };
        }

        return component;
      });
    };

    setComponents(prevComponents => addChildToContainer(prevComponents, containerId, childComponent));
  }, []);

  // Handle clearing the editor
  const handleClear = useCallback(() => {
    // Create default navbar and footer
    const defaultNavbar: Component = {
      id: uuidv4(),
      type: 'navbar',
      props: {
        title: 'My Website',
        links: [
          { text: 'Home', url: '#' },
          { text: 'About', url: '#about' },
          { text: 'Services', url: '#services' },
          { text: 'Contact', url: '#contact' },
        ],
        fixed: true,
        backgroundColor: 'rgb(17, 24, 39)', // bg-gray-900
        textColor: 'rgb(229, 231, 235)', // text-gray-200
        accentColor: 'var(--theme-primary)', // theme-primary
      },
    };

    const defaultFooter: Component = {
      id: uuidv4(),
      type: 'footer',
      props: {
        copyright: `© ${new Date().getFullYear()} My Website. All rights reserved.`,
        links: [
          { text: 'Privacy Policy', url: '#' },
          { text: 'Terms of Service', url: '#' },
          { text: 'Contact', url: '#contact' },
        ],
        socialLinks: [
          { platform: 'twitter', url: 'https://twitter.com' },
          { platform: 'facebook', url: 'https://facebook.com' },
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' },
        ],
        backgroundColor: 'rgb(17, 24, 39)', // bg-gray-900
        textColor: 'rgb(229, 231, 235)', // text-gray-200
        accentColor: 'var(--theme-primary)', // theme-primary
      },
    };

    // Reset to only navbar and footer
    setComponents([defaultNavbar, defaultFooter]);
    setSelectedComponent(null);
    setSelectedComponentData(null);
    setShowClearDialog(false);
  }, []);

  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-6 px-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-saira font-bold text-theme-primary">Website Builder</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="bg-theme-primary hover:bg-theme-primary/80 text-white px-4 py-2 rounded-md transition-colors"
            >
              Save Website
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDeployDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Deploy to Cloudflare
              </button>
              <button
                onClick={() => setShowDeploymentHistoryDialog(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Deployment History
              </button>
            </div>
            <button
              onClick={() => setShowClearDialog(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Clear
            </button>
            <Link
              to="/website-builder"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Exit
            </Link>
            </div>
          </div>

        {/* Help tooltip */}
        <div className="bg-gray-800 text-white p-4 rounded-md mb-4 border border-theme-primary/30">
          <div className="flex items-start">
            <div className="text-theme-primary mr-3 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-theme-primary mb-1">How to Edit Navbar and Footer</h3>
              <p className="text-sm text-gray-300">
                Hover over the navbar or footer and click the "Click to Edit" button that appears.
                This will select the component and allow you to edit its properties in the right sidebar.
              </p>
            </div>
          </div>
          </div>

        {/* Tabs */}
        <div className="flex justify-between items-center mb-4">
            <div className="flex">
              <button
                className={`px-4 py-2 rounded-t-md ${
                  activeTab === 'editor'
                    ? 'bg-gray-900 text-theme-primary font-medium'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                Editor
              </button>
              <button
                className={`px-4 py-2 rounded-t-md ${
                  activeTab === 'preview'
                    ? 'bg-gray-900 text-theme-primary font-medium'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </button>
            </div>

            {/* Device selector for preview mode */}
            {activeTab === 'preview' && (
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded-md ${previewDevice === 'desktop' ? 'bg-theme-primary text-white' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setPreviewDevice('desktop')}
                  title="Desktop"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded-md ${previewDevice === 'tablet' ? 'bg-theme-primary text-white' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setPreviewDevice('tablet')}
                  title="Tablet"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded-md ${previewDevice === 'mobile' ? 'bg-theme-primary text-white' : 'bg-gray-800 text-gray-300'}`}
                  onClick={() => setPreviewDevice('mobile')}
                  title="Mobile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Main content */}
          {activeTab === 'editor' && (
            <div className="flex h-[calc(100vh-200px)]">
              {/* Left sidebar - Components */}
              <div className="w-64 bg-gray-900/70 rounded-lg p-4 mr-4 overflow-y-auto">
                <h2 className="text-lg font-bold text-theme-primary mb-3">Components</h2>
                <div className="space-y-4">
                  {componentTypes.map((category) => (
                    <div key={category.type}>
                      <h3 className="text-white font-medium mb-2 capitalize">{category.type}</h3>
                      <div className="space-y-2">
                        {category.components.map((component) => (
                          <DraggableComponent
                            key={component.type}
                            type={component.type}
                            name={component.name}
                            icon={component.icon}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main editor area */}
              <DroppablePreview
                components={components}
                setComponents={setComponents}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                onAddChildToContainer={handleAddChildToContainer}
              />

              {/* Right sidebar - Properties */}
              <div className="w-72 bg-gray-900/70 rounded-lg p-4 ml-4 overflow-y-auto">
                <h2 className="text-lg font-bold text-theme-primary mb-3">Properties</h2>
                <PropertyEditor
                  selectedComponent={selectedComponentData}
                  onUpdateComponent={handleUpdateComponent}
                />
              </div>
            </div>
          )}

          {/* Preview mode */}
          {activeTab === 'preview' && (
            <div className="flex flex-col items-center justify-start h-[calc(100vh-200px)]">
              <div
                className={`bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-300 ${
                  previewDevice === 'desktop' ? 'w-full max-w-6xl' :
                  previewDevice === 'tablet' ? 'w-[768px] max-h-[1024px]' :
                  'w-[375px] max-h-[812px]'
                }`}
              >
                <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm">
                    {websiteName || 'My Website'} - {
                      previewDevice === 'desktop' ? 'Desktop View' :
                      previewDevice === 'tablet' ? 'Tablet View' : 'Mobile View'
                    }
                  </div>
                  <div></div>
                </div>
                <div
                  className="bg-gray-100 overflow-y-auto"
                  style={{
                    height: previewDevice === 'desktop' ? 'calc(100vh - 260px)' :
                           previewDevice === 'tablet' ? '1024px' : '812px'
                  }}
                >
                  <div className="min-h-full bg-gray-900 text-white">
                    {components.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                        <p className="mb-2">No components added yet</p>
                        <p className="text-sm">Switch to the Editor tab to start building your website</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Render Navbar */}
                        {components.find(comp => comp.type === 'navbar') && (
                          renderComponent({
                            ...components.find(comp => comp.type === 'navbar')!,
                            props: components.find(comp => comp.type === 'navbar')!.props || {}
                          } as ComponentType)
                        )}

                        {/* Render Content Components */}
                        <div className="grid grid-cols-12 gap-4 px-4">
                          {components
                            .filter(comp => comp.type !== 'navbar' && comp.type !== 'footer')
                            .map((component) => (
                              <div key={component.id} className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
                                {renderComponent({
                                  ...component,
                                  props: component.props || {}
                                } as ComponentType)}
                              </div>
                            ))}
                        </div>

                        {/* Render Footer */}
                        {components.find(comp => comp.type === 'footer') && (
                          renderComponent({
                            ...components.find(comp => comp.type === 'footer')!,
                            props: components.find(comp => comp.type === 'footer')!.props || {}
                          } as ComponentType)
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold text-theme-primary mb-4">Save Website</h2>
              <input
                type="text"
                placeholder="Enter website name"
                className="w-full bg-gray-800 text-white p-2 rounded-md mb-4"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-theme-primary hover:bg-theme-primary/80 text-white px-4 py-2 rounded-md"
                  disabled={!websiteName.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear Confirmation Dialog */}
        {showClearDialog && (
          <ConfirmDialog
            isOpen={showClearDialog}
            onClose={() => setShowClearDialog(false)}
            onConfirm={handleClear}
            title="Clear Editor"
            message="Are you sure you want to clear the editor? All unsaved changes will be lost."
            confirmText="Clear"
            cancelText="Cancel"
            isDangerous={true}
          />
        )}

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg">
            Website saved successfully!
          </div>
        )}

        {/* Deployment Dialog */}
        <DeploymentDialog
          isOpen={showDeployDialog}
          onClose={() => setShowDeployDialog(false)}
          components={components}
          websiteName={websiteName || 'my-website'}
        />

        {/* Deployment History Dialog */}
        <DeploymentHistoryDialog
          isOpen={showDeploymentHistoryDialog}
          onClose={() => setShowDeploymentHistoryDialog(false)}
        />
      </div>
  );
};

export default WebsiteBuilderEditor;
