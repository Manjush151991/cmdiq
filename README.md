# CMDIQ Dashboard

This is the production-ready version of the CMDIQ unified endpoint management dashboard.

## Features

- Mobile responsive
- Dark mode support
- Progressive Web App (PWA)
- AI assistant integration
- Accessibility improvements
- SEO meta tags

## Local Testing (Frontend Only)

```bash
python3 -m http.server 8000
```
Visit http://localhost:8000

## Backend API (Flask)

- Python 3.8+
- Install requirements:
  ```bash
  pip install -r requirements.txt
  ```
- Run the API:
  ```bash
  python app.py
  ```
- The API will be available at http://127.0.0.1:8000

## Environment Setup
- Ensure you have Python 3.8 or higher.
- For local development, use a virtual environment:
  ```bash
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

## Deployment to GitHub Pages
1. Push your code to the `main` branch of your GitHub repository.
2. Go to the repository settings and enable GitHub Pages.
3. Set the source to the `main` branch and save.
4. Your site will be available at `https://<username>.github.io/<repository-name>/`.

## Notes
- For production, set `debug=False` in app.py
- The frontend expects the API to be available at the same host/port or configure CORS as needed.