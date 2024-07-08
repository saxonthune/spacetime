---
layout: layout.njk
---

# How is this Website Hosted and Developed?

I believe that the open-source movement will prevail when paired with _open knowledge_. It's not enough to maintain a code repository and a readme file with installation instructions; we should strive to share _all_ of the knowledge necessary to reproduce our work. The point of this page is to share the knowledge not conveyed in code, namely my hosting setup and development process.

Truthfully, I do not consider myself a technologist. The primary purpose of this website is to publish my creative work, whatever that may be (as well as motivation to polish this work to the point that I feel comfortable publishing it in the first place). The guiding principle here is that the website itself, and the solutions utilized to build and maintain it, should be as simple as possible, with some breathing room left to account for future increases in features and complexity.

## Summary

Website:
- Website assets are created using [11ty](https://www.11ty.dev/).
- Static site assets are hosted on an [S3](https://aws.amazon.com/s3/) bucket.
- [Cloudfront](https://aws.amazon.com/cloudfront/) distribution is connected to S3 bucket.
- Domain, subdomain records are managed with [Route 53](https://aws.amazon.com/route53/).

Dev loop:
- Source code is hosted on [GitHub](https://github.com/saxonthune/spacetime).
- Page content is written, mostly with markdown, in [VS Code](https://code.visualstudio.com/).
- Local testing via `npx @11ty/eleventy --serve`.
- Site assets are built locally with 11ty.
- Assets are pushed to the S3 bucket.

## How is this Website Hosted?

Let's walk through the needs for the website, and we'll build up our use case until we arrive at the solution described above.

First, I knew that I wanted a CMS solution that was more free-form than Wordpress, while still providing an easy path to spit out content. I quickly learned about static site generators (SSGs). At this point I don't remember why I landed on 11ty -- probably some reddit threads. After covering the content generation piece, I needed to turn to hosting.

I wanted to use AWS for hosting. There are two reasons for this. First, I use AWS at my job, meaning I already have some familiarity with basic services and navigating the console. Any skills I pick up here can feed back into my job, too. Second, when I launched this site, I was managing my domain in Route 53, meaning that I already had an AWS account set up. Vendor lock-in strikes again!

Because the SSG spits out static files, the website can be hosted on an S3 bucket, which is much cheaper than, say, a web server hosted on an EC2 instance. While S3 does have an option to host the bucket as a website (how does AWS actually do this?), where are a few drawbacks. There are no options for HTTPS, and I have some security concerns over allowing anyone on the internet to access the bucket directly.

To everyone's surprise, AWS has yet another product to cover this use-case: CloudFront. It was simple enough to create a distribution, point it to the S3 bucket, and add permissions to allow CloudFront to read from the bucket. With the distribution in place, the last step was to create a CNAME record in Route 53, linking the subdomain name to the CloudFront URL.

Not so bad! Here's an extremely basic diagram:

{% image "./how-this-site-is-hosted_diagram.JPEG", "Architecture diagram for website hosting." %}

### Cloudfront Setup

I ran into a few issues at first; here's a quick rundown of the fixes I implemented.

#### Error Pages

By default, CloudFront will serve a boilerplate xml response from the S3 bucket upon encountering an error (e.g., `404 Not Found`). Thankfully, there's an easy way to point a user to a specified error page, found in the distribution settings.

{% image "./how-this-site-is-hosted_errorpages.PNG", "Screenshot of Function associations window in AWS Console." %}

#### Redirect from Subdirectory Root to ./index.html

When we make a request to a url ending with a subdirectory (e.g., `https://spacetime.saxon.zone/website/how-this-site-is-hosted/`), we expect that the `index.html` file inside of that subdirectory is served (in this case `https://spacetime.saxon.zone/website/how-this-site-is-hosted/index.html`).

However, CloudFront does not do this automatically. We remedy this by adding a CloudFront function for any request sent to the server. The menu for this is located in `CloudFront > Distributions > [Distribution id] > Behaviors`, and we're editing the behavior for the default pattern (`Default (*)`).

{% image "./how-this-site-is-hosted_redirection-function.PNG", "Screenshot of Function associations window in AWS Console." %}

A CloudFront Function is a javascript function that _I believe_ runs on Amazon servers near the CloudFront CDNs. In our case, we just need the function to check the request URL, and append the `index.html` if needed:

```js
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Check whether the URI is missing a file name.
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } 
    // Check whether the URI is missing a file extension.
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
```

(Shoutout to this [stackoverflow answer](https://stackoverflow.com/a/69157535).)

## How are Changes to this Website Developed?

There's probably less to explain here. VS code is lightweight, easy to use, has git features, and has a vim plugin.

I expect to make a git branch for each page or website feature, only pushing changes to from the main branch. This feels a little silly, given that I'm the only person who should ever contribute to my personal website.

At some point, I'll write a build script, which compiles the website and pushes it to the S3 bucket.

## Design Trade-Offs and Future Concerns

My greatest fear is that I'll need some new feature for the website, and that implementing it will be too difficult to achieve in 11ty. Beyond that, I'm keeping an eye on costs in AWS.

One consequence of this system is that my writing is directly captured and saved as source code. In a single markdown file, I'll have my thoughts mediated into the written word, smooshed in between links, 11ty shortcodes, layout references, etc. Ideally, it would be better to separate the writing itself from the grunginess of instructions that make the webpage pretty and interactive. I don't know how to do this easily without creating a ton of overhead, so this consequence will just have to remain in place.

I'm going to make a "roadmap" page with a list of new functionalities I intend to add, such as mathjax/LateX support, some 11ty/shortcode work for image captions, and footnotes.
