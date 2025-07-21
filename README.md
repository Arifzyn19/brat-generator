# Brat Generator

A web-based text generator that creates stylized text graphics inspired by the "brat" aesthetic. This project allows users to generate custom text with a distinctive visual style.

## 🚀 Features

- Generate custom text with brat-style typography
- Responsive text fitting using textFit.js
- Clean and modern web interface
- Optimized font loading with multiple formats (WOFF, WOFF2, TTF, SVG, EOT)
- Webpack build system for optimized production builds
 
## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Build Tool**: Webpack
- **Typography**: Custom web fonts (Arial Narrow, Compacta Black, Times Roman)
- **Text Fitting**: textFit.js library

## 📁 Project Structure

```
brat-generator/
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Lock file for dependencies
├── webpack.config.js         # Webpack configuration
└── src/
    ├── index.html           # Main HTML file
    ├── index.js             # Entry point JavaScript
    ├── fonts/               # Custom web fonts
    │   ├── arial_narrow-webfont.*
    │   ├── compacta_black_regular-webfont.*
    │   └── times-roman-01-webfont.*
    ├── images/              # Project images
    │   ├── brat.png
    │   └── brat-deluxe.png
    ├── js/                  # JavaScript modules
    │   ├── App.js           # Main application logic
    │   └── textFit.js       # Text fitting utility
    └── styles/
        └── main.css         # Main stylesheet
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Arifzyn19/brat-generator.git
cd brat-generator
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Create a production build:
```bash
npm run build
```

## 🎨 Usage

1. Open the application in your web browser
2. Enter your desired text in the input field
3. The generator will automatically create a stylized version of your text
4. Customize the appearance using available options

## 🔧 Configuration

The project uses Webpack for bundling and optimization. You can modify the `webpack.config.js` file to customize the build process according to your needs.

## 📝 Font Credits

This project uses the following custom fonts:
- Arial Narrow
- Compacta Black Regular
- Times Roman

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Arifzyn19**
- GitHub: [@Arifzyn19](https://github.com/Arifzyn19)
- Project Link: [https://github.com/Arifzyn19/brat-generator](https://github.com/Arifzyn19/brat-generator)

## 🙏 Acknowledgments

- textFit.js for responsive text fitting
- Web font optimization techniques
- JavaScript and CSS best practices
---

*Made with ❤️ by Arifzyn19* 