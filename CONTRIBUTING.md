# Contributing to Future Engineers

Thank you for your interest in contributing to Future Engineers! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
- Fork the project on GitHub
- Clone your fork locally
- Add the original repository as a remote

```bash
git clone https://github.com/yourusername/future_engineers.git
cd future_engineers
git remote add upstream https://github.com/originalowner/future_engineers.git
```

### 2. Set Up Development Environment
- Follow the setup instructions in the README.md
- Ensure all environment variables are properly configured
- Run `npm install` to install dependencies
- Test that the application runs with `npm run dev`

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes
- Write clean, readable code
- Follow the existing code style and conventions
- Add comments where necessary
- Test your changes thoroughly

### 5. Commit Your Changes
- Use clear, descriptive commit messages
- Follow conventional commit format:

```bash
git commit -m "feat: add new PDF viewer component"
git commit -m "fix: resolve authentication issue"
git commit -m "docs: update installation instructions"
```

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots if applicable
- Testing information

## 📋 Code Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop typing

### Styling
- Use Tailwind CSS for styling
- Follow the existing design patterns
- Ensure responsive design

### File Organization
- Place components in appropriate directories
- Use clear, descriptive file names
- Follow the existing folder structure

## 🧪 Testing

- Test your changes in different browsers
- Verify responsive design on various screen sizes
- Test authentication flows
- Ensure PDF upload/download functionality works

## 📝 Documentation

- Update README.md if needed
- Add comments to complex code
- Update type definitions
- Document new environment variables

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 💡 Feature Requests

When suggesting features:
- Explain the use case
- Describe the proposed solution
- Consider alternative approaches
- Think about implementation complexity

## 🔍 Review Process

All pull requests will be reviewed for:
- Code quality and style
- Functionality and testing
- Documentation completeness
- Security considerations
- Performance impact

## 📞 Getting Help

- Create an issue for questions
- Check existing issues and discussions
- Contact maintainers if needed

## 🙏 Recognition

Contributors will be recognized in:
- README.md acknowledgments
- Release notes
- Project documentation

Thank you for helping make Future Engineers better! 🚀
