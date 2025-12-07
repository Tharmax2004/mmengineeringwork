# MM Engineering Website

A complete responsive company website built with HTML, CSS, and JavaScript.

## 📁 Folder Structure

```
website/
├── index.html          # Home page
├── about.html          # About page
├── projects.html       # Projects page with upload functionality
├── contact.html        # Contact page with form and map
├── css/
│   └── style.css      # Global styles
├── js/
│   └── script.js      # JavaScript functionality
├── images/
│   ├── logo.png       # Company logo (place your logo here)
│   └── background.jpg # Home page background (place your background image here)
└── README.md          # This file
```

## 🖼️ Image Setup

**Important:** You need to place your images in the `images/` folder:

1. **Logo**: Save your company logo as `logo.png` (or update the path in HTML files)
   - Recommended size: 40px height, transparent background
   - Formats: PNG, SVG, or JPG

2. **Background Image**: Save your home page background as `background.jpg` (or update the path in `index.html`)
   - Recommended size: 1920x1080px or larger
   - Formats: JPG, PNG, or WebP

## 🚀 Features

- ✅ **Animated Custom Cursor** - Circle follow effect on all pages
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Smooth Animations** - Fade-in effects and hover transitions
- ✅ **File Upload** - Upload project files (PDF, ZIP, DOC) and images
- ✅ **Image Preview** - Preview images before adding to gallery
- ✅ **Local Storage** - Uploaded items persist in browser
- ✅ **Form Validation** - Real-time contact form validation
- ✅ **Google Maps** - Embedded map on contact page
- ✅ **Mobile Menu** - Hamburger menu for mobile devices

## 📝 Usage

1. Place your logo and background image in the `images/` folder
2. Open `index.html` in a web browser
3. Navigate through the pages using the navigation menu

## 🎨 Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #3b82f6;
}
```

### Company Information
Update company details in `contact.html` (address, phone, email, hours)

### Google Maps
Replace the iframe `src` in `contact.html` with your actual location's Google Maps embed URL.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available for use.

