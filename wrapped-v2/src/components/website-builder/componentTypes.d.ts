export interface WebsiteComponentProps {
  id: string;
  type: string;
  content?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
}

export interface ContainerComponentProps extends WebsiteComponentProps {
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  width?: string;
  columns?: number;
  gap?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;
  boxShadow?: string;
  childComponents?: any[];
  onAddChild?: (containerId: string, component: any) => void;
  height?: string;
  gridColumnSpan?: number;
  gridRowSpan?: number;
}

export interface TextComponentProps extends WebsiteComponentProps {
  text?: string;
  variant?: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'custom';
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontFamily?: 'default' | 'sans' | 'serif' | 'mono' | 'saira';
  fontSize?: 'small' | 'medium' | 'large' | 'xlarge' | 'custom';
  customFontSize?: string;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  color?: string;
  lineHeight?: 'normal' | 'tight' | 'relaxed' | 'loose';
  letterSpacing?: 'normal' | 'wide' | 'wider' | 'widest';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  horizontalAlign?: 'left' | 'center' | 'right';
  margin?: string;
  padding?: string;
}

export interface ButtonComponentProps extends WebsiteComponentProps {
  text?: string;
  url?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'custom';
  size?: 'small' | 'medium' | 'large';
  action?: 'link' | 'scroll' | 'modal' | 'form' | 'download';
  target?: '_self' | '_blank' | '_parent' | '_top';
  scrollTarget?: string;
  modalContent?: string;
  formAction?: string;
  downloadUrl?: string;
  downloadFilename?: string;
  iconPosition?: 'left' | 'right' | 'none';
  icon?: string;
  borderRadius?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  hoverBorderColor?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  horizontalAlign?: 'left' | 'center' | 'right';
  margin?: string;
  padding?: string;
  width?: string;
}

export interface NavbarComponentProps extends WebsiteComponentProps {
  title?: string;
  logo?: string;
  links?: { text: string; url: string }[];
  fixed?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface FooterComponentProps extends WebsiteComponentProps {
  copyright?: string;
  links?: { text: string; url: string }[];
  socialLinks?: { platform: string; url: string }[];
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
} 