Moved to my new website [www.ritalighosh.com](https://www.ritalighosh.com/)!

---

### Welcome to my website design documentation! <img src="https://slackmojis.com/emojis/4975-party/download" width=40>

<p> 
  <img alt="github actions" src="https://img.shields.io/badge/-Github_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=black" />
  <img alt="git" src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=black" />
  <img alt="html5" src="https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=black" />
<p>

I have used an [HTML5 UP](https://html5up.net/) template to generate a static website, which is deployed by [GitHub Actions](https://docs.github.com/en/actions) to the `gh-pages` branch which is made live at my URL. Here's a short documentation on an easy website deployment that I figured out out of so many available resources on the web!

### <img src="https://slackmojis.com/emojis/149-sonic/download" width=40> Workflow to deploy the site
Only the generated files from your build folder are deployed to the `gh-pages` branch, including an automated sitemap generation, which we will discuss. Configure GitHub Pages to use `gh-pages` as the deployment source to make it live. 
Go to the repository's `Setting` > `Pages` > Under `Build and Deployment` header, select `Deploy from a branch` as the Source > Select `gh-pages` branch with `/root` directory for deployment.


Create a file `deploy_site.yml` in the directory `.github/workflows` in your main branch. The GitHub Action to build the site (named 'Build') is triggered on the main branch on push and pull requests. The `workflow_dispatch` event allows you to manually triggered with the workflow, by clicking on `Run workflow` button on the Actions tab, whenever you need.

```yaml
name: Build
on:
  push:
    branches: [ main ] 
  pull_request:
    branches: [ main ]
  workflow_dispatch:
```

We will create two jobs:
1. `Build` to build and deploy the site to `gh-pages` branch (which sets our website live). Firstly, checkout to your repo on the ubuntu-latest machine with the action [actions/checkout](https://github.com/peaceiris/actions-gh-pages). Then, we will choose `publish_dir: ./html` (as the /html folder contains all the .html files to build the site) as the  to `Deploy` the final files with the action [peaceiris/actions-gh-pages@v4](https://github.com/peaceiris/actions-gh-pages) on to the `publish_branch: gh-pages`. 
```yaml
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Deploy
      if: ${{ github.event_name == 'push' }}
      uses: peaceiris/actions-gh-pages@v4
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./html
        cname: YOUR.CUSTOM.URL
        user_name: 'github-actions[bot]'
        user_email: 'github-actions[bot]@users.noreply.github.com'
        enable_jekyll: false
        publish_branch: gh-pages
        force_orphan: true
```
NOTE: A GitHub Actions runner automatically creates a secret GITHUB_TOKEN to authenticate in your workflow. You can, therefore, start deploying without any configuration (*no need to create a personal access token*). In the publish directory, an empty `.nojekyll` file will be created when `enable_jekyll: false`, which you would need if your files are not to be published with Jekyll. If you have not configured a custom domain, the URL defaults to `https://{USERNAME}.github.io/{REPO_NAME}`. For your custom domain, the cname option puts the CNAME file  in the publish directory with `YOUR.CUSTOM.URL`. Check out [create-pull-request](https://github.com/peter-evans/create-pull-request) action for more details on the GitHub workflows.

1. `Sitemap` to generate `sitemap.xml` file, once the previous `build` job has been deployed to the `gh-pages` branch. We will check out to the `gh-pages` branch (`ref:` option with `actions/checkout@v4`) and use the [generate-sitemap](https://github.com/cicirello/generate-sitemap) action  whenever a push or pull request is triggered.
  ```yaml
    sitemap:
        name: Sitemap
        needs: build
        runs-on: ubuntu-latest
        steps: 
        - name: Checkout to the gh-pages branch
          uses: actions/checkout@v4
          with:
            fetch-depth: 0
            ref: gh-pages     
        - name: Sitemap generation
          id: sitemap
          uses: cicirello/generate-sitemap@v1
          with:
            base-url-path: YOUR.CUSTOM.URL # OR https://{USERNAME}.github.io/{REPO_NAME}
            include-pdf: true
  ```
 
You can create a pull request in the `Sitemap` job with your custom message to verify the sitemap generated.
 ```yaml 
        - name: Create Pull Request
          uses: peter-evans/create-pull-request@v6
          with:
            title: "Automated sitemap update"
            body: > 
                Sitemap updated by the [generate-sitemap](https://github.com/cicirello/generate-sitemap) 
                GitHub action. Automated pull-request generated by the 
                [create-pull-request](https://github.com/peter-evans/create-pull-request) GitHub action.
            branch: sitemap-auto-pull
            committer: github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>
            author: ${{ github.actor }} <${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com>
            delete-branch: true
```
(This creates a temporary branch `sitemap-auto-pull`, which is auto-deleted when the pull request gets merged.)

If everything works fine, within the `Sitemap` job you can create a push action to the `gh-pages` branch to automatically update the sitemap on every deployment.
```yaml
        - name: Commit website sitemap and push all commits to gh-pages
          run: |
            git config --global user.name "${GITHUB_ACTOR}"
            git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"
            git add .
            git commit -m "Sitemap update with GitHub action."
            git push
```

### <img src="https://slackmojis.com/emojis/17617-mariodance_pbj/download" width=60> Hey, that was cool!
