---
layout: layout.njk
---

# How is this Website Hosted and Developed?

Truthfully, I do not consider myself a technologist. The primary purpose of this website is to publish my creative work, whatever that may be (as well as motiviate myself to polish this work to the point that I feel comfortable publishing it in the first place). The website itself, and the solutions utilized to build and maintain it, should be as simple as possible, with some breathing room left to account for future increases in features and complexity.

## Summary

Website:
- Website assets are created using [11ty](https://www.11ty.dev/).
- Static site assets hosted on an [S3](https://aws.amazon.com/s3/) bucket.
- [Cloudfront](https://aws.amazon.com/cloudfront/) distribution connected to S3 bucket.
- Domain, subdomain records managed with [Route 53](https://aws.amazon.com/route53/).

Dev loop:
- Source code is hosted on GitHub; feature work is performed on branches.
- Write page content, mostly with (templated) markdown files, directly in [VS Code](https://code.visualstudio.com/).
- Test website with `npx @11ty/eleventy --serve`.
- Merge changes to main.
- (Locally) build website with 11ty.
- Push build artifact to S3 bucket.


## How is this Website Hosted?

(More details to come. I only chose cloudfront for easy TLS.)

## How are Changes to this Website Developed?

(Pretend there is some explanation here.)

## Discussion of Design Trade-Offs and Future Concerns

tk
