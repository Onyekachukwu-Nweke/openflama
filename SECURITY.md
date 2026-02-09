# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.1.x   | Yes                |

## Reporting a Vulnerability

If you discover a security vulnerability in OpenFlama, please report it
responsibly.

**Do not open a public issue for security vulnerabilities.**

Instead, please send an email to the project maintainers with:

1. A description of the vulnerability
2. Steps to reproduce the issue
3. Potential impact assessment
4. Any suggested fixes (optional)

We will acknowledge receipt within 48 hours and aim to provide a fix within
7 days for critical vulnerabilities.

## Security Best Practices

When deploying OpenFlama:

- Never expose database credentials in client-side code
- Use environment variables for all secrets
- Enable HTTPS in production
- Keep dependencies updated
- Review API access controls before exposing endpoints publicly
