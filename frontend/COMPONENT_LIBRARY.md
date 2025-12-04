# 📦 EPICS Component Library Specification
**Production-Ready React + Tailwind Components**

Version: 2.0  
Last Updated: December 4, 2025

---

## Table of Contents
1. [Layout Components](#layout-components)
2. [Navigation Components](#navigation-components)
3. [Data Display Components](#data-display-components)
4. [Interactive Components](#interactive-components)
5. [Form Components](#form-components)
6. [Feedback Components](#feedback-components)
7. [Utility Components](#utility-components)

---

## Layout Components

### Container
**Purpose:** Centered content wrapper with responsive padding

**Props:**
```typescript
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}
```

**States:** N/A

**Accessibility:**
- Semantic `<div>` element
- No ARIA needed

**Usage:**
```jsx
<Container size="lg">
  <Dashboard />
</Container>
```

**Tailwind Classes:**
```jsx
className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
```

---

### Card
**Purpose:** Content container with elevation and borders

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
  role?: string;
  'aria-label'?: string;
}
```

**States:**
- `default` - Resting state with shadow
- `hover` - Elevated with increased shadow (if hoverable)
- `focus` - Focus ring visible
- `disabled` - Reduced opacity

**Accessibility:**
- `role="article"` for content cards
- `role="button"` with `tabIndex={0}` if clickable
- `aria-label` for cards without visible text

**Usage:**
```jsx
<Card variant="elevated" hoverable onClick={handleClick}>
  <h3 className="text-h4">Card Title</h3>
  <p className="text-body-sm text-neutral-600">Content</p>
</Card>
```

**Tailwind Classes:**
```jsx
// Default variant
className="bg-white rounded-lg p-6 shadow-md border border-neutral-200 
           transition-all duration-150 hover:shadow-lg hover:-translate-y-1"

// Glass variant
className="glass rounded-lg p-6 backdrop-blur-md"
```

---

## Navigation Components

### Header
**Purpose:** Top navigation bar with logo, actions, and mobile menu

**Props:**
```typescript
interface HeaderProps {
  logoSrc?: string;
  locationName?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLocationClick?: () => void;
  userAvatar?: string;
  userName?: string;
  className?: string;
}
```

**States:**
- `default` - Fixed position, translucent background
- `scrolled` - Opaque background with shadow
- `mobile-menu-open` - Side drawer visible

**Accessibility:**
- `<header>` element with `role="banner"`
- `<nav>` with `aria-label="Main navigation"`
- Hamburger button with `aria-expanded` state
- `aria-label` on icon buttons

**Usage:**
```jsx
<Header 
  locationName="Bangalore, Karnataka"
  notificationCount={3}
  onNotificationClick={handleNotifications}
  userName="Ramesh Kumar"
/>
```

**Responsive Behavior:**
- Mobile: Hamburger menu, compact location display
- Tablet/Desktop: Full horizontal navigation

**Component File:** See `Header.jsx` below

---

### Navigation (Mobile Drawer)
**Purpose:** Bottom navigation or side drawer for mobile

**Props:**
```typescript
interface NavigationProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
  variant?: 'bottom' | 'drawer';
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  badge?: number;
}
```

**States:**
- `active` - Current page indicator
- `hover` - Hover highlight
- `disabled` - Grayed out, not clickable

**Accessibility:**
- `<nav>` with `aria-label`
- Active item with `aria-current="page"`
- Drawer with `role="dialog"` and focus trap
- Close button with `aria-label="Close menu"`

**Usage:**
```jsx
<Navigation 
  items={navItems}
  activeItem="dashboard"
  onItemClick={handleNavigation}
  variant="bottom"
/>
```

---

### Breadcrumbs
**Purpose:** Show navigation hierarchy

**Props:**
```typescript
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType;
}
```

**Accessibility:**
- `<nav aria-label="Breadcrumb">`
- `<ol>` list with `aria-current="page"` on last item

**Usage:**
```jsx
<Breadcrumbs 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Crops', href: '/crops' },
    { label: 'Rice' }
  ]}
/>
```

---

## Data Display Components

### RecommendationCard
**Purpose:** Display crop recommendation with match score, ROI, and details

**Props:**
```typescript
interface RecommendationCardProps {
  crop: string;
  matchScore: number;
  estimatedYield: string;
  cultivationCost: number;
  netProfit: number;
  imageUrl: string;
  season?: string;
  duration?: string;
  selected?: boolean;
  onSelect?: () => void;
  onViewDetails?: () => void;
  className?: string;
}
```

**States:**
- `default` - Card at rest
- `hover` - Elevated, CTA visible
- `selected` - Border highlight, background tint
- `loading` - Skeleton placeholder

**Accessibility:**
- `role="button"` if selectable
- `aria-pressed={selected}` for selection state
- `alt` text on crop image
- `aria-label` with full crop info

**Usage:**
```jsx
<RecommendationCard 
  crop="Rice"
  matchScore={95}
  estimatedYield="3500 kg/acre"
  cultivationCost={30000}
  netProfit={45000}
  imageUrl="/crops/rice.jpg"
  selected={selectedCrop === 'Rice'}
  onSelect={() => setSelectedCrop('Rice')}
/>
```

**Tailwind Implementation:**
```jsx
<div 
  role="button"
  aria-pressed={selected}
  onClick={onSelect}
  className={`
    bg-white rounded-lg shadow-sm p-4 flex gap-3
    transition-all duration-150
    hover:shadow-md hover:-translate-y-1
    focus:outline-none focus:ring-2 focus:ring-primary-600
    ${selected ? 'border-2 border-primary-600 bg-primary-50' : 'border border-neutral-200'}
    cursor-pointer
  `}
>
  <img 
    src={imageUrl} 
    alt={`${crop} crop`} 
    className="w-20 h-20 object-cover rounded-md"
  />
  <div className="flex-1">
    <div className="flex items-center justify-between">
      <h3 className="text-h4 text-neutral-800">{crop}</h3>
      <span className="text-sm font-semibold text-primary-700">{matchScore}%</span>
    </div>
    <p className="text-body-sm text-neutral-500 mt-1">
      {estimatedYield} • ₹{cultivationCost.toLocaleString('en-IN')}
    </p>
    <div className="mt-2 flex items-center gap-2">
      <span className="text-sm font-semibold text-warning-600">
        Profit: ₹{netProfit.toLocaleString('en-IN')}
      </span>
    </div>
  </div>
</div>
```

**Component File:** See `RecommendationCard.jsx` below

---

### MarketPriceTile
**Purpose:** Display current market price with trend

**Props:**
```typescript
interface MarketPriceTileProps {
  commodity: string;
  market: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceChange: number;
  date: string;
  unit?: string;
  onClick?: () => void;
}
```

**States:**
- `default`
- `hover` - Slight elevation
- `loading` - Skeleton with pulse

**Accessibility:**
- Semantic HTML
- `aria-label` for screen readers with full price info
- Price trend icon with `aria-hidden="true"`

**Usage:**
```jsx
<MarketPriceTile 
  commodity="Rice"
  market="Bangalore"
  modalPrice={3200}
  minPrice={3000}
  maxPrice={3400}
  priceChange={4.2}
  date="2025-12-04"
  unit="quintal"
/>
```

---

### StatCard
**Purpose:** Display key metrics (weather, soil, alerts)

**Props:**
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage:**
```jsx
<StatCard 
  title="Temperature"
  value={28}
  unit="°C"
  icon={Thermometer}
  trend={{ value: 2, direction: 'up' }}
  color="warning"
/>
```

---

### LocationCard
**Purpose:** Display current location with weather snapshot

**Props:**
```typescript
interface LocationCardProps {
  area: string;
  district: string;
  state: string;
  temperature?: number;
  weatherIcon?: React.ComponentType;
  weatherCondition?: string;
  onChangeLocation?: () => void;
  compact?: boolean;
}
```

**Accessibility:**
- `aria-label="Current location"`
- Change button with descriptive label

**Usage:**
```jsx
<LocationCard 
  area="Bangalore"
  district="Bangalore Urban"
  state="Karnataka"
  temperature={28}
  weatherIcon={Cloud}
  weatherCondition="Partly cloudy"
  onChangeLocation={handleLocationChange}
/>
```

---

### ChartCard
**Purpose:** Wrapper for data visualizations

**Props:**
```typescript
interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
}
```

**Usage:**
```jsx
<ChartCard title="Price Trends" description="Last 30 days">
  <LineChart data={priceData} />
</ChartCard>
```

---

## Interactive Components

### ChatbotWidget
**Purpose:** Floating chat button and expandable chat interface

**Props:**
```typescript
interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onSendMessage: (message: string) => void;
  onVoiceInput?: () => void;
  messages: ChatMessage[];
  loading?: boolean;
  language?: string;
  supportedLanguages?: Language[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  audio?: string;
}
```

**States:**
- `collapsed` - Floating button only
- `expanded` - Full chat interface
- `loading` - Bot typing indicator
- `voice-active` - Recording voice input

**Accessibility:**
- `role="dialog"` for chat window
- `aria-label="Chat assistant"`
- `aria-live="polite"` for new messages
- Keyboard shortcuts (Esc to close)
- Focus management

**Usage:**
```jsx
<ChatbotWidget 
  isOpen={chatOpen}
  onToggle={() => setChatOpen(!chatOpen)}
  onSendMessage={handleSendMessage}
  onVoiceInput={handleVoiceInput}
  messages={chatMessages}
  language="en"
/>
```

**Component File:** See `ChatbotWidget.jsx` below

---

### Button
**Purpose:** Interactive button with multiple variants

**Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**States:**
- `default`
- `hover` - Darker background, elevated
- `focus` - Focus ring
- `active` - Pressed state
- `disabled` - Grayed out
- `loading` - Spinner, disabled

**Accessibility:**
- Native `<button>` element
- `aria-disabled` when loading
- `aria-busy` when loading

**Usage:**
```jsx
<Button 
  variant="primary" 
  size="lg" 
  leftIcon={<Sprout />}
  onClick={handleGetRecommendations}
>
  Get Recommendations
</Button>
```

---

### Toggle / Switch
**Purpose:** Binary on/off control

**Props:**
```typescript
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**Accessibility:**
- `<input type="checkbox">` with `role="switch"`
- `aria-checked` state
- `aria-labelledby` for associated label

**Usage:**
```jsx
<Toggle 
  checked={notificationsEnabled}
  onChange={setNotificationsEnabled}
  label="Enable notifications"
/>
```

---

### Modal
**Purpose:** Overlay dialog for focused tasks

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}
```

**States:**
- `opening` - Fade in + scale animation
- `open` - Fully visible
- `closing` - Fade out

**Accessibility:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` pointing to title
- Focus trap within modal
- Restore focus on close
- Esc key to close

