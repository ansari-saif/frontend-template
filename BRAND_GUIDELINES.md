# Brand Guidelines - Your Company Name

## Brand Identity

### Mission
Solving healthcare problems using technology with a focus on clarity, trust, and efficiency.

### Brand Values
- **Trust**: Professional, reliable, and secure
- **Clarity**: Clean, accessible, and intuitive design
- **Innovation**: Modern technology with human-centered design
- **Care**: Empathetic and supportive user experience

## Color Palette

### Primary Colors
- **Medical Blue**: `#0066CC` (Primary brand color)
- **Trust Navy**: `#1E3A8A` (Deep, trustworthy tone)
- **Clean White**: `#FFFFFF` (Purity and cleanliness)

### Secondary Colors
- **Healing Green**: `#10B981` (Success, health, growth)
- **Care Teal**: `#0891B2` (Calming, professional)
- **Soft Lavender**: `#8B5CF6` (Innovation, technology)

### Accent Colors
- **Warning Amber**: `#F59E0B` (Alerts, caution)
- **Error Red**: `#EF4444` (Errors, critical alerts)
- **Info Cyan**: `#06B6D4` (Information, notifications)

### Neutral Colors
- **Text Dark**: `#1F2937` (Primary text)
- **Text Medium**: `#6B7280` (Secondary text)
- **Text Light**: `#9CA3AF` (Tertiary text)
- **Background Light**: `#F9FAFB` (Light backgrounds)
- **Background Medium**: `#F3F4F6` (Card backgrounds)
- **Border Light**: `#E5E7EB` (Subtle borders)

## CSS Custom Properties

### Light Theme Variables
```css
:root {
  /* Primary Colors */
  --primary: 214 100% 40%;           /* Medical Blue #0066CC */
  --primary-foreground: 0 0% 100%;   /* White text on primary */
  
  /* Secondary Colors */
  --secondary: 210 40% 96%;          /* Light background */
  --secondary-foreground: 222 47% 11%; /* Dark text */
  
  /* Success/Healing */
  --success: 158 64% 52%;            /* Healing Green #10B981 */
  --success-foreground: 0 0% 100%;   /* White text */
  
  /* Warning */
  --warning: 45 93% 47%;             /* Warning Amber #F59E0B */
  --warning-foreground: 0 0% 100%;   /* White text */
  
  /* Error/Destructive */
  --destructive: 0 84% 60%;          /* Error Red #EF4444 */
  --destructive-foreground: 0 0% 100%; /* White text */
  
  /* Background & Surface */
  --background: 0 0% 100%;           /* Clean White */
  --foreground: 222 47% 11%;         /* Text Dark */
  --card: 0 0% 100%;                 /* Card background */
  --card-foreground: 222 47% 11%;    /* Card text */
  
  /* Interactive Elements */
  --muted: 214 32% 91%;              /* Muted backgrounds */
  --muted-foreground: 215 16% 47%;   /* Muted text */
  --accent: 210 40% 96%;             /* Accent background */
  --accent-foreground: 222 47% 11%;  /* Accent text */
  
  /* Borders & Inputs */
  --border: 214 32% 91%;             /* Border Light */
  --input: 214 32% 91%;              /* Input borders */
  --ring: 214 100% 40%;              /* Focus rings */
  
  /* Popover */
  --popover: 0 0% 100%;              /* Popover background */
  --popover-foreground: 222 47% 11%; /* Popover text */
  
  /* Border Radius */
  --radius: 0.5rem;
}
```

## Typography

### Font Hierarchy
- **Headings**: Inter, system-ui, sans-serif
- **Body Text**: Inter, system-ui, sans-serif  
- **Code/Monospace**: JetBrains Mono, Consolas, monospace

### Scale
- **Hero (H1)**: 3.5rem (56px) - Landing pages
- **Title (H2)**: 2.25rem (36px) - Page titles
- **Heading (H3)**: 1.875rem (30px) - Section headers
- **Subheading (H4)**: 1.5rem (24px) - Component titles
- **Body Large**: 1.125rem (18px) - Important text
- **Body**: 1rem (16px) - Default text
- **Body Small**: 0.875rem (14px) - Secondary text
- **Caption**: 0.75rem (12px) - Labels, captions

## Spacing & Layout

### Spacing Scale (Tailwind-based)
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Component Spacing
- **Button padding**: 0.75rem 1.5rem (12px 24px)
- **Card padding**: 1.5rem (24px)
- **Form spacing**: 1rem (16px) between fields
- **Section spacing**: 3rem (48px) between major sections

## Component Guidelines

### Buttons
- **Primary**: Medical blue background, white text
- **Secondary**: Light background, dark text, border
- **Destructive**: Error red background, white text
- **Ghost**: Transparent background, colored text

### Cards
- **Background**: White with subtle shadow
- **Border**: Light border or none
- **Padding**: 1.5rem standard
- **Border radius**: 0.5rem

### Forms
- **Input borders**: Light gray, focus with primary color
- **Labels**: Medium gray text, positioned above inputs
- **Error states**: Red border and text
- **Success states**: Green border and text

## Gradients

### Primary Gradients
- **Hero Background**: `linear-gradient(135deg, #0066CC 0%, #1E3A8A 100%)`
- **Card Hover**: `linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)`
- **Success**: `linear-gradient(135deg, #10B981 0%, #059669 100%)`

## Usage Examples

### Do's ✅
- Use the medical blue as the primary action color
- Maintain consistent spacing using the defined scale
- Use healing green for success states and positive actions
- Keep backgrounds light and clean
- Use high contrast for accessibility

### Don'ts ❌
- Don't mix random colors outside the palette
- Don't use harsh, bright colors that feel unprofessional
- Don't reduce contrast below WCAG AA standards
- Don't use more than 3-4 colors in a single component
- Don't ignore the spacing scale

## Accessibility

### Color Contrast
- **Primary text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear focus indicators
- **Error states**: Not relying on color alone

### Focus States
- **Focus ring**: 2px solid primary color with offset
- **Interactive elements**: Clear hover and active states
- **Keyboard navigation**: Visible focus indicators

## Implementation

All colors are implemented as CSS custom properties and available in the Tailwind configuration. Use semantic color names (primary, secondary, etc.) rather than specific color values to maintain consistency and enable theme switching. 