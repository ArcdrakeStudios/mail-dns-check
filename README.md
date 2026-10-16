# Mail DNS Check

Understand a domain's public email configuration and compare it with your provider's setup instructions. Mail DNS Check shows MX, SPF and DMARC records, plus DKIM records when you supply a selector.

**[Open Mail DNS Check](https://tools.arcdrake.com/mail-dns/)** · [Download source](https://github.com/ArcdrakeStudios/mail-dns-check/archive/refs/heads/main.zip) · [Arcdrake Tools](https://tools.arcdrake.com/) · [Report an issue](https://github.com/ArcdrakeStudios/mail-dns-check/issues)

## How to use it

- **Need help with your mailbox or a missing message?** Choose mailbox help. It explains where to seek account or message support without collecting your address or querying DNS. Checking `gmail.com` or another provider's domain cannot diagnose your individual mailbox.
- **Checking a domain's email setup?** Choose public DNS inspection, enter the domain and select **Check public DNS**. You can inspect public records without owning the domain; changing them requires its DNS administrator.
- **Just exploring?** Choose public DNS inspection, then load the fictional demo to see a report without making any DNS requests.

An email address requires a separate confirmation to check only its domain. The part before `@` is never sent to the DNS resolver. If your provider gives you a DKIM selector, enter it; leaving it empty skips that lookup.

<details>
<summary>View desktop screenshot</summary>

![Mail DNS Check with fictional example data](docs/screenshot-desktop.png)

</details>

[Mobile screenshot](docs/screenshot-mobile.png). Screenshots show the standalone application with fictional data.

## Privacy and limitations

Live checks send the requested DNS names to Cloudflare's DNS-over-HTTPS resolver at `https://cloudflare-dns.com/dns-query`. These direct browser requests expose your public IP address and the requested DNS names to Cloudflare. The application does not send mail, contact mail servers, access accounts, guess DKIM selectors or run background checks.

English and German are available. Only the language preference is stored locally; domains, selectors and results are not saved by the application. The fictional demo and mailbox-help path make no DNS queries.

Results are observations of public DNS, not a mailbox diagnosis, authentication test, deliverability score or safety verdict. SPF dependencies and sender matching are not evaluated. DMARC checks the exact domain; organizational-domain policy discovery and inheritance are not evaluated. DKIM keys and message signatures are not validated. See [DNS interpretation and test coverage](docs/VERIFICATION.md) for the remaining boundaries.

The hosted site receives ordinary page and asset requests. See its [privacy information](https://tools.arcdrake.com/privacy/) for hosting details.

## Run locally

Download and extract the source ZIP, or clone this repository. Open a terminal
in the resulting folder.

Install Node.js 24 or newer, then run from this repository:

```sh
npm run preview
```

Open http://127.0.0.1:43220/. Stop the preview with Ctrl+C. The preview also stops automatically after 20 minutes. No package installation is needed to run the application. Serve it over HTTP(S), rather than opening `index.html` directly. The files in `dist/` are the application source; there is no compilation step.

## Development

Packaging additionally requires Python 3.11 or newer available as `python`, because the npm script calls that command. Check `python --version`; if your system only provides `python3`, configure your Python installation or PATH so `python` selects Python 3.11 or newer. Install the locked development tools and run the checks:

```sh
npm ci
npx playwright install chromium
npm test
npm run test:ci
npm run test:localization
npm run package:release
```

Browser checks manage their own local servers. Leave the preview port free before running them. The package command writes static files and a SHA-256 manifest to `artifacts/release/`; it does not publish or deploy.

Automated browser coverage uses Chromium, including narrow layouts. Safari, Firefox, physical devices and screen readers have not been verified for this app. Report compatibility problems with your browser version and a fictional example.

See [contributing](CONTRIBUTING.md), [language support](docs/LOCALIZATION.md) and [packaging and hosting](docs/RELEASING.md).

## License and support

An [Arcdrake](https://arcdrake.com/) product. Free to use, modify and redistribute under the [MIT license](LICENSE). See [third-party notices](THIRD_PARTY_NOTICES.md) for attribution.

Use the [issue tracker](https://github.com/ArcdrakeStudios/mail-dns-check/issues) for bugs and suggestions. Do not include private account details or credentials. Report security vulnerabilities through the [private reporting channel](SECURITY.md).

Feature requests are welcome in the issue tracker. To contribute an improvement,
see [the contribution guide](CONTRIBUTING.md).