**Usage:**
```jsx
<Modal 
  isOpen={showDetails}
  onClose={() => setShowDetails(false)}
  title="Crop Details"
  size="lg"
>
  <CropDetails crop={selectedCrop} />
</Modal>
```

---

### Tabs
**Purpose:** Switch between related views

**Props:**
```typescript
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'line' | 'pills' | 'cards';
}

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType;
  badge?: number;
}
```

**Accessibility:**
- `role="tablist"`
- `role="tab"` with `aria-selected`
- `role="tabpanel"`
- Arrow key navigation

**Usage:**
```jsx
<Tabs 
  tabs={[
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ]}
  activeTab={period}
  onChange={setPeriod}
/>
```

---

## Form Components

### Input
**Purpose:** Text input field

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**States:**
- `default`
- `focus` - Border highlight
- `error` - Red border + error message
- `disabled` - Grayed out
- `readonly`

**Accessibility:**
- `<label>` associated with input
- `aria-invalid` when error
- `aria-describedby` for error/help text
- `aria-required` if required

**Usage:**
```jsx
<Input 
  label="Location"
  value={location}
  onChange={setLocation}
  placeholder="Enter your location"
  leftIcon={<MapPin />}
  error={locationError}
  required
/>
```

---

### Select
**Purpose:** Dropdown selection

