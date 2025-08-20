# GitHub Pages Deployment Setup

This project includes a GitHub Actions workflow to automatically deploy the presentations to GitHub Pages.

## Setup Instructions

1. **Enable GitHub Pages in your repository:**
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Update the repository name in the workflow:**
   - Edit `.github/workflows/deploy-presentations.yml`
   - Change `PUBLIC_URL: /ctp-presentations` to match your repository name
   - Format should be: `/your-repository-name`

3. **Ensure GitHub Actions permissions:**
   - Go to Settings → Actions → General
   - Under "Workflow permissions", select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

4. **Trigger deployment:**
   - Push to the `main` branch, or
   - Go to Actions tab → Deploy Presentations to GitHub Pages → Run workflow

## How it works

The workflow:
1. Builds the Vite project in the `presentations/` directory
2. Sets the base path for assets to work on GitHub Pages
3. Uploads the built files as artifacts
4. Deploys them to GitHub Pages

## Access your deployed site

After successful deployment, your presentations will be available at:
`https://[your-username].github.io/[repository-name]/`

## Troubleshooting

- **404 errors:** Make sure the `PUBLIC_URL` in the workflow matches your repository name
- **Build failures:** Check that all dependencies are installed with `npm ci`
- **Deployment failures:** Ensure GitHub Pages is enabled and set to use GitHub Actions as the source