# Demo Agenda Sidebar Chrome Extension

A Chrome extension that displays a demo agenda sidebar for internal demos. This tool enhances demos by showing a structured agenda with progress tracking alongside your solution.

## Features

- 📋 Collapsible sidebar with step-by-step demo agenda
- 🎯 Visual progress tracking for steps and substeps
- ⌨️ Global keyboard navigation
- 🔄 Auto-scrolling to keep active steps centered
- 🎨 Customizable styling and branding
- 📱 Responsive design that adjusts main content

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extension directory

## Usage

### Keyboard Controls
- **Numpad 6**: Move to next step/substep
- **Numpad 4**: Move to previous step/substep
- **ESC**: Toggle sidebar visibility

### Configuration

The extension can be customized via `configuration.json`:

```json
{
  "steps": [
    {
      "title": "Part 1 - View Commission",
      "img": "/assets/avatar_1.jpg",
      "name": "Lidia Johnson",
      "role": "Head of Sales",
      "subSteps": ["Commission Earned", "Compensation Statement", "Analyze"]
    }
  ],
  "logo": {
    "url": "/assets/company-logo.png",
    "height": 89,
    "display": true
  },
  "keyboard": {
    "nextKey": "Numpad6",
    "previousKey": "Numpad4",
    "toggleKey": "Escape"
  }
}
```

### File Structure
```
demo-agenda-extension/
├── manifest.json
├── content.js
├── background.js
├── sidebar.html
├── styles.css
├── configuration.json
└── assets/
    └── [images]
```

## Customization

### Styling
Modify `styles.css` to match your brand's look and feel:
- Colors
- Fonts
- Spacing
- Transitions

### Logo
- Set `logo.display: false` to hide the logo
- Adjust `logo.height` to change logo size
- Update `logo.url` to use your own logo

### Keyboard Shortcuts
Modify `keyboard` in configuration.json to change navigation keys:
```json
"keyboard": {
  "nextKey": "Numpad6",
  "previousKey": "Numpad4",
  "toggleKey": "Escape"
}
```

## Development

### Prerequisites
- Chrome browser
- Basic understanding of Chrome extension architecture
- Familiarity with HTML, CSS, and JavaScript

### Local Development
1. Make changes to the source files
2. Reload the extension in Chrome
3. Test changes on various websites

### Building
No build process required - the extension runs directly from source.

## Technical Details

- Uses Manifest V3
- Implements content scripts for page integration
- Uses message passing for component communication
- Handles iframe communication for navigation
- Maintains state across navigation

## Troubleshooting

Common issues and solutions:

1. **Sidebar not appearing**
   - Check if the extension is enabled
   - Ensure no conflicts with page CSS

2. **Keyboard navigation not working**
   - Verify NumLock is on for numpad keys
   - Check console for errors
   - Ensure no key binding conflicts

3. **Layout issues**
   - Check z-index conflicts
   - Verify CSS specificity
   - Inspect element positioning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Authors

Bohdan