**Props:**
```typescript
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

**Accessibility:**
- Native `<select>` for simple dropdowns
- Custom dropdown with proper ARIA for complex UI
- `role="combobox"` for searchable
- `role="listbox"` for options list

**Usage:**
```jsx
<Select 
  label="Select State"
  value={state}
  onChange={setState}
  options={stateOptions}
  searchable
/>
```

---

### DatePicker
**Purpose:** Date selection input

**Props:**
```typescript
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  format?: string;
}
```

**Usage:**
```jsx
<DatePicker 
  label="Select harvest date"
  value={harvestDate}
  onChange={setHarvestDate}
  minDate={new Date()}
/>
```

---

### Checkbox
**Purpose:** Binary selection

**Props:**
```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
}
```

**Usage:**
```jsx
<Checkbox 
  checked={agreedToTerms}
  onChange={setAgreedToTerms}
  label="I agree to the terms and conditions"
  required
/>
```

---

### Radio Group
**Purpose:** Single selection from multiple options

**Props:**
```typescript
interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  label?: string;
  disabled?: boolean;
  layout?: 'vertical' | 'horizontal';
}

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

**Usage:**
```jsx
<RadioGroup 
  name="soil-type"
  value={soilType}
  onChange={setSoilType}
  label="Select soil type"
  options={soilOptions}
/>
```

---

## Feedback Components

### Toast / Notification
**Purpose:** Temporary feedback message

**Props:**
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**States:**
- `entering` - Slide in from top/bottom
- `visible` - Full opacity
- `exiting` - Slide out + fade

**Accessibility:**
- `role="alert"` for errors
- `role="status"` for success/info
- `aria-live="polite"` or `"assertive"`

**Usage:**
```jsx
<Toast 
  message="Crop recommendations updated"
  type="success"
  duration={3000}
/>
```

---

### Alert
**Purpose:** Persistent notification or warning

**Props:**
```typescript
interface AlertProps {
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: React.ComponentType;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
}
```

**Usage:**
```jsx
<Alert 
  type="warning"
  title="Weather Alert"
  message="Heavy rainfall expected in your area"
  dismissible
  onDismiss={handleDismiss}
/>
```

---

### Progress Bar
**Purpose:** Show task progress

**Props:**
```typescript
interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
}
```

**Usage:**
```jsx
<ProgressBar 
  value={75}
  label="Profile completion"
  showPercentage
  color="primary"
/>
```

---

### Spinner / Loader
**Purpose:** Loading indicator

**Props:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'white';
  label?: string;
}
```

**Accessibility:**
- `role="status"`
- `aria-live="polite"`
- `aria-label` or visible text

**Usage:**
```jsx
<Spinner size="lg" label="Loading recommendations..." />
```

---

### Skeleton
**Purpose:** Placeholder for loading content

**Props:**
```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}
```

**Usage:**
```jsx
<Skeleton variant="rectangular" height={200} count={3} />
```

---

## Utility Components

### Badge
**Purpose:** Small count or status indicator

**Props:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'subtle';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  dot?: boolean;
}
```

**Usage:**
```jsx
<Badge variant="solid" color="success" pill>
  Active
</Badge>
```

---

### Avatar
**Purpose:** User profile image or initials

**Props:**
```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  name?: string; // For initials fallback
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
  shape?: 'circle' | 'square';
}
```

**Usage:**
```jsx
<Avatar 
  src="/avatars/user.jpg"
  alt="Ramesh Kumar"
  name="Ramesh Kumar"
  size="md"
  status="online"
/>
```

---

### Divider
**Purpose:** Visual separator

**Props:**
```typescript
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}
```

**Usage:**
```jsx
<Divider label="OR" />
```

---

### Tooltip
**Purpose:** Contextual help on hover

**Props:**
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
}
```

**Accessibility:**
- `aria-describedby` linking to tooltip
- Keyboard focus shows tooltip

**Usage:**
```jsx
<Tooltip content="Temperature in Celsius" placement="top">
  <span>28°C</span>
</Tooltip>
```

---

### Empty State
**Purpose:** Show when no data is available

**Props:**
```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```jsx
<EmptyState 
  title="No crops recommended"
  description="Update your location to get personalized recommendations"
  icon={Sprout}
  action={{ label: "Update Location", onClick: handleUpdateLocation }}
/>
```

---

## Component Testing Examples

### Unit Test (Jest + React Testing Library)
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Test
```jsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RecommendationCard } from './RecommendationCard';

expect.extend(toHaveNoViolations);

describe('RecommendationCard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <RecommendationCard 
        crop="Rice"
        matchScore={95}
        // ... other props
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

**End of Component Library Specification**
